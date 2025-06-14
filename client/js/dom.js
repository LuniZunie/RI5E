import "../module/html.js";

document.qsa("div.toggle-container>div.toggle").forEach(el => {
    const button = el.qs("div.switch");
    if (button) {
        el.addEventListener("click", e => {
            e.preventDefault();
            button.classList.toggle("on");
        }, true);
    }
});