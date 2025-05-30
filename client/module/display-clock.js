import "./html.js";

export default class DisplayClock {
    static BINARY = "01";
    static OCTAL = "01234567";
    static DECIMAL = "0123456789";
    static HEXADECIMAL = "0123456789abcdef";
    static LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    static UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    static CustomCase(...args) {
        let res = "";
        for (const arg of args) {
            if (typeof arg === "string")
                res += arg;
            else throw new TypeError("DisplayClock.CustomCase: All arguments must be strings.");
        }
    }

    #clock = document.create("div", { class: "display-clock" });
    #tracks = [];

    #build_track(track, codes) {
        const len = codes.length;
        const create = half => {
            for (let i = 0; i < len; i++) {
                const code = codes[i];

                const div = track.create("div", {
                    class: `${half} character character-${code}`,
                    content: String.fromCharCode(code),
                    "data-index": i
                }, { end: true });

                if (half === "upper" && i === 0)
                    div.classList.add("active");
            }
        };

        create("upper");
        create("lower");
    }
    #valid(str) {
        const tracks = this.#tracks;
        const codes = str.split(/(?=.)/u).map(c => c.codePointAt(0));
        for (let i = codes.length - 1; i >= 0; i--)
            if (!(codes[i] in tracks[i].object))
                return false;
        return true;
    }

    constructor(id, ...strs) {
        if (typeof id !== "string")
            throw new TypeError("DisplayClock: id must be a string.");
        this.#clock.id = id;

        const len = strs.length, tracks = new Array(len);
        for (let i = 0; i < len; i++) {
            const str = strs[i];
            if (typeof str !== "string")
                throw new TypeError(`DisplayClock: Argument ${i + 1} must be a string.`);

            const codes = str.split(/(?=.)/u).map(c => c.codePointAt(0));
            const codesLen = codes.length;
            if (codesLen === 0)
                throw new Error(`DisplayClock: Argument ${i + 1} must not be an empty string.`);
            else if (new Set(codes).size !== codesLen)
                throw new Error(`DisplayClock: Argument ${i + 1} must not contain duplicate characters.`);

            const container = this.#clock.create("div", { class: "container" }, { end: true });
            const track = container.create("div", { class: "track" }, { end: true });
            this.#build_track(track, codes);

            tracks[i] = {
                track,
                codes,
                object: Object.fromEntries(codes.map((code, i) => [ code, +i ])),
            };
        }

        this.#tracks = tracks;
        this.resize();
    }

    get element() { return this.#clock; }

    get text() {
        const tracks = this.#tracks, len = tracks.length;
        let str = "";
        for (let i = 0; i < len; i++)
            str += tracks[i].track.qs(".character.active").textContent;
        return str;
    }
    get length() { return this.#tracks.length; }

    display(str, dirs = "AUTO") {
        const tracks = this.#tracks, len = tracks.length;

        if (typeof str !== "string")
            throw new TypeError("DisplayClock.display: Argument must be a string.");
        else if (str.length !== len)
            throw new Error(`DisplayClock.display: Argument must have length ${len}.`);
        else if (!this.#valid(str))
            throw new Error("DisplayClock.display: Argument contains invalid characters.");

        if (typeof dirs === "string")
            dirs = [ `${dirs}x${len}` ];
        if (!Array.isArray(dirs))
            throw new TypeError("DisplayClock.display: expected dir to be a string or an array of strings.");

        const codes = str.split(/(?=.)/u).map(c => c.codePointAt(0));
        const indices = codes.map((code, i) => {
            const track = tracks[i];
            return [ +track.track.qs(".character.active").dataset.index, track.object[code] ];
        });

        {
            let sum = 0;
            const tempDirs = [];

            const dirsLen = dirs.length, iMax = dirsLen - 1;
            for (let i = 0; i < dirsLen; i++) {
                let dir = dirs[i];
                if (typeof dir !== "string")
                    throw new TypeError(`DisplayClock.display: Argument ${i + 1} must be a string.`);

                if (i === iMax && (dir === "AUTO" || dir === "INC" || dir === "DEC" || dir === "NONE"))
                    dir += `x${len - sum}`;

                let n;
                if (!(dir.startsWith('AUTOx') || dir.startsWith('INCx') || dir.startsWith('DECx') || dir.startsWith('NONEx')))
                    throw new TypeError('Invalid direction group format');
                else {
                    const temp = dir.split('x');
                    if (temp.length !== 2)
                        throw new TypeError(`DisplayClock.display: Invalid direction group format: ${dir}.`);

                    [ dir, n ] = temp;
                    if (n === "")
                        throw new TypeError(`DisplayClock.display: Invalid direction group format: ${dir}.`);

                    n = Number(n);
                    if (!Number.isInteger(n) || n < 0)
                        throw new TypeError(`DisplayClock.display: Invalid direction group format: ${dir}.`);
                }

                sum += n;
                if (sum > len)
                    throw new Error(`DisplayClock.display: Total direction length exceeds clock length: ${sum} > ${len}.`);

                if (dir === "AUTO") {
                    for (let j = sum - n; j < sum; j++) {
                        const [ a, b ] = indices[j];
                        if (a === b) continue;
                        else if (a < b)
                            dir = "INC";
                        else
                            dir = "DEC";
                        break;
                    }

                    if (dir === "AUTO")
                        dir = "NONE";
                }

                for (let j = 0; j < n; j++)
                    tempDirs.push(dir);
            }

            if (sum !== len)
                throw new Error(`DisplayClock.display: Total direction length does not match clock length: ${sum} != ${len}.`);
            dirs = tempDirs;
        }

        const codesLen = codes.length;
        for (let i = 0; i < codesLen; i++) {
            const code = codes[i], track = tracks[i];

            const trackEl = track.track;
            const codeLen = track.codes.length;

            const active = trackEl.qs(".character.active");
            const [ a, b ] = indices[i];
            if (a === b) continue;
            else
                active.classList.remove("active");

            trackEl.style.transitionDuration = "0s";

            let dir = dirs[i];
            switch (dir) {
                case "INC": {
                    trackEl.style.transform = `translateY(calc(var(--char-height) * -${a}))`;
                } break;
                case "DEC": {
                    trackEl.style.transform = `translateY(calc(var(--char-height) * -${a + codeLen}))`;
                } break;
            }

            trackEl.offsetHeight; // force reflow
            trackEl.style.transitionDuration = dir === "NONE" ? "0s" : "";

            const char = trackEl.qs(`${a < b ? ".upper" : ".lower"}.character-${code}`);
            char.classList.add("active");

            trackEl.style.transform = `translateY(calc(var(--char-height) * -${b + (a < b ? 0 : codeLen)}))`;
            if (dir !== "NONE") {
                trackEl.offsetHeight; // force reflow
                trackEl.transitionDuration = "";
            }
        }
    }

    resize() {
        const h = this.#tracks[0].track.qs(".character").offsetHeight;
        this.#clock.style.setProperty("--char-height", `${h}px`);
    }
};