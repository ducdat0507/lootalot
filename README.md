# `lootalot`

`lootalot` is a library for efficiently simulating loot drops. It is suitable for incremental games where a large amount of loot might need to be made at once.

## Try it
https://ducdat0507.github.io/lootalot

## Example usage:
```js
import { LootTable } from 'lootalot';

// Make a loot table for our example monster
// We'll make 2 pools of items to choose from
let table = new LootTable(
    [
        // Drop any one of these items at varied chances
        { item: "Apple",  w: 1 },
        { item: "Banana", w: 2 },
        { item: "Citrus", w: 0.5 },
    ],
    [
        // Additionally, drop an extra 150~250 gold
        { item: "Gold", count: [150, 250], step: 50 }
    ],
);

// Kill our monster one trillion times, why not?
let loot = table.loot(1_000_000_000_000);

// Display our loot
console.log(loot);
// Result should look like this, actual numbers may vary due to randomness:
// [
//     {
//         "item": "Banana",
//         "count": 571428528445
//     },
//     {
//         "item": "Apple",
//         "count": 285714017436
//     },
//     {
//         "item": "Citrus",
//         "count": 142857454119
//     },
//     {
//         "item": "Gold",
//         "count": 199999991656400
//     }
// ]
```