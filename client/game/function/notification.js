import "../../module/html.js";

export default class Notification {
    static #remove(e) {
        const element = e?.currentTarget ?? e;
        element.classList.add("out");
        element.onanimationend = () => element.remove();
    }

    static #create(parent, type, html, duration = 2500) {
        const el = parent.create("div", {
            class: "notification",
            html,
        }, { start: true });

        switch (type) {
            case Notification.ERROR: {
                el.classList.add("error");
            } break;
            case Notification.WARN: {
                el.classList.add("warn");
            } break;
            case Notification.INFO: {
                el.classList.add("info");
            } break;
            case Notification.DEBUG: {
                el.classList.add("debug");
            } break;
            case Notification.NORMAL: {
                el.classList.add("normal");
            } break;
            default: {
                throw new Error(`Unknown notification type: ${type}`);
            } break;
        }

        setTimeout(() => Notification.#remove(el), duration);
        return el;
    }

    static ERROR = Symbol("error");
    static WARN = Symbol("warning");
    static INFO = Symbol("info");
    static DEBUG = Symbol("debug");
    static NORMAL = Symbol("normal");

    static top(type, html, duration = 2500) {
        this.#create(document.qs("div#game>div.ui>div.notifications.top"), type, html, duration);
    }

    static side(type, html, duration = 2500) {
        this.#create(document.qs("div#game>div.ui>div.notifications.side"), type, html, duration);
    }
}