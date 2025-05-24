import Variable from "../../src/js/variable.js";
import DimensionMap from '../../src/js/dimension_map.js';

const temp = {};

const $ = function(construct, o) {
    const tmp = new construct();
    for (const [ k, v ] of Object.entries(o)) {
        if (k in tmp) tmp[k] = v;
        else throw new Error("invalid definition");
    }
    return tmp;
};
const bin = n => 2**n;

class Word {
    #singular;
    #plural;
    constructor(word) {
        this.#singular = word;
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

    case(n, type) {
        const word = Number.isNaN(Number(n)) || n === 1 || n === 1n || n === "1" ?
            this.#singular : this.#plural;
        switch (type?.toLowerCase?.()) {
            case 'lower':
                return word.toLowerCase();
            case 'upper':
                return word.toUpperCase();
            default:
            case 'title':
                return word.toLowerCase()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
        };
    };
};

class Time {
    static #seconds_per_day = 10;
    static {
        const day = n => n*Time.#seconds_per_day; // 10s
        const week = n => Time.day(n*7); // 1m10s
        const month = n => Time.week(n*4); // 4m40s
        const season = n => Time.month(n*3); // 14m00s
        const year = n => Time.season(n*4); // 56m00s

        const Month = class Month {
            static {
                March = bin(0);
                April = bin(1);
                May = bin(2);
                June = bin(3);
                July = bin(4);
                August = bin(5);
                September = bin(6);
                October = bin(7);
                November = bin(8);
                December = bin(9);
                January = bin(10);
                February = bin(11);
            };
        };
        const Season = class Season {
            static {
                Spring = Time.Month.March & Time.Month.April & Time.Month.May;
                Summer = Time.Month.June & Time.Month.July & Time.Month.August;
                Autumn = Time.Month.September & Time.Month.October & Time.Month.November;
                Winter = Time.Month.December & Time.Month.January & Time.Month.February;
            };
        };
        const Year = Time.Season.Spring & Time.Season.Summer & Time.Season.Autumn & Time.Season.Winter;
    };
};

class Prefab {
    static id = "ERROR";
    static name = "<none>";
    static description = "<none>";
};
class Item extends Prefab {
    static buyable = false;
    static buy_price = new Variable();

    static sellable = false;
    static sell_price = new Variable();
};
class Drop extends Prefab {
    static yield = NaN;
    static item = class extends Item {};
};

// foraging
class Forageable extends Item {
    static season = 0;
    static time = NaN;

    static drop = class extends Drop {};
};
class Grass extends Forageable {
    static id = "forageable:grass_patch";
    static name = new Word("grass patch");

    static season = Time.Year;
    static time = new Variable("static:0", Time.day(1));

    static drop = class extends Drop {
        static id = "forageable:grass_patch:item#drop";
        static name = new Word("grass").plural("");

        static yield = new Variable("variance:0", 5, .05);
        static item = class extends Item {
            static id = "forageable:grass_patch:item";
            static name = new Word("grass").plural("");

            static sellable = true;
            static sell_price = new Variable("range:2", 0.01, .001);
        };
    };
};
class Clover extends Forageable {
    static id = "forageable:clover_patch";
    static name = new Word("clover patch");

    static season = Time.Year;
    static time = new Variable("error:0", Time.day(2), Time.day(1));

    static drop = class extends Drop {
        static id = "forageable:clover_patch:item#drop";
        static name = new Word("clover");

        static yield = new Variable("variance:0", 5, .05);
        static item = class extends Item {
            static id = "forageable:clover_patch:item";
            static name = new Word("clover");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.02, .0025);
        };
    }
};
class Dandelion extends Forageable {
    static id = "forageable:dandelion";
    static name = new Word("dandelion");

    static season = Time.Season.Spring;
    static time = new Variable("error:0", Time.day(3), Time.day(1));

    static drop = class extends Drop {
        static id = "forageable:dandelion:item#drop";
        static name = new Word("dandelion");

        static yield = new Variable("static:0", 1);
        static item = class extends Item {
            static id = "forageable:dandelion:item";
            static name = new Word("dandelion");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.15, .001);
        };
    };
};
class Mushroom extends Forageable {
    static id = "forageable:mushroom";
    static name = new Word("mushroom");

