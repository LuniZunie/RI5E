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
            html: text,
        }, { start: true });
        setTimeout(() => Notification.#remove(element), duration);
    }
    static warning(text, duration = 2500) {
        const element = document.qs("div#game>div.ui>div.notifications").create("div", {
            class: "notification warning",
            html: text,
        }, { start: true });
        setTimeout(() => Notification.#remove(element), duration);
    }
    static info(text, duration = 2500) {
        const element = document.qs("div#game>div.ui>div.notifications").create("div", {
            class: "notification info",
            html: text,
        }, { start: true });
        setTimeout(() => Notification.#remove(element), duration);
    }
    static debug(text, duration = 2500) {
        const element = document.qs("div#game>div.ui>div.notifications").create("div", {
            class: "notification debug",
            html: text,
        }, { start: true });
        setTimeout(() => Notification.#remove(element), duration);
    }

    static side(text, duration = 2500) {
        const element = document.qs("div#game>div.ui>div.side-notifications").create("div", {
            class: "notification",
            html: text,
        }, { start: true });
        setTimeout(() => Notification.#remove(element), duration);
    }
}