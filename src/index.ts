import { coin_flip, dice_roll } from "./math";

/** The range, can be a constant or an uniform range */
type Range = number | [min: number, max: number];

/** A valid item loot definition, should be one of the following:
 *    - Nothing (no item)
 *    - A constant `item` (one item)
 *    - A loot `table` (multiple items)
 *    - A partial constant `item` + a partial loot `table` (where `typeof item & typeof table == TItem`)
 */
type ValidLootItemDefinition<TItem> = 
    { item?: undefined,      table?: undefined                 } |
    { item:  TItem,          table?: undefined                 } |
    { item?: undefined,      table:  LootTable<TItem>          } |
    { item:  Partial<TItem>, table:  LootTable<Partial<TItem>> }

/** A loot definition, contains information such as the item the probability of that item. */
type LootDefinition<TItem> = { 
    /** Weight or relative probability of the item. */
    w?: number,
    /** Absolute probability of the item. The sum of probability values in a loot pool can not be greater than 1. */
    p?: number,
    /** The number of this item can be dropped at once in a roll. */
    count?: Range 
} & ValidLootItemDefinition<TItem>;

/** A pool of loot, which contains loot defintions. */
type LootPool<TItem> = LootDefinition<TItem>[];

type LootDefinitionInternal<TItem> = { 
    w: number,
    cascadeP: number,
    count: Range 
} & ValidLootItemDefinition<TItem>;

type LootPoolInternal<TItem> = LootDefinitionInternal<TItem>[];

/** A loot result object, returned from the `LootTable.loot()` function. */
type Loot<TItem> = { 
    /** The type of item. */
    item: TItem, 
    /** Number of items looted. */
    count: number
};

/** An array of loot, returned from the `LootTable.loot()` function. */
type LootResult<TItem> = Loot<TItem>[];

/** Preferences object. */
export let prefs = {
    /** The maximum allowed precision error of thresholds such as the sum of probabilty values error. */
    ARITHMETIC_ERROR: 1e-8,
    /** The maximum amount of times can we roll the RNG manually (for accuracy)
     *  before it's better to approxmiate the rolling using math (for performance) instead. */
    MAX_REPEAT: 20,
    /** The default value of new loot tables' preferences object  */
    DEFAULT_TABLE_PREFS: {
        duplicateSearchMode: "equal",
    } as LootTablePrefs
}

/** The loot table preference object type used to detemine how a specific loot table behaves. */
type LootTablePrefs = {
    /** The algorithm used to determine if two item entries are equal, used to merge loot results. */
    duplicateSearchMode: DuplicateSearchMode 
}

/** The algorithm used to determine if two item entries are equal, used to merge loot results. */
enum DuplicateSearchMode {
    /** Items are compared using the loose equal operator (`==`). */
    "equal" = "equal", 
    /** Items are compared using the strict equal operator (`===`). */
    "strict_equal" = "strict_equal", 
    /** Items are converted to JSON strings and then compared using the strict equal operator (`===`). */
    "json" = "json"
}

/** A loot table, containing the rules used to determine loot drops. */
export class LootTable<TItem> {
    pools: LootPoolInternal<TItem>[] = [];
    prefs: LootTablePrefs = {...prefs.DEFAULT_TABLE_PREFS};

    constructor(...pools: LootPool<TItem>[]) {
        this.prefs = {...prefs.DEFAULT_TABLE_PREFS};

        for (let pool of pools) {
            let newPool: LootPoolInternal<TItem> = [];
            this.pools.push(newPool);

            let wExists = false, pExists = false, pSum = 0, wSum = 0;
            for (let def of pool) {
                wExists ||= def.w !== undefined || def.p === undefined;
                pExists ||= def.p !== undefined;
                pSum += def.p ?? 0;
                wSum += def.w ?? 1;
                if (wExists && pExists) throw Error("All loot definitions in a pool must either use `p` for probability or `w` for weight");
                if ((def.w ?? 1) < 0) throw Error("Weight can not be negative");
                if ((def.p ?? 0) < 0) throw Error("Probabilty can not be negative");
            }
            if (pSum > 1 + prefs.ARITHMETIC_ERROR) throw Error("All loot definitions in a pool must have their `p` values sum to 1 or less (sum = " + pSum + ")");
            if (pExists) wSum = 1;

            for (let def of pool) {
                // @ts-expect-error
                newPool.push({
                    w: def.w ?? def.p ?? 1,
                    cascadeP: 0,
                    item: def.item,
                    table: def.table,
                    count: def.count ?? 1,
                })
            }
            if (pExists && pSum < 1 - prefs.ARITHMETIC_ERROR) {
                newPool.push({
                    w: 1 - pSum,
                    cascadeP: 0,
                    count: 1,
                })
            }
            // Sort our item list by most common first
            newPool.sort((x, y) => y.w - x.w);

            // Calculate cascading probability
            for (let def of newPool) {
                def.cascadeP = def.w / wSum;
                wSum -= def.w;
            }
            newPool[newPool.length - 1].cascadeP = 1;
        }
    }

    /** Loot this loot table. 
     * @argument {number} trials - The amount of times will this function loot
    */
    loot(trials: number): LootResult<TItem> {
        let result: LootResult<TItem> = [];
        let dupFunc = (a: TItem, b: TItem) => this.isDuplicate.call(this, a, b);

        function addItem(item: TItem, count: number) {
            let entry = result.find(x => dupFunc(x.item, item));
            if (entry) entry.count += count;
            else result.push({ item, count });
        }

        for (let pool of this.pools) {
            let t = trials;
            for (let item of pool) {
                let times = coin_flip(t, item.cascadeP);
                if (times <= 0) continue;
                t -= times;

                let amount = 0;
                if (typeof item.count == "number") amount = times * item.count;
                else amount = dice_roll(times, item.count[0], item.count[1]);

                if (item.table !== undefined) {
                    let childLoot = item.table.loot(amount);
                    if (item.item !== undefined) childLoot = childLoot.map(x => ({...x, item: {...item.item, ...x.item} })) as LootResult<TItem>;
                    for (let loot of childLoot) addItem(loot.item as TItem, loot.count);
                } else if (item.item !== undefined) {
                    addItem(item.item, amount);
                }

                if (t <= 0) break;
            }
        }
        return result;
    }

    isDuplicate(a: TItem, b: TItem) {
        let pref = this.prefs.duplicateSearchMode;
        switch(pref) {
            case "equal": return a == b;
            case "strict_equal": return a === b;
            case "json": return JSON.stringify(a) == JSON.stringify(b);
        }
    }
}