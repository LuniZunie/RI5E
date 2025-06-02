import Prefab from "../prefab/prefab.js";
import ID_TABLE from "../id-table.js";

import { create_diff } from "../../global/module/diff.js";

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

    #add_to_lookup(constructor, id) {
        if (this.#lookup.has(constructor))
            this.#lookup.get(constructor).add(id);
        else
            this.#lookup.set(constructor, new Set([ id ]));
    }

    #add(item) {
        if (!(item instanceof Prefab)) throw new TypeError("Item must be an instance of Prefab.");

        const id = item.id;
        if (!this.#table.has(item.constructor.id)) throw new TypeError("Item is not a valid prefab.");
        if (this.#map.has(item.id)) throw new Error("Item already exists in inventory.");

        this.#map.set(id, item);

        // id's formatted with "#" and "." as separators
        // separate the id so that an item with id "item.123or.id.split(/[#.]/);#type" can be found by "item#abc.123#type" or "item#abc.123" or "item#abc" or "item"
        const idParts = item.constructor.id.split(/(?=#|\.|\#)/);
        for (let i = 0; i < idParts.length; i++) {
            const part = idParts.slice(0, i + 1).join("");
            this.#add_to_lookup(part, id);
        }
    }

    add(item) {
        this.#add(item);

        const id = item.id;
        this.#added.add(id);
        if (this.#removed.has(id)) this.#removed.delete(id);
    }
    change(item, fn) {
        if (typeof fn !== "function") throw new TypeError("Callback must be a function.");
        if (!(item instanceof Prefab)) throw new TypeError("Item must be an instance of Prefab.");

        const id = item.id;
        if (!this.#table.has(item.constructor.id)) throw new TypeError("Item is not a valid prefab.");
        if (!this.#map.has(id)) throw new Error("Item not found in inventory.");

        const before = item.export();
        fn(item);
        const after = item.export();
        this.#map.set(id, item);

        if (this.#added.has(id))
            return;
        this.#changed.set(id, create_diff(before, after));
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

    findById(id = "") {
        if (typeof id !== "string") throw new TypeError("Invalid ID.");
        return this.#map.get(id) || null;
    }
    findByType(type) {
        if (!this.#table.has(type.id)) throw new TypeError("Invalid type.");
        return this.#lookup.get(type.id) || new Set();
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
            Object.values(data || {}).forEach(datum => {
                if (typeof datum !== "object" || datum === null || !datum.construct || !this.#table.has(datum.construct))
                    throw new TypeError(`Invalid item data`);

                const ItemClass = this.#table.get(datum.construct);
                const instance = new ItemClass();
                try {
                    instance.import(datum.data);
                } catch (err) { throw new Error(`${datum.construct}: ${err.message}\n${JSON.stringify(datum)}`) }
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