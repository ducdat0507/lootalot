let { LootTable } = require("./dist/lootalot");

let subTable = new LootTable(
    [
        { w: 1, item: { subtier: 4, subquality: "Perfect" }, },
        { w: 2, item: { subtier: 3, subquality: "Greater" }, },
        { w: 4, item: { subtier: 2, subquality: "Normal" },  },
        { w: 7, item: { subtier: 1, subquality: "Lesser" },  },
    ]
);

let table = new LootTable(
    [
        { w: 1 / 1663200, item: { tier: 8, quality: "Otherworldly" }, table: subTable },
        { w: 1 / 151200,  item: { tier: 7, quality: "Celestial" },    table: subTable },
        { w: 1 / 15120,   item: { tier: 6, quality: "Mythical" },     table: subTable },
        { w: 1 / 1680,    item: { tier: 5, quality: "Legendary" },    table: subTable },
        { w: 1 / 210,     item: { tier: 4, quality: "Exquisite" },    table: subTable },
        { w: 1 / 30,      item: { tier: 3, quality: "Refined" },      table: subTable },
        { w: 1 / 5,       item: { tier: 2, quality: "Uncommon" },     table: subTable },
        { w: 1,           item: { tier: 1, quality: "Regular" },      table: subTable },
    ],
    [
        { w: 1,        item: { tier: 0, name: "Complimentary Common Currency" }, count: [5000, 25000], step: 5000 },
    ],
    [
        {
            table: new LootTable(
                [
                    { w: 1 / 9,    item: { tier: 0, name: "Complimentary Premium Currency" }, count: 3    },
                    { w: 1 / 3,    item: { tier: 0, name: "Complimentary Premium Currency" }, count: 2    },
                    { w: 1,        item: { tier: 0, name: "Complimentary Premium Currency" }, count: 1    },
                ]
            ),
            count: [1, 3],
            p: 1 / 100,
        }
    ],
);
table.prefs.duplicateSearchMode = "json";

let loot = table.loot(process.argv.find(x => x.startsWith("--count="))?.substring(8) ?? 1);
loot.sort((x, y) => (y.item.tier - x.item.tier) || (y.item.subtier - x.item.subtier));
console.log(loot.map(x => 
    " - " + ((x.item.name ?? (
        x.item.subquality + " " + x.item.quality + " Thing (" + x.item.tier + "-" + x.item.subtier + ")"
    ))).padStart(34) + " : "
    + x.count.toLocaleString("en-US")
).join("\n"));

table = new LootTable(
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
loot = table.loot(1e12);
console.log(JSON.stringify(loot, null, 4));
