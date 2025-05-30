import ID_TABLE from "./id-table.js";

import Text from "../module/text.js";

import Prefab from "./prefab/prefab.js";

export default class User {
    #id;
    #email;
    #name;
    #username;
    #avatar;
    #auth_service;

    #table;
    #inventory = new Set();

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
            data.inventory?.forEach?.(item => {
                if (typeof item !== "object" || item === null || !item.id || !this.#table.has(item.id))
                    throw new TypeError(`Invalid item data`);

                const ItemClass = this.#table.get(item.id);
                const instance = new ItemClass();
                try {
                    instance.import(item.data);
                } catch (err) { throw new Error(`${item.id}: ${err.message}`); }
                this.#inventory.add(instance);
            });
        } catch (err) {
            console.error("Failed to import item:", err);
            this.#inventory.clear(); // clear inventory on import failure
            return false;
        }
        return true;
    }
    export() {
        const o = { inventory: [] };
        this.#inventory.forEach(item => {
            if (!(item instanceof Prefab)) {
                console.warn(`Item ${item.constructor.id} is not a valid Prefab instance.`);
                return;
            }
            o.inventory.push({ id: item.constructor.id, data: item.export() });
        });
        return o;
    }

    add(item) {
        if (!(item instanceof Prefab))
            throw new TypeError("Item must be an instance of Prefab.");

        const constructor = item.constructor;
        if (!this.#table.has(constructor.id))
            throw new Error(`Unknown item type: ${constructor.id}`);

        this.#inventory.add(item);
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
    remove(item) {
        if (!(item instanceof Prefab))
            throw new TypeError("Item must be an instance of Prefab.");

        if (!this.#inventory.has(item))
            throw new Error("Item not found in inventory.");

        this.#inventory.delete(item);
        return this.#inventory.size; // return new inventory size
    }
};