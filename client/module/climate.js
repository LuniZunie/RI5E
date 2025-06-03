import "./html.js";
import "./math.js";
import Gradient from "./gradient.js";
import Text from "./text.js";
export default class Climate {
    static measurements = {
        altitude: new Text("Alt.").plural(false),
        temperature: new Text("Temp.").plural(false),
        humidity: new Text("Hum.").plural(false),
    };

    static #gradients = {
        altitude: new Gradient(4096, "#16A34A", "#A3A3A3", "#60A5FA"),
        temperature: new Gradient(4096, "#3B82F6", "#FBBF24", "#EF4444"),
        humidity: new Gradient(4096, "#FACC15", "#9CA3AF", "#3B82F6"),
    };
    static svg = {
        altitude: { low: "", medium: "", high: "" },
        temperature: { low: "", medium: "", high: "" },
        humidity: { low: "", medium: "", high: "" },
    };
    static noise(prng, d) {
        const size = 2 ** d;
        const map = new Array(size * size).fill(0);

        function add(n, sx, sy, wh) {
            let [ ex, ey ] = [ Math.min(sx + wh, size), Math.min(sy + wh, size) ];
            [ sx, sy ] = [ Math.max(sx, 0), Math.max(sy, 0) ];
            for (let x = sx; x < ex; x++)
                for (let y = sy; y < ey; y++)
                    map[y * size + x] += n;
        }

        let scale = size, m = 0.5;
        while (scale >= 1) {
            const step = size / scale;
            for (let y = 0; y < size; y += step)
                for (let x = 0; x < size; x += step)
                    add(prng.next().value * m, x, y, step);
            scale /= 2, m /= 2;
        }

        let min, max;
        const smoothed = new Array(size * size).fill(0);
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let sum = 0, count = 0;
                for (let dy = -2; dy <= 2; dy++) {
                    for (let dx = -2; dx <= 2; dx++) {
                        const nx = x + dx, ny = y + dy;
                        if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
                            let w = 1 / Math.hypot(dx, dy);
                            if (w > 1) w = 1.25;
                            sum += map[ny * size + nx] * w;
                            count += w;
                        }
                    }
                }
                const v = sum / count;
                smoothed[y * size + x] = v;

                if (min === undefined || v < min) min = v;
                if (max === undefined || v > max) max = v;
            }
        }

        const range = max - min || 1; // avoid division by zero
        const len = smoothed.length;
        for (let i = 0; i < len; i++) {
            let v = (smoothed[i] - min) / range; // normalize to [0, 1]

            v = 2 * (v - 0.5); // scale to [-1, 1]
            const ex = 0.5;
            v = Math.sign(v) * Math.pow(Math.abs(v), ex); // apply exponential scaling
            v = (v + 1) / 2; // scale back to [0, 1]

            smoothed[i] = Math.round(v * 1e5) / 1e5; // normalize to 5 decimal places
        }

        return smoothed;
    };

    static format = {
        altitude: { required: true, test: v => typeof v === "number" && v >= 0 },
        temperature: { required: true, test: v => typeof v === "number" && v >= 0 },
        humidity: { required: true, test: v => typeof v === "number" && v >= 0 },
    };

    altitude = 0;
    temperature = 0;
    humidity = 0;

    compare(other) { // how different are the two climates?
        if (!(other instanceof Climate))
            throw new Error("Invalid comparison object: " + other);

        let score = 0; // lower is better
        for (const m of Object.keys(Climate.measurements))
            score += Math.abs(this[m] - other[m]);
        return score;
    };

    combine(other, weight = 0.5) { // 0.5 is equal, 0 is this, 1 is other
        if (!(other instanceof Climate))
            throw new Error("Invalid combination object: " + other);

        const result = new Climate();
        for (const m of Object.keys(Climate.measurements)) {
            result[m] = this[m] * (1 - weight) + other[m] * weight;
            if (result[m] < 0) result[m] = 0; // ensure non-negative values
            result[m] = Math.round(result[m] * 1e5) / 1e5; // normalize to 5 decimal places
        }
        return result;
    };

    toString() { // display the climate in a human-readable format
        const result = [];
        for (const [ m, abr ] of Object.entries(Climate.measurements))
            result.push(`${abr.case().get()} ${this[m].toFixed(2)}`);
        return result.join("  —  ");
    };

    display() {
        const div = document.create("div", { class: "climate" });
        for (const m of Object.keys(Climate.measurements)) {
            const v = this[m];
            const clamped = Math.clamp(v, 0, 1); // clamp to [0, 1] for gradient

            const third = Math.clamp(v * 3 | 0, 0, 2); // 0, 1, or 2
            const file = [ "low", "medium", "high" ][third];

            div.create("div", {
                class: m,
                style: { "--color": Climate.#gradients[m]?.get?.(clamped)?.color || "#F0F" },
                html: Climate.svg[m][file],
                "data-tooltip": new Text(`${file} ${m} (${clamped * 100 | 0}%)`, Text.case.lower).case(Text.case.sentence).get(),
            }, { end: true });
        }

        return div;
    }
};

Object.keys(Climate.measurements).map(m => {
    [ "low", "medium", "high" ].forEach(s => {
        fetch(`/game/assets/climate/${m}/${s}.svg`)
            .then(r => r.text())
            .then(svg => Climate.svg[m][s] = svg.replace(/(?=stroke=")(?!#)([^"]*)/g, `stroke="var(--color, $1)`))
            .catch(() => Climate.svg[m][s] = `<svg viewBox="0 0 100 100"><text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-size="10">Error</text></svg>`);
    });
});