import "../../module/html.js";
import Climate from "../../module/climate.js";
import define from "../../module/define.js";
import format_number from "../../module/format-number.js";
import Text from "../../module/text.js";

export default class Page {
    #name;
    #html = `
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
    `;
    constructor(name, html) {
        this.#name = name;
        if (html) this.#html = html;
    }

    get name() { return this.#name; }

    draw(view, game) {
        view.qs("div.top-bar>div.tabs").select(`span.tab[data-page="${this.#name}"]`);

        const page = view.qs("div.page");
        page.qsa("*[data-tooltip]").forEach(el => el.onmouseout?.());
        page.dataset.page = this.#name;
        if (typeof this.#html === "function") {
            page.innerHTML = "";
            this.#html(page, game);
        } else page.innerHTML = this.#html;
    }
};

export const Pages = Object.freeze({
    home: new Page("home", `
        <h1>Welcome to the Game</h1>
        <p>Explore, play, and enjoy your time here!</p>
    `),
    explore: new Page("explore", (page, game) => {
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

        const [ sx, ex ] = [ map.start(0), map.end(0) ];
        const [ sy, ey ] = [ map.start(1), map.end(1) ];
        for (let y = sy; y <= ey; y++) {
            for (let x = sx; x <= ex; x++) {
                const biome = map.get(x, y);

                const div = display.create("div", {
                    class: "biome",
                    "data-position": `${x},${y}`,
                }, { end: true });

                if (biome.locked) div.classList.add("locked");

                if (fogged(x, y)) div.classList.add("fogged");
                else div.style.background = biome.constructor.sprite;

                div.addEventListener("click", e => {
                    e.stopPropagation();
                    display.qsa("div.biome.selected").forEach(el => el.classList.remove("selected"));

                    const div = e.currentTarget;
                    const pos = div.dataset.position, [ x, y ] = pos.split(",").map(Number);
                    if (fogged(x, y) || panel.dataset.position === pos) {
                        panel.dataset.position = "";
                        return panel.classList.add("hidden");
                    }

                    div.classList.add("selected");
                    panel.dataset.position = pos;
                    display.dataset.position = pos;

                    const biome = map.get(x, y);

                    panel.qsa("*[data-tooltip]").forEach(el => el.onmouseout?.());
                    panel.innerHTML = `
                        <div class="title auto-scroll"></div>
                        <div class="description auto-scroll"></div>
                        <div class="button purchase">error</div>
                    `;

                    panel.qs("div.title").textContent = biome.constructor.name.case(Text.case.title).get();
                    panel.qs("div.description").textContent = biome.constructor.description.case(Text.case.sentence).get();
                    panel.insertBefore(define(Climate, biome.climate).display(), panel.qs("div.button.purchase"));

                    { // forageables
                        const forageables = panel.create("div", { class: "forageables" }, { before: panel.qs("div.button.purchase") });
                        forageables.create("span", { class: "title", content: "Forageables" }, { end: true });

                        const list = forageables.create("div", { class: "list" }, { end: true });
                        for (const forageable of biome.constructor.forageables) {
                            const div = list.create("div", {
                                class: "forageable",
                                "data-tooltip": forageable.name.case(Text.case.title).get(2),
                            }, { end: true });
                            div.create("img", {
                                src: forageable.sprite,
                                alt: forageable.name.case(Text.case.title).get(2),
                                draggable: false,
                            }, { end: true });
                        }
                    }

                    const purchase = panel.qs("div.button.purchase");
                    purchase.classList.toggle("disabled", !biome.locked);

                    if (biome.locked) {
                        const cost = format_number(quote(biome));
                        purchase.textContent = cost;

                        purchase.onclick = () => {
                            if (biome.locked) {
                                if (game.pay(cost)) {
                                    biome.locked = false;
                                    div.classList.remove("locked");

                                    purchase.onclick = null;
                                    purchase.classList.remove("enter-focus", "disabled");
                                    purchase.textContent = "Purchased";

                                    [ [ x + 1, y ], [ x - 1, y ], [ x, y + 1 ], [ x, y - 1 ] ].forEach(([ nx, ny ]) => {
                                        const neighbor = display.qs(`div.biome.fogged[data-position="${nx},${ny}"]`);
                                        if (neighbor) {
                                            neighbor.classList.remove("fogged");
                                            neighbor.style.background = map.get(nx, ny).constructor.sprite;
                                        }
                                    });

                                    game.export();
                                } else
                                    purchase.classList.add("enter-focus");
                            }
                        };

                        purchase.classList.add("enter-focus");
                    } else purchase.textContent = "Already Purchased";

                    panel.classList.remove("hidden");
                });
            }
        }

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
    }),
});