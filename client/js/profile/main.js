import "../../module/html.js";

document.qsa("div.settings>div.setting").forEach(el => {
    const button = el.qs("div.toggle-container>div.toggle>div.switch");
    if (button && localStorage[el.dataset.setting] !== undefined)
        button.classList.toggle("on", localStorage[el.dataset.setting] === "true");
});

document.qsa("div.settings>div.setting").forEach(el => {
    const toggle = el.qs("div.toggle-container>div.toggle"), button = toggle?.qs?.("div.switch");
    if (button)
        toggle.addEventListener("click", e => {
            e.preventDefault();
            localStorage[el.dataset.setting] = button.classList.contains("on");
        });
});