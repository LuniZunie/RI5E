import "../../module/html.js";
import Prefab from "../prefab/prefab.js";
import Climate from "../../module/climate.js";
import define from "../../module/define.js";
import format_number from "../../module/format-number.js";
import Text from "../../module/text.js";

import Notification from "./notification.js";

import Time from "../time.js";
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
            let purchased = 0;
            for (const b of map.values())
                if (!b.locked) purchased++;
            return (biome.distance * purchased) ** 2 * 0.5;
        }

        function get_edges(x, y) {
            return {
                top: map.getor({ locked: true }, x, y - 1).locked,
                bottom: map.getor({ locked: true }, x, y + 1).locked,
                left: map.getor({ locked: true }, x - 1, y).locked,
                right: map.getor({ locked: true }, x + 1, y).locked,
            };
        }

        function fogged(x, y) {
            const edges = get_edges(x, y);
            return  map.getor({ locked: true }, x, y).locked &&
                    edges.top && edges.bottom &&
                    edges.left && edges.right;
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
                    } else {
                        const edges = get_edges(x, y);
                        div.classList.toggle("edge-top", edges.top);
                        div.classList.toggle("edge-bottom", edges.bottom);
                        div.classList.toggle("edge-left", edges.left);
                        div.classList.toggle("edge-right", edges.right);
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
                        panel.dataset.tabFocus = panel.qsa("div.button.enter-focus")[0]?.dataset.tabFocus || panel.dataset.tabFocus || "forage";
                        return panel.classList.add("hidden");
                    }

                    div.classList.add("selected");
                    panel.dataset.position = pos;
                    panel.dataset.tabFocus = panel.qsa("div.button.enter-focus")[0]?.dataset.tabFocus || panel.dataset.tabFocus || "forage";
                    display.dataset.position = pos;

                    const biome = map.get(x, y);

                    panel.qsa("*[data-tooltip]").forEach(el => el.onmouseout?.());

                    // panel.innerHTML = "";

                    const title = panel.qs("div.title");
                    if (title) {
                        const scroll = title.qs("span.scroll-text");
                        if (scroll)
                            scroll.textContent = biome.constructor.name.case(Text.case.title).get();
                        else
                            title.textContent = biome.constructor.name.case(Text.case.title).get();
                    } else
                        panel.create("div", {
                            class: "title auto-scroll",
                            content: biome.constructor.name.case(Text.case.title).get()
                        }, { end: true });

                    const description = panel.qs("div.description");
                    if (description) {
                        const scroll = description.qs("span.scroll-text");
                        if (scroll)
                            scroll.textContent = biome.constructor.description.case(Text.case.sentence).get();
                        else
                            description.textContent = biome.constructor.description.case(Text.case.sentence).get();
                    } else
                        panel.create("div", {
                            class: "description auto-scroll",
                            content: biome.constructor.description.case(Text.case.sentence).get()
                        }, { end: true });

                    if (panel.qs("div.climate"))
                        panel.qs("div.climate").outerHTML = define(Climate, biome.climate).display().outerHTML;
                    else
                        panel.appendChild(define(Climate, biome.climate).display());

                    { // forageables
                        const forageables = panel.qs("div.forageables") || panel.create("div", { class: "forageables" }, { end: true });
                        forageables.qs("span.title") || forageables.create("span", { class: "title", content: "Forageables" }, { end: true });

                        const list = forageables.qs("div.list") || forageables.create("div", { class: "list" }, { end: true });

                        const remove = {};
                        list.qsa("div.forageable").forEach(el => remove[el.dataset.id] = el);
                        for (const forageable of biome.constructor.forageables) {
                            if (list.qs(`div.forageable[data-id="${forageable.id}"]`)) {
                                delete remove[forageable.id];
                                continue; // already exists
                            }

                            const div = list.create("div", {
                                class: `forageable`,
                                "data-id": forageable.id,
                                "data-tooltip": `${forageable.name.case(Text.case.title).get(2)} (${forageable.description.case(Text.case.sentence).get()})`,
                            }, { end: true });
                            div.create("img", {
                                src: forageable.sprite,
                                alt: forageable.name.case(Text.case.title).get(2),
                                draggable: false,
                            }, { end: true });
                        }

                        for (const el of Object.values(remove)) {
                            el.onmouseout?.();
                            el.remove();
                        }
                    }

                    { // fishes
                        const fishes = panel.qs("div.fishes") || panel.create("div", { class: "fishes" }, { end: true });
                        fishes.qs("span.title") || fishes.create("span", { class: "title", content: "Fishes" }, { end: true });

                        const list = fishes.qs("div.list") || fishes.create("div", { class: "list" }, { end: true });

                        const remove = {};
                        list.qsa("div.fish").forEach(el => remove[el.dataset.id] = el);
                        for (const fish of biome.constructor.fishes.list ?? []) {
                            if (list.qs(`div.fish[data-id="${fish.id}"]`)) {
                                delete remove[fish.id];
                                continue; // already exists
                            }

                            const div = list.create("div", {
                                class: "fish",
                                "data-id": fish.id,
                                "data-tooltip": `${fish.name.case(Text.case.title).get(2)} (${fish.description.case(Text.case.sentence).get()})`,
                            }, { end: true });
                            div.create("img", {
                                src: fish.sprite,
                                alt: fish.name.case(Text.case.title).get(2),
                                draggable: false,
                            }, { end: true });
                        }

                        for (const el of Object.values(remove)) {
                            el.onmouseout?.();
                            el.remove();
                        }
                    }

                    const purchase = panel.qs("div.button.purchase") || panel.create("div", { class: "button purchase", content: "Loading..." }, { end: true });
                    const forage = panel.qs("div.button.forage") || panel.create("div", { class: "button forage hidden", content: "Forage", "data-tab-focus": "forage" }, { end: true });
                    const fish = panel.qs("div.button.fish") || panel.create("div", { class: "button fish hidden", content: "Fish", "data-tab-focus": "fish" }, { end: true });

                    purchase.classList.remove("hidden");
                    purchase.classList.toggle("disabled", !biome.locked);
                    forage.classList.add("hidden");
                    fish.classList.add("hidden");

                    if (biome.locked) {
                        const cost = format_number(quote(biome));
                        purchase.textContent = cost;

                        purchase.onclick = () => {
                            if (biome.locked && !fogged(x, y)) {
                                if (game.pay(cost, () => game.user.inventory.change(biome, b => { b.locked = false; }))) {
                                    try {
                                        WalletChangeEvent.disconnect(prefab);
                                        cache.connectedEvents?.delete(prefab);
                                        div.classList.remove("could-purchase");
                                    } catch { }

                                    div.classList.remove("locked");

                                    purchase.onclick = null;
                                    div.click();
                                    div.click();

                                    const edges = get_edges(x, y), removeEdges = {};

                                    if (edges.top) div.classList.add("edge-top");
                                    else removeEdges[`${x},${y - 1}`] = "edge-bottom";

                                    if (edges.bottom) div.classList.add("edge-bottom");
                                    else removeEdges[`${x},${y + 1}`] = "edge-top";

                                    if (edges.left) div.classList.add("edge-left");
                                    else removeEdges[`${x - 1},${y}`] = "edge-right";

                                    if (edges.right) div.classList.add("edge-right");
                                    else removeEdges[`${x + 1},${y}`] = "edge-left";

                                    [ [ x + 1, y ], [ x - 1, y ], [ x, y + 1 ], [ x, y - 1 ] ].forEach(([ nx, ny ]) => {
                                        const neighbor = display.qs(`div.biome[data-position="${nx},${ny}"]`);
                                        if (neighbor.classList.contains("fogged")) {
                                            neighbor.classList.remove("fogged");
                                            neighbor.style.background = map.get(nx, ny).constructor.sprite;

                                            const neighborPrefab = events.get(`${nx},${ny}`);
                                            if (neighborPrefab) {
                                                WalletChangeEvent.connect(neighborPrefab);
                                                cache.connectedEvents ||= new Set();
                                                cache.connectedEvents.add(neighborPrefab);
                                            }

                                            neighbor.classList.toggle("could-purchase", game.could_pay(format_number(quote(map.get(nx, ny)))));
                                        } else {
                                            const removeEdge = removeEdges[`${nx},${ny}`];
                                            if (removeEdge) neighbor.classList.remove(removeEdge);
                                        }
                                    });
                                }
                            }
                        };

                        purchase.classList.add("enter-focus");
                    } else {
                        purchase.classList.add("hidden");
                        purchase.classList.remove("disabled", "enter-focus");

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
                                                game.user.inventory.add(define(item, { quantity: q }));
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

                        fish.classList.remove("hidden");
                        fish.classList.toggle("disabled", Object.keys(biome.constructor.fishes).length === 0);
                        fish.classList.toggle("enter-focus", panel.dataset.tabFocus === "fish");
                        fish.classList.add("tab-focus");
                        fish.onclick = () => {
                            if (!biome.locked) {
                                const fishes = biome.constructor.fishes[Time.Month[Time.getMonth()]];
                                if (!fishes || fishes.size === 0) return;

                                const count = fishes.size;
                                const fish = (rng => {
                                    for (const [ fish, weight ] of fishes.entries()) {
                                        if (rng < weight) return fish;
                                        rng -= weight;
                                    }
                                    return null; // caught trash
                                })(Math.random() * count);

                                if (fish) {
                                    const drop = fish.drop;
                                    const q = drop.yield.positive;

                                    const item = drop.item;
                                    const itemName = item.name.case(Text.case.title).get(q);
                                    if (item.sellable) {
                                        const price = item.sell_price.positive * q;
                                        game.sell(price);

                                        Notification.side(Notification.NORMAL, `Caught ${q} ${itemName} for <div class="coins">${format_number(price)}</div>`);
                                    } else {
                                        game.user.inventory.add(define(item, { quantity: q }));
                                        Notification.side(Notification.NORMAL, `Caught ${q} ${itemName}`);
                                    }
                                } else
                                    Notification.side(Notification.WARN, "Did not catch any fish.");
                            }
                        }
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