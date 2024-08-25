let elms = {};

let map = [
    { name: "Introduction", path: "introduction" },
    { name: "Get started", path: "get-started" },
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
        let a = document.createElement("a");
        a.className = "link-entry";
        a.textContent = item.name;
        a.href = "pages/" + item.path + ".html";
        a.target = "#mainframe";
        a.onclick = (e) => {
            e.preventDefault();
            loadPage(item.path);
        }
        elms.navigationList.append(a);
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
        elms.mainframe.style.height = (elms.mainframe.contentWindow?.document?.documentElement?.scrollHeight || 0) + "px";
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
            history.replaceState(page, page.name + " - lootalot docs", "?p=" + page.path);
            document.title = page.name + " - lootalot docs";
            currentPage = target;
        }
    }
}

function loadPage(target) {
    let page = map.find(x => x.path == target);
    if (!page) return;
    elms.mainframe.src = "pages/" + page.path + ".html";
}

window.addEventListener("popstate", (e) => {
    loadPage(e.state.path)
})