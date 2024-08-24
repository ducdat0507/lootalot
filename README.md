# `lootalot`

`lootalot` is a library for efficiently simulating loot drops. It is suitable for incremental games where a large amount of loot might need to be made at once.

## Example usage:
```js
import { LootTable } from 'lootalot';

// Make a loot table for our example monster
// We'll make 2 pools of items to choose from
let table = new LootTable(
    [
        // Drop any one of these items at equal chances
        { item: "Apple" },
        { item: "Banana" },
        { item: "Citrus" },
    ],
    [
        // Additionally, drop an extra 150~250 gold
        {item: "Gold", count: [150, 250]}
    ],
);

// Kill our monster one trillion times, why not?
let loot = table.loot(1_000_000_000_000);

// Display our loot
console.log(loot);
// Result should look like this, actual numbers may vary due to randomness:
// [
//   { item: 'Apple', count: 333332232866 },
//   { item: 'Banana', count: 333332798993 },
//   { item: 'Citrus', count: 333334968141 },
//   { item: 'Gold', count: 200000023939135 }
// ]
```