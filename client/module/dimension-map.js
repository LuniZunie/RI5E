export default class DimensionMap {
    #dim = [];
    #offset = [];

    #table = null;
    #data = [];

    #constant = false;
    constructor(...args) {
        this.#dim = args.map(d => {
            this.#offset.push(0); // default offset is 0
            if (Number.isInteger(d = +d))
                return d;
            else throw new Error("Invalid dimension value: " + d);
        });
    };

    table(o = false) {
        if (this.#constant)
            throw new Error("Cannot change table after constant is set");

        if (o === false)
            this.#table = null;
        else if (o instanceof Object)
            this.#table = o;
        else throw new Error("Invalid table value: " + o);

        return this;
    };

    set(a, fill) {
        if (this.#constant)
            throw new Error("Cannot change data after constant is set");
        if (!Array.isArray(a))
            throw new Error("Invalid dimension array: " + a);

        const len = this.#dim.reduce((p,d) => p*d, 1);
        if (a.length !== len) {
            if (fill === undefined)
                throw new Error("Invalid dimension array length: " + a.length);
            else {
                if (a.length > len)
                    throw new Error("Dimension array too long: " + a.length);
                this.#data = a.slice(0, len).concat(new Array(len - a.length).fill(fill));
            }
        } else this.#data = a.slice(0, len);

        return this;
    };

    offset(...args) {
        if (this.#constant)
            throw new Error("Cannot change offset after constant is set");

        if (args.length !== this.#dim.length)
            throw new Error("Invalid number of arguments: " + args.length);

        this.#offset = args.map((v, i) => {
            switch (v) {
                case "start": return 0;
                case "end": return -this.#dim[i] + 1;
                case "center": return -Math.floor((this.#dim[i] - 1) / 2);
                default:
                    if (Number.isInteger(v = +v))
                        return v;
                    else throw new Error("Invalid offset value: " + v);
            };
        });
        return this;
    };

    get(...args) {
        if (args.length !== this.#dim.length)
            throw new Error("Invalid number of arguments: " + args.length);

        let idx = 0;
        for (let i = 0; i < this.#dim.length; i++) {
            const v = args[i];
            const ov = v - this.#offset[i];
            if (!Number.isInteger(ov) || ov < 0 || ov >= this.#dim[i])
                throw new Error("Invalid index value: " + v);
            idx = idx * this.#dim[i] + ov;
        }

        const v = this.#data[idx];
        return this.#table ? this.#table[v] : v;
    };
    getor(or, ...args) {
        if (args.length !== this.#dim.length)
            throw new Error("Invalid number of arguments: " + args.length);

        try {
            return this.get(...args);
        } catch { return or; }
    };

    get constant() {
        if (this.#constant)
            return this;

        this.#constant = true;
        return this;
    };

    get dimensions() {
        return this.#dim.length;
    };
    dimension(n) {
        if (!Number.isInteger(n) || n < 0 || n >= this.#dim.length)
            throw new Error("Invalid dimension index: " + n);
        return this.#dim[n];
    };

    start(n) {
        if (!Number.isInteger(n) || n < 0 || n >= this.#dim.length)
            throw new Error("Invalid dimension index: " + n);
        return this.#offset[n];
    };
    end(n) {
        if (!Number.isInteger(n) || n < 0 || n >= this.#dim.length)
            throw new Error("Invalid dimension index: " + n);
        return this.#offset[n] + this.#dim[n] - 1;
    };

    *values() {
        if (this.#constant)
            throw new Error("Cannot iterate over constant data");

        for (let i = 0; i < this.#data.length; i++)
            yield this.#table ? this.#table[this.#data[i]] : this.#data[i];
    };
}