    static season = Time.Year;
    static time = new Variable("error:0", Time.day(3), Time.day(1));

    static drop = class extends Drop {
        static id = "forageable:mushroom:item#drop";
        static name = new Word("mushroom");

        static yield = new Variable("range:0", 1, 5);
        static item = class extends Item {
            static id = "forageable:mushroom:item";
            static name = new Word("mushroom");

            static sellable = true;
            static sell_price = new Variable("variance:2", 5.00, .025);
        };
    };
};
class Blackberry extends Forageable {
    static id = "forageable:blackberry_cane";
    static name = new Word("blackberry cane");

    static season = Time.Season.Summer;
    static time = new Variable("error:0", Time.day(5), Time.day(2));

    static drop = class extends Drop {
        static id = "forageable:blackberry_cane:item#drop";
        static name = new Word("blackberry");

        static yield = new Variable("error:0", 4, 2);
        static item = class extends Item {
            static id = "forageable:blackberry_cane:item";
            static name = new Word("blackberry");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.50, .01);
        };
    };
};
class Raspberry extends Forageable {
    static id = "forageable:raspberry_cane";
    static name = new Word("raspberry cane");

    static season = Time.Season.Summer;
    static time = new Variable("error:0", Time.day(5), Time.day(2));

    static drop = class extends Drop {
        static id = "forageable:raspberry_cane:item#drop";
        static name = new Word("raspberry");

        static yield = new Variable("error:0", 3, 2);
        static item = class extends Item {
            static id = "forageable:raspberry_cane:item";
            static name = new Word("raspberry");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.60, .01);
        };
    };
};
class Blueberry extends Forageable {
    static id = "forageable:blueberry_bush";
    static name = new Word("blueberry bush");

    static season = Time.Season.Summer;
    static time = new Variable("error:0", Time.week(2), Time.day(5));

    static drop = class extends Drop {
        static id = "forageable:blueberry_bush:item#drop";
        static name = new Word("blueberry");

        static yield = new Variable("error:0", 10, 5);
        static item = class extends Item {
            static id = "forageable:blueberry_bush:item";
            static name = new Word("blueberry");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.75, .0065);
        };
    };
};
class Grape extends Forageable {
    static id = "forageable:grape_vine";
    static name = new Word("grape vine");

    static season = Time.Season.Autumn;
    static time = new Variable("error:0", Time.week(2), Time.day(5));

    static drop = class extends Drop {
        static id = "forageable:grape_vine:item#drop";
        static name = new Word("grape");

        static yield = new Variable("error:0", 5, 3);
        static item = class extends Item {
            static id = "forageable:grape_vine:item";
            static name = new Word("grape");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.80, .0065);
        }
    };
};
class Strawberry extends Forageable {
    static id = "forageable:strawberry_bush";
    static name = new Word("strawberry bush");

    static season = Time.Season.Spring;
    static time = new Variable("error:0", Time.week(1), Time.day(3));

    static drop = class extends Drop {
        static id = "forageable:strawberry_bush:item#drop";
        static name = new Word("strawberry");

        static yield = new Variable("error:0", 2, 1);
        static item = class extends Item {
            static id = "forageable:strawberry_bush:item";
            static name = new Word("strawberry");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.90, .025);
        };
    };
};
class Banana extends Forageable {
    static id = "forageable:banana_tree";
    static name = new Word("banana tree");

    static season = Time.Season.Summer;
    static time = new Variable("error:0", Time.week(2), Time.day(3));

    static drop = class extends Drop {
        static id = "forageable:banana_tree:item#drop";
        static name = new Word("banana");

        static yield = new Variable("error:0", 5, 2);
        static item = class extends Item {
            static id = "forageable:banana_tree:item";
            static name = new Word("banana");

            static sellable = true;
            static sell_price = new Variable("variance:2", 1.00, .01);
        };
    };
};
class Apple extends Forageable {
    static id = "forageable:apple_tree";
    static name = new Word("apple tree");

    static season = Time.Season.Autumn;
    static time = new Variable("error:0", Time.week(2), Time.day(3));

