import Text from "../module/text.js";

import Inventory from "./function/inventory.js";

export default class User {
    #id;
    #email;
    #name;
    #username;
    #avatar;
    #auth_service;

    inventory = new Inventory();

    constructor({ id, email, name, username, avatar, auth_service }) {
        this.#id = id;
        this.#email = email;
        this.#name = name;
        this.#username = username || name;
        this.#avatar = avatar || "/game/assets/avatar.svg";
        this.#auth_service = new Text(auth_service || "unknown service").plural(false);
    }

    get id() { return this.#id; }
    get email() { return this.#email; }
    get name() { return this.#name; }
    get username() { return this.#username; }
    get avatar() { return this.#avatar; }
    get auth_service() { return this.#auth_service; }
};