/** The range, can be a constant or an uniform range */
type Range = number | [min: number, max: number];
/** A valid item loot definition, should be one of the following:
 *    - Nothing (no item)
 *    - A constant `item` (one item)
 *    - A loot `table` (multiple items)
 *    - A partial constant `item` + a partial loot `table` (where `typeof item & typeof table == TItem`)
 */
type ValidLootItemDefinition<TItem> = {
    item?: undefined;
    table?: undefined;
} | {
    item: TItem;
    table?: undefined;
} | {
    item?: undefined;
    table: LootTable<TItem>;
} | {
    item: Partial<TItem>;
    table: LootTable<Partial<TItem>>;
};
/** A loot definition, contains information such as the item the probability of that item. */
type LootDefinition<TItem> = {
    /** Weight or relative probability of the item. */
    w?: number;
    /** Absolute probability of the item. The sum of probability values in a loot pool can not be greater than 1. */
    p?: number;
    /** The number of this item can be dropped at once in a roll. */
    count?: Range;
} & ValidLootItemDefinition<TItem>;
/** A pool of loot, which contains loot defintions. */
type LootPool<TItem> = LootDefinition<TItem>[];
type LootDefinitionInternal<TItem> = {
    w: number;
    cascadeP: number;
    count: Range;
} & ValidLootItemDefinition<TItem>;
type LootPoolInternal<TItem> = LootDefinitionInternal<TItem>[];
/** A loot result object, returned from the `LootTable.loot()` function. */
type Loot<TItem> = {
    /** The type of item. */
    item: TItem;
    /** Number of items looted. */
    count: number;
};
/** An array of loot, returned from the `LootTable.loot()` function. */
type LootResult<TItem> = Loot<TItem>[];
/** Preferences object. */
export declare let prefs: {
    /** The maximum allowed precision error of thresholds such as the sum of probabilty values error. */
    ARITHMETIC_ERROR: number;
    /** The maximum amount of times can we roll the RNG manually (for accuracy)
     *  before it's better to approxmiate the rolling using math (for performance) instead. */
    MAX_REPEAT: number;
    /** The default value of new loot tables' preferences object  */
    DEFAULT_TABLE_PREFS: LootTablePrefs;
};
/** The loot table preference object type used to detemine how a specific loot table behaves. */
type LootTablePrefs = {
    /** The algorithm used to determine if two item entries are equal, used to merge loot results. */
    duplicateSearchMode: DuplicateSearchMode;
};
/** The algorithm used to determine if two item entries are equal, used to merge loot results. */
declare enum DuplicateSearchMode {
    /** Items are compared using the loose equal operator (`==`). */
    "equal" = "equal",
    /** Items are compared using the strict equal operator (`===`). */
    "strict_equal" = "strict_equal",
    /** Items are converted to JSON strings and then compared using the strict equal operator (`===`). */
    "json" = "json"
}
/** A loot table, containing the rules used to determine loot drops. */
export declare class LootTable<TItem> {
    pools: LootPoolInternal<TItem>[];
    prefs: LootTablePrefs;
    constructor(...pools: LootPool<TItem>[]);
    /** Loot this loot table.
     * @argument {number} trials - The amount of times will this function loot
    */
    loot(trials: number): LootResult<TItem>;
    isDuplicate(a: TItem, b: TItem): boolean | undefined;
}
export {};
