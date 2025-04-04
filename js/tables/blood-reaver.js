tables.push({
    id: "blood-reaver",
    category: "Old School RuneScape",
    name: "Blood Reaver",
    sources: [
        "https://oldschool.runescape.wiki/w/Blood_Reaver#Drops"
    ],
    gen() {
        const { LootTable } = lootalot;

        const rareDropTable = new LootTable([
            { w: 113 },
            { w: 8, item: { color: "#ff00ff", name: "Rune spear" } },
            { w: 4, item: { color: "#ff00ff", name: "Shield left half" } },
            { w: 3, item: { color: "#ff00ff", name: "Dragon spear" } },
        ])

        const gemDropTable = new LootTable([
            { w: 63 },
            { w: 32,           item: { color: "#ff00ff", name: "Uncut sapphire" } },
            { w: 16,           item: { color: "#ff00ff", name: "Uncut emerald" } },
            { w: 8,            item: { color: "#ff00ff", name: "Uncut ruby" } },
            { w: 3,            item: { color: "#ff00ff", name: "Chaos talisman" } },
            { w: 3,            item: { color: "#ff00ff", name: "Nature talisman" } },
            { w: 2,            item: { color: "#ff00ff", name: "Uncut diamond" } },
            { w: 1,  count: 5, item: { color: "#ff00ff", name: "Rune javelin" } },
            { w: 1,            item: { color: "#ff00ff", name: "Loop half of key" } },
            { w: 1,            item: { color: "#ff00ff", name: "Tooth half of key" } },
            { w: 1, table: rareDropTable }
        ])

        return new LootTable(
            [{
                item: { name: "Malicious ashes" },
            }], 
            [{
                table: new LootTable([
                    { w: 0.2,                          item: { name: "Ancient ceremonial mask" } },
                    { w: 0.2,                          item: { name: "Ancient ceremonial top" } },
                    { w: 0.2,                          item: { name: "Ancient ceremonial legs" } },
                    { w: 0.2,                          item: { name: "Ancient ceremonial gloves" } },
                    { w: 0.2,                          item: { name: "Ancient ceremonial boots" } },
                    { w: 0.2,                          item: { name: "Ancient ceremonial boots" } },
    
                    { w: 15,      count: 25,           item: { name: "Astral rune" } },
                    { w: 7,       count: 250,          item: { name: "Air rune" } },
                    { w: 7,       count: 15,           item: { name: "Mud rune" } },
                    { w: 4,       count: 20,           item: { name: "Mind rune" } },
                    { w: 4,       count: 15,           item: { name: "Nature rune" } },
                    { w: 3,       count: 15,           item: { name: "Chaos rune" } },
                    { w: 2,       count: 150,          item: { name: "Air rune" } },
                    { w: 2,       count: 15,           item: { name: "Blood rune" } },
                        
                    { w: 3.125,                        item: { name: "Grimy avantoe" } },
                    { w: 2.5,                          item: { name: "Grimy ranarr weed" } },
                    { w: 2.5,                          item: { name: "Grimy snapdragon" } },
                    { w: 1.875,                        item: { name: "Grimy torstol" } },
                    
                    { w: 9,       count: 500,          item: { name: "Coins" } },
                    { w: 6,       count: [1300, 1337], item: { name: "Coins" } },
                    { w: 2,                            item: { name: "Coins" } },
                    
                    { w: 11,                           item: { name: "Magic potion(1)" } },
                    { w: 9,                            item: { name: "Prayer potion(2)" } },
                    { w: 2,                            item: { name: "Super defence(1)" } },
                    
                    { w: 8,       count: [1, 4],       item: { name: "Adamantite bar" } },
                    { w: 8,       count: [1, 10],      item: { name: "Coal" } },
                    { w: 8,       count: 23,           item: { name: "Pure essence" } },
                    { w: 7,                            item: { name: "Potato cactus" } },
                    { w: 1,                            item: { name: "Blood essence" } },
                    { w: 1,       count: [2, 7],       item: { name: "Nihil shard" } },
                    
                    { w: 1,       table: gemDropTable },
                ])
            }],
            [{
                table: new LootTable([
                    { p: 1 / 112,                      item: { name: "Clue scroll (hard)" } },
                ])
            }]
        )
    },
})