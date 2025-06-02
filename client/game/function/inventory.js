import Prefab from "../prefab/prefab.js";
import ID_TABLE from "../id-table.js";

export default class Inventory {
    #map;
    #lookup;
    #table;

    #added = new Set();
    #changed = new Map();
    #removed = new Set();

    constructor() {
        this.#map = new Map();
        this.#lookup = new Map();
        this.#table = ID_TABLE.build();
    }

    static #diff(before, after) {
        const diff = {};
        for (const [ k, v ] of Object.entries(after)) {
            const [ a, b ] = [ before[k], after[k] ];
            if (typeof a === "object" && a !== null && typeof b === "object" && b !== null) {
                const nestedDiff = Inventory.#diff(a, b);
                if (Object.keys(nestedDiff).length > 0)
                    diff[k] = nestedDiff;
            } else if (a !== b)
                diff[k] = b;
        }
        for (const k of Object.keys(before)) {
            if (!(k in after))
                diff[k] = null; // property was removed
        }

        return diff;
    }

    #add(item) {
        if (!(item instanceof Prefab)) throw new TypeError("Item must be an instance of Prefab.");

        const id = item.id;
        if (!this.#table.has(item.constructor.id)) throw new TypeError("Item is not a valid prefab.");
        if (this.#map.has(item.id)) throw new Error("Item already exists in inventory.");

        this.#map.set(id, item);
        if (this.#lookup.has(item.constructor.id))
            this.#lookup.get(item.constructor.id).add(id);
        else
            this.#lookup.set(item.constructor.id, new Set([ id ]));
    }

    add(item) {
        this.#add(item);
        this.#added.set(id);
        if (this.#removed.has(id)) this.#removed.delete(id);
    }
    change(item) {
        if (!(item instanceof Prefab)) throw new TypeError("Item must be an instance of Prefab.");

        const id = item.id;
        if (!this.#table.has(item.constructor.id)) throw new TypeError("Item is not a valid prefab.");
        if (!this.#map.has(id)) throw new Error("Item not found in inventory.");

        const before = this.#map.get(id).export();
        const after = item.export();
        this.#map.set(id, item);

        if (this.#added.has(id))
            return;
        this.#changed.set(id, Inventory.#diff(before, after));
        return;
    }
    remove(item) {
        if (!(item instanceof Prefab)) throw new TypeError("Item must be an instance of Prefab.");

        const id = item.id;
        if (!this.#table.has(item.constructor.id)) throw new TypeError("Item is not a valid prefab.");
        if (!this.#map.has(id)) throw new Error("Item not found in inventory.");

        this.#map.delete(id);
        if (this.#lookup.has(item.constructor.id)) {
            const set = this.#lookup.get(item.constructor.id);
            set.delete(id);
            if (set.size === 0)
                this.#lookup.delete(item.constructor.id);
        }

        this.#removed.add(id);
        if (this.#added.has(id)) this.#added.delete(id);
        if (this.#changed.has(id)) this.#changed.delete(id);

        return;
    }

    findById(id) {
        if (typeof id !== "string" || id.length === 0) throw new TypeError("Invalid ID.");
        return this.#map.get(id) || null;
    }
    findByType(type) {
        if (!this.#table.has(type)) throw new TypeError("Invalid type.");
        return this.#lookup.get(type) || new Set();
    }

    export() {
        const out = {
            added: [],
            changed: [],
            removed: []
        };

        for (const id of this.#added) {
            const item = this.#map.get(id);
            if (item)
                out.added.push({ construct: item.constructor.id, id: item.id, data: item.export() });
            else
                console.warn(`Item with ID ${id} not found in map during export.`);
        }
        this.#added.clear(); // clear after export

        for (const [ id, diff ] of this.#changed) {
            const item = this.#map.get(id);
            if (item)
                out.changed.push({ id: item.id, data: diff });
            else
                console.warn(`Item with ID ${id} not found in map during export.`);
        }
        this.#changed.clear(); // clear after export

        for (const id of this.#removed) {
            const item = this.#map.get(id);
            if (item)
                out.removed.push({ id: item.id });
            else
                console.warn(`Item with ID ${id} not found in map during export.`);
        }
        this.#removed.clear(); // clear after export

        return out;
    }
    import(data) {
        try {
            (data || {}).forEach(item => {
                if (typeof item !== "object" || item === null || !item.id || !this.#table.has(item.id))
                    throw new TypeError(`Invalid item data`);

                const ItemClass = this.#table.get(item.id);
                const instance = new ItemClass();
                try {
                    instance.import(item.data);
                } catch (err) { throw new Error(`${item.id}: ${err.message}`); }
                this.#add(instance);
            });
            return true;
        } catch (err) {
            console.error("Failed to import item:", err);
            this.#map.clear(); // clear inventory on import failure
            this.#lookup.clear();
            this.#added.clear();
            this.#changed.clear();
            this.#removed.clear();
            return false;
        }
    }
};