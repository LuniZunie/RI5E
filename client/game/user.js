import ID_TABLE from "./id-table.js";

import Text from "../module/text.js";

import Inventory from "./function/inventory.js";

import Prefab from "./prefab/prefab.js";

export default class User {
    #id;
    #email;
    #name;
    #username;
    #avatar;
    #auth_service;

    inventory = new Inventory();

    #table;
    #inventory = new Map();

    #save = {
        added: new Set(),
        changed: new Set(),
        removed: new Set(),
    };

    constructor({ id, email, name, username, avatar, auth_service }) {
        this.#id = id;
        this.#email = email;
        this.#name = name;
        this.#username = username || name;
        this.#avatar = avatar || "/game/assets/avatar.svg";
        this.#auth_service = new Text(auth_service || "unknown service").plural(false);

        this.#table = ID_TABLE.build();
    }

    get id() { return this.#id; }
    get email() { return this.#email; }
    get name() { return this.#name; }
    get username() { return this.#username; }
    get avatar() { return this.#avatar; }
    get auth_service() { return this.#auth_service; }

    #is_valid_user_data(data) { // TODO
        if (typeof data !== "object" || data === null) throw new TypeError("Invalid user data, must be an object");
        return true;
    }
    import(data) {
        try {
            this.#is_valid_user_data(data);
            Object.entries(data?.inventory || {}).forEach(([ id, item ]) => {
                if (typeof item !== "object" || item === null || !item.id || !this.#table.has(item.id))
                    throw new TypeError(`Invalid item data`);

                const ItemClass = this.#table.get(item.id);
                const instance = new ItemClass();
                try {
                    instance.import(item.data);
                } catch (err) { throw new Error(`${item.id}: ${err.message}`); }
                this.#inventory.set(id, instance);
            });
        } catch (err) {
            console.error("Failed to import item:", err);
            this.#inventory.clear(); // clear inventory on import failure
            return false;
        }
        return true;
    }
    export() {
        const o = { added: [], changed: [], removed: [] };
        this.#save.added.forEach(item => {
            if (!(item instanceof Prefab)) {
                console.warn(`Item ${item.constructor.id} is not a valid Prefab instance.`);
                return;
            }
            o.added.push({ id: item.id, data: { id: item.constructor.id, data: item.export() } });
        });
        this.#save.changed.forEach(item => {
            if (!(item instanceof Prefab)) {
                console.warn(`Item ${item.constructor.id} is not a valid Prefab instance.`);
                return;
            }
            o.changed.push({ id: item.id, data: { id: item.constructor.id, data: item.export() } });
        });
        this.#save.removed.forEach(id => o.removed.push(id));

        this.#save.added.clear(); // clear after export
        this.#save.changed.clear(); // clear after export
        this.#save.removed.clear(); // clear after export

        return o;
    }

    add(item) {
        if (!(item instanceof Prefab))
            throw new TypeError("Item must be an instance of Prefab.");

        const constructor = item.constructor;
        if (!this.#table.has(constructor.id))
            throw new Error(`Unknown item type: ${constructor.id}`);

        this.#inventory.set(item.id, item);
        this.#save.added.add(item);
        if (this.#save.removed.has(item.id))
            this.#save.removed.delete(item.id); // remove from removed if it was removed in this session
        return this.#inventory.size; // return new inventory size
    }
    find(item_class, properties = {}) {
        const A = [];
        this.#inventory.forEach(item => {
            if (!(item instanceof item_class)) return; // not the right class
            for (const [ k, v ] of Object.entries(properties)) {
                if (v(item[k]) === false) return; // property does not match
            }
            A.push(item); // all properties match
        });
        return A;
    }
    change(item) {
        if (!(item instanceof Prefab))
            throw new TypeError("Item must be an instance of Prefab.");

        if (!this.#inventory.has(item.id))
            throw new Error("Item not found in inventory.");

        this.#save.changed.add(item);
        return this.#inventory.get(item.id); // return the item itself
    }
    remove(item) {
        if (!(item instanceof Prefab))
            throw new TypeError("Item must be an instance of Prefab.");

        if (!this.#inventory.has(item.id))
            throw new Error("Item not found in inventory.");

        this.#inventory.delete(item.id);
        this.#save.removed.add(item.id);
        if (this.#save.added.has(item))
            this.#save.added.delete(item); // remove from added if it was added in this session
        if (this.#save.changed.has(item))
            this.#save.changed.delete(item); // remove from changed if it was changed in this session
        return this.#inventory.size; // return new inventory size
    }
};