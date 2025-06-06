import "../../module/html.js";
import Prefab from "../prefab/prefab.js";
import Climate from "../../module/climate.js";
import define from "../../module/define.js";
import format_number from "../../module/format-number.js";
import Text from "../../module/text.js";

import Notification from "./notification.js";

import Time from "../time.js";
import Wallet from "../prefab/wallet.js";
import { WalletChangeEvent } from "../prefab/game-event.js";

export default class Page {
    static current = null;
    #name;
    #html = `
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
    `;
    #options = {};
    #cache = {};
    constructor(name, html, options = {}) {
        this.#name = name;
        if (html) this.#html = html;
        this.#options = options;
    }

    get name() { return this.#name; }

    draw(view, game) {
        if (Page.current && !Object.is(Page.current, this))
            this.#options?.onleave?.(view, game, this.#cache);
        Page.current = this;
        view.qs("div.top-bar>div.tabs").select(`span.tab[data-page="${this.#name}"]`);

        const page = view.qs("div.page");
        page.qsa("*[data-tooltip]").forEach(el => el.onmouseout?.());
        page.dataset.page = this.#name;
        if (typeof this.#html === "function") {
            page.innerHTML = "";
            this.#html(page, game, this.#cache);
        } else page.innerHTML = this.#html;
    }
};

export const Pages = Object.freeze({
    home: new Page("home", `
        <h1>Welcome to the Game</h1>
        <p>Explore, play, and enjoy your time here!</p>
    `),
    explore: new Page("explore", (page, game, cache) => {
        const display = page.create("div", {
            class: "map",
            style: { "--map-size": game.map.dimension(0) },
        }, { end: true });

        const panel = page.create("div", {
            class: "panel hidden",
        }, { end: true });

        const map = game.map;
        function quote(biome) {
            const purchased = display.qsa("div.biome:not(.locked)").length;
            return (biome.distance * purchased) ** 2 * 0.5;
        }

        function fogged(x, y) {
            return  map.getor({ locked: true }, x, y).locked &&
                    map.getor({ locked: true }, x + 1, y).locked &&
                    map.getor({ locked: true }, x - 1, y).locked &&
                    map.getor({ locked: true }, x, y + 1).locked &&
                    map.getor({ locked: true }, x, y - 1).locked
        }

        const events = new Map();

        const [ sx, ex ] = [ map.start(0), map.end(0) ];
        const [ sy, ey ] = [ map.start(1), map.end(1) ];
        for (let y = sy; y <= ey; y++) {
            for (let x = sx; x <= ex; x++) {
                const biome = map.get(x, y);

                const div = display.create("div", {
                    class: "biome",
                    "data-position": `${x},${y}`,
                }, { end: true });

                const prefab = define(Prefab, {
                    capture: (game, event) => {
                        switch (event.id) {
                            case "prefab.game_event.wallet_change": {
                                if (!biome.locked) return; // no need to update locked biomes
                                const cost = format_number(quote(biome));
                                div.classList.toggle("could-purchase", game.could_pay(cost));
                            } break;
                        }
                    }
                });
                events.set(`${x},${y}`, prefab);

                if (biome.locked)
                    div.classList.add("locked");

                if (fogged(x, y)) div.classList.add("fogged");
                else {
                    if (biome.locked) {
                        WalletChangeEvent.connect(prefab);
                        cache.connectedEvents ||= new Set();
                        cache.connectedEvents.add(prefab);
                    }

                    div.style.background = biome.constructor.sprite;
                }

                div.addEventListener("click", e => {
                    e.stopPropagation();
                    display.qsa("div.biome.selected").forEach(el => el.classList.remove("selected"));

                    const div = e.currentTarget;
                    const pos = div.dataset.position, [ x, y ] = pos.split(",").map(Number);
                    if (fogged(x, y) || panel.dataset.position === pos) {
                        panel.dataset.position = "";
                        panel.dataset.tabFocus = panel.qsa("div.button.enter-focus")[0]?.dataset.tabFocus ?? "forage";
                        return panel.classList.add("hidden");
                    }

                    div.classList.add("selected");
                    panel.dataset.position = pos;
                    panel.dataset.tabFocus = panel.qsa("div.button.enter-focus")[0]?.dataset.tabFocus ?? "forage";
                    display.dataset.position = pos;

                    const biome = map.get(x, y);

                    panel.qsa("*[data-tooltip]").forEach(el => el.onmouseout?.());

                    panel.innerHTML = "";

                    panel.create("div", {
                        class: "title auto-scroll",
                        content: biome.constructor.name.case(Text.case.title).get()
                    }, { end: true });
                    panel.create("div", {
                        class: "description auto-scroll",
                        content: biome.constructor.description.case(Text.case.sentence).get()
                    }, { end: true });

                    panel.appendChild(define(Climate, biome.climate).display());

                    { // forageables
                        const forageables = panel.create("div", { class: "forageables" }, { end: true });
                        forageables.create("span", { class: "title", content: "Forageables" }, { end: true });

                        const list = forageables.create("div", { class: "list" }, { end: true });
                        for (const forageable of biome.constructor.forageables) {
                            const div = list.create("div", {
                                class: "forageable",
                                "data-tooltip": `${forageable.name.case(Text.case.title).get(2)} (${forageable.description.case(Text.case.sentence).get()})`,
                            }, { end: true });
                            div.create("img", {
                                src: forageable.sprite,
                                alt: forageable.name.case(Text.case.title).get(2),
                                draggable: false,
                            }, { end: true });
                        }
                    }

                    panel.create("div", { class: "button purchase disabled", content: "Loading..." }, { end: true });
                    panel.create("div", { class: "button forage hidden", content: "Forage", "data-tab-focus": "forage" }, { end: true });
                    panel.create("div", { class: "button fish hidden", content: "Fish", "data-tab-focus": "fish" }, { end: true });

                    const purchase = panel.qs("div.button.purchase");
                    purchase.classList.toggle("disabled", !biome.locked);

                    if (biome.locked) {
                        const cost = format_number(quote(biome));
                        purchase.textContent = cost;

                        purchase.onclick = () => {
                            if (biome.locked && !fogged(x, y)) {
                                if (game.pay(cost)) {
                                    try {
                                        WalletChangeEvent.disconnect(prefab);
                                        cache.connectedEvents?.delete(prefab);
                                        div.classList.remove("could-purchase");
                                    } catch { }

                                    game.user.inventory.change(biome, b => { b.locked = false; });
                                    div.classList.remove("locked");

                                    purchase.onclick = null;
                                    div.click();
                                    div.click();

                                    [ [ x + 1, y ], [ x - 1, y ], [ x, y + 1 ], [ x, y - 1 ] ].forEach(([ nx, ny ]) => {
                                        const neighbor = display.qs(`div.biome.fogged[data-position="${nx},${ny}"]`);
                                        if (neighbor) {
                                            neighbor.classList.remove("fogged");
                                            neighbor.style.background = map.get(nx, ny).constructor.sprite;

                                            const neighborPrefab = events.get(`${nx},${ny}`);
                                            if (neighborPrefab) {
                                                WalletChangeEvent.connect(neighborPrefab);
                                                cache.connectedEvents ||= new Set();
                                                cache.connectedEvents.add(neighborPrefab);
                                            }

                                            neighbor.classList.toggle("could-purchase", game.could_pay(format_number(quote(map.get(nx, ny)))));
                                        }
                                    });
                                }
                            }
                        };

                        purchase.classList.add("enter-focus");
                    } else {
                        purchase.classList.add("hidden");
                        purchase.classList.remove("disabled", "enter-focus");

                        const forage = panel.qs("div.button.forage");
                        forage.classList.remove("hidden");
                        forage.classList.toggle("disabled", biome.constructor.forageables.length === 0);
                        forage.classList.toggle("enter-focus", panel.dataset.tabFocus === "forage");
                        forage.classList.add("tab-focus");
                        forage.onclick = () => {
                            if (!biome.locked) {
                                const forageables = biome.forageables;

                                let foraged = false;
                                game.user.inventory.change(biome, biome => {
                                    biome.forageables = forageables.filter(forageable => {
                                        if (forageable.grown <= Time.now) {
                                            foraged = true;
                                            const drop = forageable.constructor.drop;
                                            const q = drop.yield.positive;

                                            const item = drop.item;
                                            const itemName = item.name.case(Text.case.title).get(q);
                                            if (item.sellable) {
                                                const price = item.sell_price.positive * q;
                                                game.sell(price);

                                                Notification.side(Notification.NORMAL, `Foraged ${q} ${itemName} for <div class="coins">${format_number(price)}</div>`);
                                            } else {
                                                game.user.inventory.add(define(item, {quantity: q }));
                                                Notification.side(Notification.NORMAL, `Foraged ${q} ${itemName}`);
                                            }

                                            return false; // remove forageable from the biome
                                        }

                                        return true; // keep forageable in the biome
                                    });
                                });

                                if (!foraged) {
                                    Notification.top(Notification.WARN, "No forageables available at this time.");
                                    return;
                                }
                            }
                        };

                        const fish = panel.qs("div.button.fish");
                        fish.classList.remove("hidden");
                        fish.classList.toggle("disabled", biome.constructor.fish.length === 0);
                        fish.classList.toggle("enter-focus", panel.dataset.tabFocus === "fish");
                        fish.classList.add("tab-focus");
                    }

                    panel.classList.remove("hidden");
                });
            }
        }

        cache.connectedEvents?.forEach(prefab => {
            prefab.capture(game, WalletChangeEvent);
        });

        window.onkeydown = e => {
            const move = (dx, dy) => {
                let selected = display.qs("div.biome.selected");
                if (!selected) {
                    let nx, ny;
                    if (display.dataset.position)
                        [ nx, ny ] = display.dataset.position.split(",").map(Number);
                    else
                        [ nx, ny ] = [ (sx + ex) / 2 | 0, (sy + ey) / 2 | 0 ];

                    selected = display.qs(`div.biome[data-position="${nx},${ny}"]`);
                    selected?.click();
                }

                const [ x, y ] = selected.dataset.position.split(",").map(Number);
                let [ mx, my ] = [ x + dx, y + dy ];

                const in_bounds = (x, y) => x >= sx && x <= ex && y >= sy && y <= ey;
                while (fogged(mx, my) && in_bounds(mx, my))
                    mx += dx, my += dy;

                if (!fogged(mx, my) && in_bounds(mx, my))
                    display.qs(`div.biome[data-position="${mx},${my}"]`)?.click();
            };

            switch (e.key) {
                case "Escape": {
                    display.qsa("div.biome.selected").forEach(el => el.classList.remove("selected"));
                    panel.qsa("*[data-tooltip]").forEach(el => el.onmouseout?.());
                    panel.classList.add("hidden");
                    panel.dataset.position = "";
                } break;
                case "ArrowUp": {
                    move(0, -1);
                } break;
                case "ArrowDown": {
                    move(0, 1);
                } break;
                case "ArrowLeft": {
                    move(-1, 0);
                } break;
                case "ArrowRight": {
                    move(1, 0);
                } break;
            }
        };
    }, {
        onleave: (view, game, cache) => {
            if (cache.connectedEvents) {
                for (const event of cache.connectedEvents) {
                    try {
                        WalletChangeEvent.disconnect(event);
                    } catch { }
                }
                cache.connectedEvents.clear();
            }
        }
    }),
});