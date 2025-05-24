export default class Text {
    #singular;
    #plural;
    constructor(text) {
        this.#singular = text;
        this.#plural = this;
    };

    plural(plural) {
        if (plural ?? true === true) {
            this.#plural = (singular => {
                let temp;

                // s, sh, ch, x, z, consonant + o -> -es
                temp = singular.replace(/(?<=sh?|ch|x|z|[^aeiou]o)$/i, "es");
                if (temp !== singular) return temp;

                // consonant + y -> -ies
                temp = singular.replace(/(?<=[^aeiou])y$/i, "ies");
                if (temp !== singular) return temp;

                // f, fe -> -ves
                temp = singular.replace(/fe?$/i, "ves");
                if (temp !== singular) return temp;

                return `${singular}s`;
            })(this.#singular);
        } else if (plural === "") this.#plural = this.#singular;
        else this.#plural = plural;
        return this;
    };

    case(type, n = 1) {
        const text = Number.isNaN(Number(n)) || n === 1 || n === 1n || n === "1" ?
            this.#singular : this.#plural;
        switch (type?.toLowerCase?.()) {
            case 'lower':
                return text.toLowerCase();
            case 'upper':
                return text.toUpperCase();
            default:
            case 'title':
                return text.toLowerCase()
                    .split(' ')
                    .map(text => text.charAt(0).toUpperCase() + text.slice(1))
                    .join(' ');
        };
    };
};