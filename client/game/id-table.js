/*
    ID FORMAT

    class ids must be:
        - unique
        - in snake_case format

    if class is given a name (ex. class Name extends Parent {})
        - use class name as id
        - use "." to separate
    if class is not given a name (ex. const name = class extends Parent {})
        - use variable name as id
        - use "#" to separate
    if class is enclosed by another class
        - use enclosing class id as prefix
        - use ">" to separate
*/

import linker from "./linker.js";
import Linker from "../module/linker.js";

import "../module/string.js";

export default {
    build() {
        const ID_TABLE = new Map();
        linker.list(Linker.Node, 0).forEach(node => {
            const info = String.format_literal(`
                [CONSTRUCTOR_NAME]: ${node.constructor.name}
                id: ${node.id}
                name: ${node.name}
                description: ${node.description}
            `);

            if (!node.id || !typeof node.id === "string")
                throw new Error(`ID_TABLE: Invalid id.\n${info}`);
            else if (ID_TABLE.has(node.id))
                throw new Error(`ID_TABLE: Duplicate id.\n${info}`);

            ID_TABLE.set(node.id, node);
        });
        return ID_TABLE;
    }
}