import "../../module/html.js";

export default class Notification {
    static #remove(e) {
        const element = e?.currentTarget ?? e;
        element.classList.add("out");
        element.onanimationend = () => element.remove();
    }

    static error(text, duration = 2500) {
        const element = document.qs("div#game>div.ui>div.notifications").create("div", {
            class: "notification error",
            content: text,
            onclick: Notification.#remove,
        }, { start: true });
        setTimeout(() => Notification.#remove(element), duration);
    }
    static warning(text, duration = 2500) {
        const element = document.qs("div#game>div.ui>div.notifications").create("div", {
            class: "notification warning",
            content: text,
            onclick: Notification.#remove,
        }, { start: true });
        setTimeout(() => Notification.#remove(element), duration);
    }
    static info(text, duration = 2500) {
        const element = document.qs("div#game>div.ui>div.notifications").create("div", {
            class: "notification info",
            content: text,
            onclick: Notification.#remove,
        }, { start: true });
        setTimeout(() => Notification.#remove(element), duration);
    }
    static debug(text, duration = 2500) {
        const element = document.qs("div#game>div.ui>div.notifications").create("div", {
            class: "notification debug",
            content: text,
            onclick: Notification.#remove,
        }, { start: true });
        setTimeout(() => Notification.#remove(element), duration);
    }
}