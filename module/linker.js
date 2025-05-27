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

    go(construct) {
        const name = construct.name;
        const ref = `Linker>${this.#namePath.join(".")}[${name}]`;

        const current = this.#get(this.#path);
        if (current === Linker.Terminus)
            throw new Error(`${ref}: Reached terminus, cannot extend path.`);

        const temp = new Linker();
        temp.#path = [ ...this.#path, construct ];
        temp.#namePath = [ ...this.#namePath, name ];
        temp.#tree = this.#tree;
        return temp;
    };

    link(...constructs) {
        for (const construct of constructs) {
            try { new construct(); }
            catch (e) {
                throw new Error(`Linker: Invalid constructor ${construct}.`);
            };

            const name = construct.name;
            const ref = `Linker>${this.#namePath.join(".")}[${name}]`;

            if (!(new construct() instanceof this.#path.slice(-1)[0]))
                throw new Error(`${ref}: ${name} in not a valid subclass.`);

            const current = this.#get(this.#path);
            if (current === Linker.Terminus) {
                this.#get(this.#path.slice(0, -1))
                    .set(this.#path.slice(-1)[0], new Map([ [ construct, Linker.Terminus ] ]));
                return this;
            } else if (current instanceof Map) {
                if (current.has(construct))
                    throw new Error(`${ref}: Already linked to ${name}.`);
                current.set(construct, Linker.Terminus);
                return this;
            }
        }
    };

    // depth of 0 searches recursively
    list(nodeType = Linker.Node, depth = 0) {
        const ref = `Linker>${this.#path.join(".")}`;
        if (![ Linker.Terminus, Linker.Junction, Linker.Node ].includes(nodeType))
            throw new Error(`${ref}: Invalid node type ${nodeType}.`);
        if (!(Number.isInteger(depth) && depth >= 0))
            throw new Error(`${ref}: Invalid depth ${depth}.`);

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