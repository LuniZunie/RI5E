import DimensionMap from "../../src/js/dimension_map.js";
import test_map from "../../src/js/prefab.js";

let data = [], WIDTH = 0, HEIGHT = 0;

const biomes = Object.fromEntries([
    "temperate grassland",
    "tropical grassland",
    "shrubland",
    "scrubland",
    "temperate forest",
    "montane forest",
    "subtropical forest",
    "mangrove forest",
    "tropical rainforest",
    "water",
].map((k,i,a) => {
    const id = `biome:${k.replace(/\s+/g, '_').toLowerCase()}`;
    const value = i + 1;
    const color = `hsla(${Math.floor(i * 360 / a.length)}, 70%, 50%`;
    return [k, { color: `${color}, 1)`, dark: `${color}, 0.5)`, id, value }];
}).concat([["empty", { color: "#000", dark: "#0008", id: "null", value: 0 }]]));

const scale = 100;
const paper = document.querySelector("body>div#main>canvas#map");
const pen = paper.getContext("2d");

const $width = document.querySelector("body>div#sidebar>div#dimension>input#width");
const $height = document.querySelector("body>div#sidebar>div#dimension>input#height");

[WIDTH, HEIGHT] = [+($width.value || $width.placeholder), +($height.value || $height.placeholder)];
data = new Array(WIDTH * HEIGHT).fill(biomes.empty);

[$width, $height].forEach($el => {
    $el.placeholder = $el.placeholder.replace(/[^0-9]/g, "");
    $el.onchange = () => $el.value = $el.value.replace(/[^0-9]/g, "");
    $el.onchange();
});

const $resize = document.querySelector("body>div#sidebar>div#dimension>div.button#resize");
$resize.onclick = () => {
    const w = +$width.value || +$width.placeholder;
    const h = +$height.value || +$height.placeholder;
    resize(WIDTH, HEIGHT, w, h);
    WIDTH = w, HEIGHT = h;

    paper.width = WIDTH * scale;
    paper.height = HEIGHT * scale;

    document.body.style.setProperty("--aspect-ratio", `${WIDTH}/${HEIGHT}`);
    if (WIDTH >= HEIGHT) {
        document.body.style.setProperty("--width", `100%`);
        document.body.style.setProperty("--height", `auto`);
    } else {
        document.body.style.setProperty("--width", `auto`);
        document.body.style.setProperty("--height", `100%`);
    }


    draw();
};
$resize.onclick();

const $template = document.querySelector("body>div#sidebar>div#colors>div.option.template");
Object.entries(biomes).forEach(([name, biome]) => {
    if (biome.value === 0) return; // skip empty biome
    const $el = $template.cloneNode(true);
    $el.style = `--color: ${biome.color}`;
    $el.classList.remove("template");
    $el.querySelector("span.label").textContent = name;

    $el.onclick = () => {
        const add = !$el.classList.contains("selected");
        const $selected = document.querySelectorAll("body>div#sidebar>div#colors>div.option.selected");
        $selected.forEach($s => $s.classList.remove("selected"));
        if (add) $el.classList.add("selected");

        draw();
    };

    $template.parentNode.appendChild($el);
});

function draw() {
    pen.clearRect(0, 0, paper.width, paper.height);
    const $selected = document.querySelector("body>div#sidebar>div#colors>div.option.selected");
    let value;
    if ($selected) {
        const biome = Object.entries(biomes).find(([k]) => k === $selected.querySelector("span.label").textContent)?.[1];
        if (!biome) return;
        value = biome.value;
    } else value = biomes.empty.value;

    pen.lineWidth = 7.5;
    pen.strokeStyle = "#888";

    const [w, h] = [WIDTH, HEIGHT];
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const o = data[y * w + x];

            if (o.value === value) pen.fillStyle = o.color;
            else pen.fillStyle = o.dark;

            pen.fillRect(x * scale, y * scale, scale, scale);

            pen.strokeRect(x * scale, y * scale, scale, scale);
        }
    }
};

let pressed = [-1, -1, -1]; // left, middle, right
paper.addEventListener("contextmenu", e => e.preventDefault());
paper.addEventListener("mouseup", e => pressed[e.button] = -1);
paper.addEventListener("mousedown", e => pressed[e.button] = Date.now());

paper.onmousedown = e => {
    const rect = paper.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / (rect.width / paper.width)) / scale);
    const y = Math.floor(((e.clientY - rect.top) / (rect.height / paper.height)) / scale);

    const recent = Math.max(...pressed);
    if (recent === -1) return; // no button pressed

    const button = pressed.findIndex(v => v === recent);

    let $selected;
    if (button === 0) // left click
        $selected = document.querySelector("body>div#sidebar>div#colors>div.option.selected");
    else if (button === 1) { // middle click
        const v = data[y * WIDTH + x];
        const biome = Object.entries(biomes).find(([k, v2]) => v2.value === v.value)?.[0] || "empty";
        let found = false;
        document.querySelectorAll(`body>div#sidebar>div#colors>div.option:not(.template)`).forEach($el => {
            if ($el.querySelector("span.label").textContent === biome)
                $el.onclick(), found = true;
        });
        if (!found) document.querySelectorAll("body>div#sidebar>div#colors>div.option.selected").forEach($el => $el.classList.remove("selected"));
        return;
    } else if (button === 2) // right click
        e.preventDefault();

    let biome;
    if ($selected) {
        biome = Object.entries(biomes).find(([k]) => k === $selected.querySelector("span.label").textContent)?.[1];
        if (!biome) return;
    } else biome = biomes.empty;

    data[y * WIDTH + x] = biome;

    requestAnimationFrame(draw);
};

