let tables = [];
let elms = {};

let tableDef = null;
let table = null;
let loots = [];

let settings = {
    cumulative: true,
}

let shouldGoBack = false;

function init() {
    elms = {
        lootSimulator: document.querySelector(".loot-simulator"),
        lootTables: document.getElementById("loot-tables"),
        lootList: document.getElementById("loot-list"),
        lootTrials: document.getElementById("loot-trials"),
        lootButton: document.getElementById("loot-button"),
        lootReset: document.getElementById("loot-reset"),
    }

    elms.lootTables.onclick = () => spawnTableSelectionPopup();
    elms.lootTables.innerText = tables[0].category + " - " + tables[0].name;
    tableDef = tables[0];
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
        else if (value != value) e.target.value = lastValidValue.toString().replace("e+", "e");
        else e.target.value = value.toString().replace("e+", "e");
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
    document.querySelector("#loot-options-button").onclick = () => {
        spawnSettingsPopup();
    }

    window.onhashchange = updatePanels;
    updatePanels();
}

function loot() {
    let trials = +elms.lootTrials.value || 1;
    let loot = table.loot(trials);
    if (!settings.cumulative) {
        loots = [];
        elms.lootList.textContent = "";
    } else for (let item of loots) {
        item.active = false;
    }
    for (let item of loot) {
        let currentItem = loots.find(x => x.item?.name == item.item?.name);
        if (!currentItem) {
            let elm = document.createElement("div");
            elm.$name = document.createElement("div");
            elm.$name.textContent = item.item?.name;
            elm.$name.style.color = item.item?.color ?? "#ffffff";
            elm.append(elm.$name);
            elm.$count = document.createElement("div");
            elm.$count.textContent = "×" + format(item.count);
            elm.append(elm.$count);
            loots.push({
                item: item.item,
                count: item.count,
                elm: elm,
                active: true,
            });
        } else {
            currentItem.count += item.count;
            currentItem.elm.$count.textContent = "×" + format(currentItem.count);
            currentItem.active = true;
        }
    }
    
    loots.sort((x, y) => y.count - x.count);
    for (let loot of loots) {
        loot.elm.classList.toggle("active", loot.active);
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
    elms.lootSimulator.classList.toggle("cumulative", settings.cumulative);
}

function spawnTableSelectionPopup() {
    let popup = spawnPopup();
    popup.$content.insertAdjacentHTML("beforebegin", `
        <h2>Select loot table</h2>
    `);
    let tableSorted = [...tables];
    tableSorted.sort((x, y) => stringCompare(x.category, y.category));

    let lastCategory = "";

    let holder = document.createElement("div");
    holder.classList.add("loot-table-list");
    popup.$content.append(holder);

    let activeButton;
    let infoBox = document.createElement("div");
    infoBox.classList.add("info-box");

    for (const def of tables) 
    {
        if (lastCategory != def.category) {
            lastCategory = def.category;
            let header = document.createElement("h4");
            header.textContent = def.category;
            holder.append(header);
        }
            
        let button = document.createElement("button");
        button.innerText = def.name;
        button.disabled = tableDef == def;
        if (button.disabled) activeButton = button;
        button.onclick = () => {
            tableDef = def;
            elms.lootTables.innerText = def.category + " - " + def.name;
            table = def.gen();
            resetLoot();

            activeButton.disabled = false;
            activeButton = button;
            button.disabled = true;
            holder.insertBefore(infoBox, button.nextSibling);
            buildInfoBox(infoBox, def);
        }
        holder.append(button);
    }

    holder.insertBefore(infoBox, activeButton.nextSibling);
    buildInfoBox(infoBox, tableDef);
}

function buildInfoBox(infoBox, def) 
{
    infoBox.innerHTML = `
        <div class="options">
            <div style="text-align: center; opacity: .5">
                This loot table does not have any settings.
            </div>
        </div>
        <hr>
        <div class="sources">Sources:</div>
    `;

    {
        let sources = infoBox.querySelector(".sources");
        let counter = 0;
        for (let source of def.sources) {
            counter++;
            sources.append(" ");
            let link = document.createElement("a");
            link.href = source;
            link.textContent = `[${counter}]`;
            link.target = "_blank";
            sources.append(link);
        }
    }
    
}

function spawnSettingsPopup() {
    let popup = spawnPopup();
    popup.$content.insertAdjacentHTML("beforebegin", `
        <h2>Loot Simulator&trade; settings</h2>
    `);
    popup.$content.innerHTML = `
        <div class="setting toggle">
            <input id="loot-cumulative" type="checkbox">
            <label for="loot-cumulative">
                <h3>Cumulative looting</h3>
                <p>
                Make loot results persist between loots.<br>
                If disabled, loot results are cleared every time the "Loot!" button is clicked.
                </p>
            </label>
        </div>
    `

    {
        let checkbox = popup.querySelector("#loot-cumulative")
        checkbox.checked = settings.cumulative;
        checkbox.oninput = () => {
            settings.cumulative = checkbox.checked;
            resetLoot();
            updatePanels();
        }
    }
}

function stringCompare(x, y) {
    return x < y ? -1 : +(x > y);
}