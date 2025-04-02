import { LootTablePrefs } from "./prefs";
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
    /** The distance between possible count values. */
    step?: number;
} & ValidLootItemDefinition<TItem>;
/** A pool of loot, which contains loot defintions. */
type LootPool<TItem> = LootDefinition<TItem>[];
type LootDefinitionInternal<TItem> = {
    w: number;
    cascadeP: number;
    count: Range;
    step: number;
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
