function spawnPopup() {
    let popup = document.createElement("section");
    popup.classList.add("popup");
    popup.role = "dialog";
    document.body.append(popup);
    
    let container = document.createElement("div");
    container.classList.add("popup-container");
    popup.append(container);
    popup.$container = container;

    let close = document.createElement("button");
    close.classList.add("popup-close", "icon-button");
    close.onclick = () => popup.remove();
    close.innerHTML = `<iconify-icon icon="lucide:x" inline></iconify-icon>`;
    container.append(close);

    let content = document.createElement("div");
    content.classList.add("popup-content");
    container.append(content);
    popup.$content = content;

    return popup;
}