paper.onmousemove = paper.onmousedown;

window.export_map = () => {
    const length = Object.keys(biomes).length.toString(16).length;

    return `
new DimensionMap(${WIDTH}, ${HEIGHT})
\t.offset("center", "center")
\t.table({
\t\t${Object.entries(biomes).filter(en=>en[1].value).map(([name, biome]) => `0x${biome.value.toString(16).padStart(length, '0')} : "${biome.id}"`).join(",\n\t\t")}
\t})
\t.set([
\t\t${data.reduce((str,biome,i) => str+`0x${biome.value.toString(16).padStart(length, '0')}` + (i % WIDTH === WIDTH - 1 ? ",\n\t\t" : ","), "").trim()}
\t], 0x${(0).toString(16).padStart(length, '0')})
\t.constant;
    `.trim();
};

function resize(w, h, sw, sh) {
    if (!Number.isInteger(w) || !Number.isInteger(h) || w <= 0 || h <= 0)
        throw new Error("Invalid dimensions");
    if (!Number.isInteger(sw) || sw <= 0)
        throw new Error("Invalid scaled width");
    if (!Number.isInteger(sh) || sh <= 0)
        throw new Error("Invalid scaled height");

    if (sw === w && sh === h) return;

    let map2d = [];
    for (let y = 0; y < h; y++)
        map2d.push(data.slice(y * w, (y + 1) * w));

    const dh = sh - h;
    if (dh < 0) {
        const [front, back] = [Math.floor(-dh / 2), Math.ceil(-dh / 2)];
        map2d = map2d.slice(front, -back);
    } else if (dh > 0) {
        const emptyRow = new Array(w).fill(biomes.empty);
        const [front, back] = [Math.floor(dh / 2), Math.ceil(dh / 2)];

        for (let i = 0; i < front; i++)
            map2d.unshift(emptyRow.slice());
        for (let i = 0; i < back; i++)
            map2d.push(emptyRow.slice());
    }

    const dw = sw - w;
    if (dw < 0) {
        const [front, back] = [Math.floor(-dw / 2), Math.ceil(-dw / 2)];
        for (let y = 0; y < map2d.length; y++)
            map2d[y] = map2d[y].slice(front, -back);
    } else if (dw > 0) {
        const [front, back] = [new Array(Math.floor(dw / 2)).fill(biomes.empty), new Array(Math.ceil(dw / 2)).fill(biomes.empty)];
        for (let y = 0; y < map2d.length; y++)
            map2d[y] = front.concat(map2d[y], back);
    }

    data = map2d.flat();
};

window.import_map = (map, sw, sh) => {
    if (!(map instanceof DimensionMap && map.dimensions === 2))
        throw new Error("Invalid map data: not a DimensionMap");

    const [w,h] = [map.dimension(0), map.dimension(1)];

    let temp = [];
    for (let x = map.start(0); x <= map.end(0); x++)
        for (let y = map.start(1); y <= map.end(1); y++)
            temp.push(map.get(x, y));

    const reverse = Object.fromEntries(Object.entries(biomes).map(([, v]) => [v.id, v]));
    data = temp.map(value => reverse[value] || biomes.empty).slice();
    console.log(data);

    WIDTH = w, HEIGHT = h;

    $width.value = sw ?? w, $width.onchange();
    $height.value = sh ?? h, $height.onchange();
    $resize.onclick();
};
draw();

window.onkeydown = (e) => {
    if (e.ctrlKey) {
        switch (e.key) {
            case "s": // save
                e.preventDefault();
                const blob = new Blob([window.export_map()], { type: "text/plain" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "map.js";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                break;
            case "o": // save+open in new tab
                e.preventDefault();
                const newTab = window.open();
                if (newTab) {
                    newTab.document.body.innerHTML = `<pre>${window.export_map()}</pre>`;
                    newTab.document.title = "Map Data";
                }
                break;
            case "c": // copy
                e.preventDefault();
                navigator.clipboard.writeText(window.export_map()).then(() => {
                    console.log("Map copied to clipboard");
                }).catch(err => {
                    console.error("Failed to copy map: ", err);
                });
                break;
            case 'v': // paste
                e.preventDefault();
                navigator.clipboard.readText().then(text => {
                    try {
                        eval(`import_map(${text.trim().replace(/;$/, "")})`);
                        console.log("Map pasted from clipboard");
                    } catch (err) {
                        console.error("Failed to paste map: ", err);
                    }
                });
                break;
        }
    }
}

window.import_map(eval(test_map));

window.DimensionMap = DimensionMap;