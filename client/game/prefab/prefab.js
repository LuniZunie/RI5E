import "../../module/object.js";
import Text from "../../module/text.js";

export default class Prefab {
    static id = "prefab";
    static name = new Text("<none>").plural(false);
    static description = new Text("<none>").plural(false);

    quantity = 1;

    import(data) {
        if (!Object.match(data, this.constructor.format)) throw new TypeError("Invalid import.");
        for (const [ k, v ] of Object.entries(data))
            this[k] = v;
    }
    export() {
        const data = {};
        for (const [ k, v ] of Object.entries(this.constructor.format)) {
            if (this[k] === undefined || this[k] === null) continue;
            if (!v.test(this[k])) throw new TypeError(`Invalid export: ${k}=${this[k]}`);
            data[k] = this[k];
        }
        return data;
    }

    capture() { }

    static format = {
        quantity: { required: true, test: v => Number.isInteger(v) && v > 0 },
    };
};