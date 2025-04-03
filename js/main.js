let tables = [];
let elms = {};

let table = null;
let loots = [];

let shouldGoBack = false;

function init() {
    elms = {
        lootTables: document.getElementById("loot-tables"),
        lootList: document.getElementById("loot-list"),
        lootTrials: document.getElementById("loot-trials"),
        lootButton: document.getElementById("loot-button"),
        lootReset: document.getElementById("loot-reset"),
    }

    for (let table of tables) {
        let elm = document.createElement("option");
        elm.value = table.id;
        elm.textContent = table.name;
        elms.lootTables.append(elm);
    }

    elms.lootTables.onselect = () => {
        let def = tables.find(x => x.id == elms.lootTables.value);
        table = def.gen();
        resetLoot();
    }
    table = tables[0].gen();

    elms.lootButton.onclick = loot;
    elms.lootReset.onclick = resetLoot;

    let lastValidValue = 1;
    elms.lootTrials.oninput = (e) => {
        let value = Math.max(Math.floor(e.target.value), 1);
        if (e.target.value == "one") lastValidValue = 1;
        if (e.target.value == "a trillion") lastValidValue = 1e12;
        else if (value == value) lastValidValue = value;
    }
    elms.lootTrials.onchange = (e) => {
        let value = Math.max(Math.floor(e.target.value), 1);
        if (!e.target.value) e.target.value = "";
        else if (value != value) e.target.value = lastValidValue;
        else e.target.value = value;
    }
 
    document.querySelector("#try-me-button a").onclick = () => {
        shouldGoBack = true;
    }
    document.querySelector("#try-me-back-link").onclick = (e) => {
        if (shouldGoBack) {
            e.preventDefault();
            history.back();
        }
    }

    window.onhashchange = updatePanels;
    updatePanels();
}

function loot() {
    let trials = +elms.lootTrials.value || 1;
    let loot = table.loot(trials);
    for (let item of loot) {
        let currentItem = loots.find(x => x.item == item.item);
        if (!currentItem) {
            let elm = document.createElement("div");
            elm.$name = document.createElement("div");
            elm.$name.textContent = item.item;
            elm.append(elm.$name);
            elm.$count = document.createElement("div");
            elm.$count.textContent = format(item.count);
            elm.append(elm.$count);
            loots.push({
                item: item.item,
                count: item.count,
                elm: elm,
            });
        } else {
            currentItem.count += item.count;
            currentItem.elm.$count.textContent = format(currentItem.count);
        }
    }
    
    loots.sort((x, y) => y.count - x.count);
    elms.lootList.textContent = "";
    for (let loot of loots) {
        elms.lootList.append(loot.elm);
    }
}

function resetLoot() {
    loots = [];
    elms.lootList.textContent = "";
}

function format(number) {
    let abbr = ["", "K", "M", "B", "T"];
    let mag = Math.log10(number);

    if (mag + Math.log10(1.0000005) < 6) {
        return number.toLocaleString("en-US")
    } if (mag + Math.log10(1.00005) < abbr.length * 3) {
        mag += Math.log10(1.00005);
        mag = Math.floor(mag / 3) * 3;
        return (number / (10 ** mag)).toPrecision(4) + abbr[mag / 3];
    }
    mag = Math.floor(mag + Math.log10(1.00005));
    return (number / (10 ** mag)).toPrecision(4) + "e" + mag;
}

function updatePanels() {
    document.body.classList.toggle("is-try-me", location.hash == "#try-me");
}