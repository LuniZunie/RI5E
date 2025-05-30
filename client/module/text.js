export default class Text {
    static case = Object.freeze({
        lower: Symbol("lower"),
        upper: Symbol("upper"),
        title: Symbol("title"),
        sentence: Symbol("sentence"),
        camel: Symbol("camel"),
        pascal: Symbol("pascal"),
        snake: Symbol("snake"),
        split: Symbol("split"),
    });

    // convert from case to array of words
    static #from_case(text, type) {
        const temp = (text => {
            switch (type) {
                case Text.case.lower:
                case Text.case.upper:
                case Text.case.title:
                case Text.case.sentence:
                    return text.split(/\s+/);
                case Text.case.camel:
                case Text.case.pascal:
                    return text.split(/(?=[A-Z])/);
                case Text.case.snake:
                    return text.split(/_/g);
                case Text.case.split:
                    throw new TypeError("Split case is only used for output, not input");
                default:
                    throw new TypeError("Invalid case type, must be a Text.case value");
            }
        })(text.toString().trim());

        if (type === Text.case.sentence)
            return { in_sentence_case: true, words: temp.map(word => word.trim()).filter(word => word.length > 0) };
        return { in_sentence_case: false, words: temp.map(word => word.trim().toLowerCase()).filter(word => word.length > 0) };
    };

    #in_sentence_case = false;
    #single;
    #plural;
    constructor(text, currentCase = Text.case.sentence) {
        const from_case = Text.#from_case(text, currentCase);
        this.#in_sentence_case = from_case.in_sentence_case;
        this.#single = from_case.words;

        this.#plural = this.#get_plural();
    };

    #get_plural(plural) {
        if (plural ?? true === true) {
            const temp = [ ...this.#single ];

            const end = temp.length - 1;
            temp[end] = (single => {
                let temp;

                // s, sh, ch, x, z, consonant + o -> -es
                temp = single.replace(/(?<=sh?|ch|x|z|[^aeiou]o)$/i, "es");
                if (temp !== single) return temp;

                // consonant + y -> -ies
                temp = single.replace(/(?<=[^aeiou])y$/i, "ies");
                if (temp !== single) return temp;

                // f, fe -> -ves
                temp = single.replace(/fe?$/i, "ves");
                if (temp !== single) return temp;

                return `${single}s`;
            })(this.#single[end]);

            return temp;
        } else if (plural === false)
            return [ ...this.#single ];
        else if (plural instanceof Text)
            return plural.case(Text.case.split).get();
        else
            throw new TypeError("Invalid plural argument, must be boolean or Text instance");
    };
    plural() {
        this.#plural = this.#get_plural(...arguments);
        return this;
    }

    case(type = Text.case.sentence) {
        const format = (text) => {
            switch (type) {
                case Text.case.lower:
                    return text.map(word => word.toLowerCase()).join(" ");
                case Text.case.upper:
                    return text.map(word => word.toUpperCase()).join(" ");
                case Text.case.title:
                    return text.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
                case Text.case.sentence:
                    if (this.#in_sentence_case)
                        return text.join(" ");

                    let punctuation = true;
                    return text.map(word => {
                        let rtn = punctuation ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word.toLowerCase();
                        punctuation = /[.!?]$/.test(word);
                        return rtn;
                    }).join(" ");
                case Text.case.camel:
                    return text.map((word, i) => i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join("");
                case Text.case.pascal:
                    return text.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join("");
                case Text.case.snake:
                    return text.map(word => word.toLowerCase()).join("_");
                case Text.case.split:
                    return text;
                default:
                    throw new TypeError("Invalid case type, must be a Text.case value");
            }
        };

        const [ single, plural ] = [ format(this.#single), format(this.#plural) ];
        return Object.freeze({
            get(n = 1) {
                return Number.isNaN(Number(n)) || n === 1 || n === 1n || n === "1" ?
                    single : plural;
            }
        });
    };
};