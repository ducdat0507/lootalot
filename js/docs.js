let elms = {};

let map = [
    { name: "Introduction", path: "introduction" },
    { name: "Getting started", path: "getting-started" },
    { name: "The basics", path: "the-basics" },
    "",
    { name: "Chaining loot tables", path: "chaining-loot-tables" },
]
let title;

let currentPage;

function init() {
    elms = {
        navigationBar: document.getElementById("navigation-bar"),
        navigationList: document.getElementById("navigation-list"),
        summaryBar: document.getElementById("summary-bar"),
        pageTitle: document.getElementById("page-title"),
        mainframe: document.getElementById("mainframe"),
    }

    for (let item of map) {
        if (item == "") {
            let hr = document.createElement("hr");
            elms.navigationList.append(hr);
        } else {
            let a = document.createElement("a");
            a.className = "link-entry";
            a.textContent = item.name;
            a.href = "pages/" + item.path + ".html";
            a.target = "#mainframe";
            a.onclick = (e) => {
                e.preventDefault();
                document.body.classList.remove("is-navigation");
                loadPage(item.path);
            }
            item.elm = a;
            elms.navigationList.append(a);
        }
    }

    document.getElementById("navigation-show-button").onclick = () => {
        document.body.classList.remove("is-summary");
        document.body.classList.add("is-navigation");
    }
    document.getElementById("summary-show-button").onclick = () => {
        document.body.classList.remove("is-navigation");
        document.body.classList.add("is-summary");
    }
    document.getElementById("navigation-hide-button").onclick = () => {
        document.body.classList.remove("is-navigation");
    }
    document.getElementById("summary-hide-button").onclick = () => {
        document.body.classList.remove("is-summary");
    }

    let target = currentPage = /p=([^&#=]*)/.exec(window.location.search);
    let page = map.find(x => x.path == target);
    if (page) loadPage(target);
    else loadPage("introduction");

    elms.mainframe.style.display = "";
    requestAnimationFrame(update);
}

function update() {
    if (elms.mainframe) {
        elms.mainframe.style.height = (elms.mainframe.contentWindow?.document?.body?.scrollHeight || 0) + 40 + "px";
    }
    requestAnimationFrame(update);
}

async function onContentLoad(frame) {
    if (!elms?.pageTitle) {
        setTimeout(() => onContentLoad(frame), 1);
        return;
    }
    elms.pageTitle.textContent = frame.contentWindow.document.title;
    let target = frame.contentWindow.location.href;
    let i;
    if ((i = target.indexOf("pages/"))) target = target.substring(i + 6, target.lastIndexOf("."));
    console.log(target);
    if (currentPage != target) {
        let page = map.find(x => x.path == target);
        if (page) {
            history.replaceState({...page, elm: undefined}, page.name + " - lootalot docs", "?p=" + page.path);
            document.title = page.name + " - lootalot docs";
            currentPage = target;
        }
    }
    for (let page of map) {
        page.elm?.classList.toggle("active", page.path == target);
    }
}

function loadPage(target) {
    let page = map.find(x => x.path == target);
    if (!page) return;
    elms.mainframe.src = "pages/" + page.path + ".html";
    elms.pageTitle.textContent = page.name;
    for (let page of map) {
        page.elm?.classList.toggle("active", page.path == target);
    }
}

window.addEventListener("popstate", (e) => {
    loadPage(e.state.path)
})