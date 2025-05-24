import format_number from './format-number.js';

export default function display_map(map) {
    const $map = document.querySelector("div#map");
    const $content = $map.querySelector("div.content");
    const $panel = $map.querySelector("div.panel");

    const [ sx, sy ] = [ map.start(0), map.start(1) ];
    const [ ex, ey ] = [ map.end(0), map.end(1) ];
    for (let y = sy; y <= ey; y++) {
        for (let x = sx; x <= ex; x++) {
            const biome = map.get(x, y);
            const $biome = document.createElement("div");
            $biome.classList.add("biome");
            $biome.style.background = biome.constructor.sprite;
            $biome.setAttribute("position", `${x},${y}`);

            if (biome.locked) $biome.classList.add("locked");
            if (
                map.getor({ locked: true }, x + 1, y).locked &&
                map.getor({ locked: true }, x - 1, y).locked &&
                map.getor({ locked: true }, x, y + 1).locked &&
                map.getor({ locked: true }, x, y - 1).locked
            ) $biome.classList.add("fog");

            $biome.addEventListener("click", e => {
                e.stopPropagation();
                $content.querySelectorAll("div.biome.selected").forEach($el => $el.classList.remove("selected"));

                const $biome = e.currentTarget;
                if ($biome.classList.contains("fog")) {
                    $panel.removeAttribute("position");
                    return $panel.classList.add("hidden");
                }

                const position = $biome.getAttribute("position");
                if ($panel.getAttribute("position") === position) {
                    $panel.removeAttribute("position");
                    return $panel.classList.add("hidden");
                } else $panel.setAttribute("position", position);

                $biome.classList.add("selected");

                const [ x, y ] = position.split(",").map(Number);
                const biome = map.get(x, y);

                $panel.querySelector("div.title").innerText = biome.constructor.name.case("title");
                $panel.querySelector("div.description").innerText = biome.constructor.description.case("title");
                $panel.querySelector("div.climate").innerText = biome.climate.display();

                const $purchase = $panel.querySelector("div.button.purchase");
                $purchase.classList.toggle("disabled", !biome.locked);
                if (biome.locked) $purchase.innerText = format_number(quote(biome));
                else $purchase.innerText = "Already Purchased";

                $purchase.onclick = () => { // TODO: check if have enough funds
                    if (biome.locked) {
                        biome.locked = false;
                        $biome.classList.remove("locked");
                        $purchase.innerText = "Already Purchased";
                        $purchase.classList.add("disabled");

                        $content.querySelector("div.biome.fog[position='" + (x+1) + "," + y + "']")?.classList.remove("fog");
                        $content.querySelector("div.biome.fog[position='" + (x-1) + "," + y + "']")?.classList.remove("fog");
                        $content.querySelector("div.biome.fog[position='" + x + "," + (y+1) + "']")?.classList.remove("fog");
                        $content.querySelector("div.biome.fog[position='" + x + "," + (y-1) + "']")?.classList.remove("fog");
                    }
                }
                $purchase.classList.add("enter-focus");

                $panel.classList.remove("hidden");
            });

            $content.appendChild($biome);
        }
    }
}

function quote(biome) {
    const purchased = document.querySelectorAll("div#map>div.content>div.biome:not(.locked)").length;
    return (biome.distance * purchased) ** 2 * 0.5;
}