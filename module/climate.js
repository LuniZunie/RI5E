export default class Climate {
    static measurements = {
        altitude: "Alt.",
        temperature: "Temp.",
        humidity: "Hum.",
    };
    static noise_map(d, a = 0.5) {
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
                    add(Math.random() ** a * m, x, y, step);
            scale /= 2, m /= 2;
        }

        const smoothed = new Array(size * size).fill(0);
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let sum = 0, count = 0;
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        const nx = x + dx, ny = y + dy;
                        if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
                            const w = (dx === 0 && dy === 0) ? 1 : 0.7; // center has full weight, neighbors half
                            sum += map[ny * size + nx] *w;
                            count += w;
                        }
                    }
                }
                smoothed[y * size + x] = sum / count;
            }
        }

        return smoothed;
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
        }
        return result;
    };

    display() { // display the climate in a human-readable format
        const result = [];
        for (const [ m, abr ] of Object.entires(Climate.measurements))
            result.push(`${abr}: ${this[m].toFixed(2)}`);
        return result.join("  —  ");
    };
};