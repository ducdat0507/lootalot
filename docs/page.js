if (window === window.top) {
    console.log(window.location.href, top.location.href);
    let path = window.location.href;
    window.location.href = "../?p=" + path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
} else {
    hljs.highlightAll();
}