

/** The loot table preference object type used to detemine how a specific loot table behaves. */
export type LootTablePrefs = {
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