    static drop = class extends Drop {
        static id = "forageable:apple_tree:item#drop";
        static name = new Word("apple");

        static yield = new Variable("variance:0", 30, .025);
        static item = class extends Item {
            static id = "forageable:apple_tree:item";
            static name = new Word("apple");

            static sellable = true;
            static sell_price = new Variable("variance:2", 1.50, .01);
        };
    };
};
class Orange extends Forageable {
    static id = "forageable:orange_tree";
    static name = new Word("orange tree");

    static season = Time.Season.Spring & Time.Season.Summer;
    static time = new Variable("error:0", Time.week(2), Time.day(2));

    static drop = class extends Drop {
        static id = "forageable:orange_tree:item#drop";
        static name = new Word("orange");

        static yield = new Variable("variance:0", 20, .03);
        static item = class extends Item {
            static id = "forageable:orange_tree:item";
            static name = new Word("orange");

            static sellable = true;
            static sell_price = new Variable("variance:2", 1.75, .01);
        };
    };
};
class Peach extends Forageable {
    static id = "forageable:peach_tree";
    static name = new Word("peach tree");

    static season = Time.Season.Summer;
    static time = new Variable("error:0", Time.week(2), Time.day(2));

    static drop = class extends Drop {
        static id = "forageable:peach_tree:item#drop";
        static name = new Word("peach");

        static yield = new Variable("variance:0", 25, .0275);
        static item = class extends Item {
            static id = "forageable:peach_tree:item";
            static name = new Word("peach");

            static sellable = true;
            static sell_price = new Variable("variance:2", 2, .0075);
        };
    };
};
class Lemon extends Forageable {
    static id = "forageable:lemon_tree";
    static name = new Word("lemon tree");

    static season = Time.Year;
    static time = new Variable("error:0", Time.week(3), Time.day(5));

    static drop = class extends Drop {
        static id = "forageable:lemon_tree:item#drop";
        static name = new Word("lemon");

        static yield = new Variable("variance:0", 15, .0275);
        static item = class extends Item {
            static id = "forageable:lemon_tree:item";
            static name = new Word("lemon");

            static sellable = true;
            static sell_price = new Variable("variance:2", 2.25, .005);
        };
    };
};
class Lime extends Forageable {
    static id = "forageable:lime_tree";
    static name = new Word("lime");

    static season = Time.Season.Summer & Time.Season.Autumn;
    static time = new Variable("error:0", Time.week(3), Time.week(1));

    static drop = class extends Drop {
        static id = "forageable:lime_tree:item#drop";
        static name = new Word("lime");

        static yield = new Variable("variance:0", 15, .0275);
        static item = class extends Item {
            static id = "forageable:lime_tree:item";
            static name = new Word("lime");

            static sellable = true;
            static sell_price = new Variable("variance:2", 2.5, .005);
        };
    };
};
class Cherry extends Forageable {
    static id = "forageable:cherry_tree";
    static name = new Word("cherry tree");

    static season = Time.Season.Spring;
    static time = new Variable("error:0", Time.week(2), Time.day(3));

    static drop = class extends Drop {
        static id = "forageable:cherry_tree:item#drop";
        static name = new Word("cherry");

        static yield = new Variable("variance:0", 25, .025);
        static item = class extends Item {
            static id = "forageable:cherry_tree:item";
            static name = new Word("cherry");

            static sellable = true;
            static sell_price = new Variable("variance:2", 4.00, .1);
        };
    };
};
class Pineapple extends Forageable {
    static id = "forageable:pineapple_plant";
    static name = new Word("pineapple plant");

    static season = Time.Season.Spring & Time.Season.Summer;
    static time = new Variable("error:0", Time.month(1), Time.day(4));

    static drop = class extends Drop {
        static id = "forageable:pineapple_plant:item#drop";
        static name = new Word("pineapple");

        static yield = new Variable("static:0", 1);
        static item = class extends Item {
            static id = "forageable:pineapple_plant:item";
            static name = new Word("pineapple");

            static sellable = true;
            static sell_price = new Variable("variance:2", 10.00, .05);
        };
    };
};
class Coconut extends Forageable {
    static id = "forageable:coconut_tree";
    static name = new Word("coconut tree");

