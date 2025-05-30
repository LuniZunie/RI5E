export default class Linker {
    static Terminus = Symbol("terminus");
    static Junction = Symbol("junction");
    static Node = Symbol("node");

    #path = [];
    #namePath = [];
    #tree = new Map();

    constructor(root) {
        this.#path.push(root);
        this.#tree.set(root, Linker.Terminus);
    }

    #get(path) {
        let current = this.#tree;
        for (const part of path)
            current = current.get(part);
        return current;
    };

    goto(...constructs) {
        const [ path, namePath ] = [ [ ...this.#path ], [ this.#namePath ] ];
        for (const construct of constructs) {
            const name = construct.name;
            const ref = `Linker>${this.#namePath.join(".")}[${name}]`;

            const current = this.#get(path);
            if (current === Linker.Terminus)
                throw new Error(`${ref}: Reached terminus, cannot extend path.`);
            else if (!current.has(construct))
                throw new Error(`${ref}: Path does not exist.`);

            path.push(construct);
            namePath.push(name);
        }

        const temp = new Linker(path[0]);
        [ temp.#path, temp.#namePath ] = [ path, namePath ];
        temp.#tree = this.#tree;
        return temp;
    };

    back(n = Infinity) {
        if (!(Number.isInteger(n) && n >= 0))
            throw new Error(`Linker>${this.#namePath.join(".")}: Invalid back count ${n}.`);

        if (n === 0) return this;
        if (n >= this.#path.length)
            n = this.#path.length - 1; // go back to root if n is too large

        const path = this.#path.slice(0, -n);
        const namePath = this.#namePath.slice(0, -n);

        const temp = new Linker(path[0]);
        [ temp.#path, temp.#namePath ] = [ path, namePath ];
        temp.#tree = this.#tree;
        return temp;
    }

    link(...constructs) {
        for (const construct of constructs) {
            try { new construct(); }
            catch (e) {
                throw new Error(`Linker: Invalid constructor ${construct}.`);
            };

            const name = construct.name;
            const ref = `Linker>${this.#namePath.join(".")}[${name}]`;

            const current = this.#get(this.#path);
            if (current === Linker.Terminus)
                this.#get(this.#path.slice(0, -1))
                    .set(this.#path.slice(-1)[0], new Map([ [ construct, Linker.Terminus ] ]));
            else if (current instanceof Map) {
                if (current.has(construct))
                    throw new Error(`${ref}: Already linked to ${name}.`);
                current.set(construct, Linker.Terminus);
            }
        }
        return this;
    };

    // depth of 0 searches recursively
    list(nodeType = Linker.Node, depth = 0) {
        const ref = `Linker>${this.#path.join(".")}`;
        if (![ Linker.Terminus, Linker.Junction, Linker.Node ].includes(nodeType))
            throw new Error(`${ref}: Invalid node type ${nodeType}.`);
        if (!(Number.isInteger(depth) && depth >= 0))
            throw new Error(`${ref}: Invalid depth ${depth}.`);

        if (this.#get(this.#path) === Linker.Terminus)
            return [];

        const q = [ { map: this.#get(this.#path), depth: 0 } ];
        const [ termini, junction ] = [ [], [] ];
        while (q.length > 0) {
            const { map, depth: d } = q.shift();
            if (depth === 0 || d < depth) {
                for (const [ k, v ] of map) {
                    if (v === Linker.Terminus) termini.push(k);
                    else {
                        junction.push(k);
                        q.push({ map: v, depth: d + 1 });
                    }
                }
            }
        }
        switch (nodeType) {
            case Linker.Terminus: return termini;
            case Linker.Junction: return junction;
            case Linker.Node: return [ ...termini, ...junction ];
        }
    };
};