    static season = Time.Year;
    static time = new Variable("error:0", Time.month(2), Time.week(2));

    static drop = class extends Drop {
        static id = "forageable:coconut_tree:item#drop";
        static name = new Word("coconut");

        static yield = new Variable("error:0", 7, 3);
        static item = class extends Item {
            static id = "forageable:coconut_tree:item";
            static name = new Word("coconut");

            static sellable = true;
            static sell_price = new Variable("variance:2", 20.00, .075);
        };
    };
};

/*
    foraging
    - grass
    - clover
    - dandelion
    - mushroom
    - blackberry
    - raspberry
    - blueberry
    - grape
    - strawberry
    - banana
    - apple
    - orange
    - peach
    - lemon
    - lime
    - cherry
    - pineapple
    - coconut
*/

class Biome extends Prefab {
    static sprite = "";

    static forageables = [];
    static fish = [];
};

class TemperateGrassland extends Biome {
    static id = "biome:temperate_grassland";
    static name = new Word("temperate grassland");
    static description = new Word("a wide, open area with grass and few trees");

    static forageables = [ Grass, Clover, Dandelion, Blackberry, Grape, Strawberry, Apple, Cherry ];
};
class TropicalGrassland extends Biome {
    static id = "biome:tropical_grassland";
    static name = new Word("tropical grassland");
    static description = new Word("a warm, open area with tall grass and scattered trees");

    static forageables = [ Grass, Banana, Orange, Lemon, Lime, Pineapple, Coconut ];
};

class Shrubland extends Biome {
    static id = "biome:shrubland";
    static name = new Word("shrubland");
    static description = new Word("a dry, open area with scattered shrubs");

    static forageables = [ Grass, Clover, Dandelion, Mushroom, Blackberry, Raspberry, Grape, Strawberry, Apple, Peach, Cherry ];
};
class Scrubland extends Biome {
    static id = "biome:scrubland";
    static name = new Word("scrubland");
    static description = new Word("a dry, open area with low shrubs and grasses");

    static forageables = [ Grass, Blackberry, Grape, Orange, Lemon, Lime ];
};

class TemperateForest extends Biome {
    static id = "biome:temperate_forest";
    static name = new Word("temperate forest");
    static description = new Word("a dense, wooded area with a variety of plants");

    static forageables = [ Grass, Clover, Dandelion, Mushroom, Blackberry, Raspberry, Blueberry, Grape, Strawberry, Apple, Peach, Cherry ];
};
class BorealForest extends Biome {
    static id = "biome:boreal_forest";
    static name = new Word("boreal forest");
    static description = new Word("a cold, coniferous forest with evergreen trees");

    static forageables = [ Grass, Clover, Dandelion, Mushroom ];
};
class MontaneForest extends Biome {
    static id = "biome:montane_forest";
    static name = new Word("montane forest");
    static description = new Word("a forest located in mountainous regions with diverse flora");

    static forageables = [ Grass, Clover, Dandelion, Mushroom, Blackberry, Raspberry, Blueberry, Grape, Strawberry, Apple, Orange, Peach, Lemon, Lime, Cherry ];
};
class SubtropicalForest extends Biome {
    static id = "biome:subtropical_forest";
    static name = new Word("subtropical forest");
    static description = new Word("a warm, humid forest with lush vegetation");

    static forageables = [ Grass, Mushroom, Blackberry, Raspberry, Blueberry, Grape, Strawberry, Banana, Apple, Orange, Peach, Lemon, Lime, Cherry, Pineapple, Coconut ];
};
class MangroveForest extends Biome {
    static id = "biome:mangrove_forest";
    static name = new Word("mangrove forest");
    static description = new Word("a coastal forest with salt-tolerant trees");

    static forageables = [ Pineapple, Coconut ];
};
class TropicalRainforest extends Biome {
    static id = "biome:tropical_rainforest";
    static name = new Word("tropical rainforest");
    static description = new Word("a dense, humid forest with a high diversity of plants and animals");

    static forageables = [ Grass, Mushroom, Grape, Banana, Orange, Lemon, Lime, Pineapple, Coconut ];
};