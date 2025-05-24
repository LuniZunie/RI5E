import Variable from "../../module/variable.js";
import DimensionMap from './dimension_map.js';
import Climate, { NoiseMap } from '../../module/climate.js';

const temp = {};

const $ = function(construct, o) {
    let tmp = new construct();
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

    case(type, n = 1) {
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
    static day = n => n*Time.#seconds_per_day; // 10s
    static week = n => Time.day(n*7); // 1m10s
    static month = n => Time.week(n*4); // 4m40s
    static season = n => Time.month(n*3); // 14m00s
    static year = n => Time.season(n*4); // 56m00s

    static Month = class Month {
        static March = bin(0);
        static April = bin(1);
        static May = bin(2);
        static June = bin(3);
        static July = bin(4);
        static August = bin(5);
        static September = bin(6);
        static October = bin(7);
        static November = bin(8);
        static December = bin(9);
        static January = bin(10);
        static February = bin(11);
    };
    static Season = class Season {
        static Spring = Time.Month.March & Time.Month.April & Time.Month.May;
        static Summer = Time.Month.June & Time.Month.July & Time.Month.August;
        static Autumn = Time.Month.September & Time.Month.October & Time.Month.November;
        static Winter = Time.Month.December & Time.Month.January & Time.Month.February;
    };
    static Year = Time.Season.Spring & Time.Season.Summer & Time.Season.Autumn & Time.Season.Winter;
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

    static climate;

    static forageables = [];
    static fishable = false;

    climate;
    distance;
    locked = true;
};

class TemperateGrassland extends Biome {
    static id = "biome:temperate_grassland";
    static name = new Word("temperate grassland");
    static description = new Word("a wide, open area with grass and few trees");

    static sprite = "#88c070";

    static climate = $(Climate, {
        altitude: 0.5,
        temperature: 0.5,
        humidity: 0.5,
    });

    static forageables = [ Grass, Clover, Dandelion, Blackberry, Grape, Strawberry, Apple, Cherry ];
};
class TropicalGrassland extends Biome {
    static id = "biome:tropical_grassland";
    static name = new Word("tropical grassland");
    static description = new Word("a warm, open area with tall grass and scattered trees");

    static sprite = "#b8d07d";

    static climate = $(Climate, {
        altitude: 0.5,
        temperature: 0.6,
        humidity: 0.8,
    });

    static forageables = [ Grass, Banana, Orange, Lemon, Lime, Pineapple, Coconut ];
};

class Shrubland extends Biome {
    static id = "biome:shrubland";
    static name = new Word("shrubland");
    static description = new Word("a dry, open area with scattered shrubs");

    static sprite = "#c2a662";

    static climate = $(Climate, {
        altitude: 0.7,
        temperature: 0.9,
        humidity: 0.1,
    });

    static forageables = [ Grass, Clover, Dandelion, Mushroom, Blackberry, Raspberry, Grape, Strawberry, Apple, Peach, Cherry ];
};
class Scrubland extends Biome {
    static id = "biome:scrubland";
    static name = new Word("scrubland");
    static description = new Word("a dry, open area with low shrubs and grasses");

    static sprite = "#b79e68";

    static climate = $(Climate, {
        altitude: 0.3,
        temperature: 0.8,
        humidity: 0.3,
    });

    static forageables = [ Grass, Blackberry, Grape, Orange, Lemon, Lime ];
};

class TemperateForest extends Biome {
    static id = "biome:temperate_forest";
    static name = new Word("temperate forest");
    static description = new Word("a dense, wooded area with a variety of plants");

    static sprite = "#4b8b3b";

    static climate = $(Climate, {
        altitude: 0.5,
        temperature: 0.6,
        humidity: 0.3,
    });

    static forageables = [ Grass, Clover, Dandelion, Mushroom, Blackberry, Raspberry, Blueberry, Grape, Strawberry, Apple, Peach, Cherry ];
};
class MontaneForest extends Biome {
    static id = "biome:montane_forest";
    static name = new Word("montane forest");
    static description = new Word("a forest located in mountainous regions with diverse flora");

    static sprite = "#44695f";

    static climate = $(Climate, {
        altitude: 1,
        temperature: 0.2,
        humidity: 0.5,
    });

    static forageables = [ Grass, Clover, Dandelion, Mushroom, Blackberry, Raspberry, Blueberry, Grape, Strawberry, Apple, Orange, Peach, Lemon, Lime, Cherry ];
};
class SubtropicalForest extends Biome {
    static id = "biome:subtropical_forest";
    static name = new Word("subtropical forest");
    static description = new Word("a warm, humid forest with lush vegetation");

    static sprite = "#5aa85c";

    static climate = $(Climate, {
        altitude: 0.4,
        temperature: 0.8,
        humidity: 0.7,
    });

    static forageables = [ Grass, Mushroom, Blackberry, Raspberry, Blueberry, Grape, Strawberry, Banana, Apple, Orange, Peach, Lemon, Lime, Cherry, Pineapple, Coconut ];
};
class MangroveForest extends Biome {
    static id = "biome:mangrove_forest";
    static name = new Word("mangrove forest");
    static description = new Word("a coastal forest with salt-tolerant trees");

    static sprite = "#417760";

    static climate = $(Climate, {
        altitude: 0.2,
        temperature: 0.7,
        humidity: 0.9,
    });

    static forageables = [ Pineapple, Coconut ];
};

class TropicalRainforest extends Biome {
    static id = "biome:tropical_rainforest";
    static name = new Word("tropical rainforest");
    static description = new Word("a dense, humid forest with a high diversity of plants and animals");

    static sprite = "#2f844c";

    static climate = $(Climate, {
        altitude: 0.4,
        temperature: 0.8,
        humidity: 0.8,

    });

    static forageables = [ Grass, Mushroom, Grape, Banana, Orange, Lemon, Lime, Pineapple, Coconut ];
};

class Water extends Biome {
    static id = "biome:water";
    static name = new Word("water");
    static description = new Word("a body of water, such as a river, lake, or ocean");

    static sprite = "#3ca9dd";

    static climate = $(Climate, {
        altitude: 0,
        temperature: 0.3,
        humidity: 1,
    });

    static forageables = [];
    static fishable = true;
};

const Biomes = [
    TemperateGrassland, TropicalGrassland,
    Shrubland, Scrubland,
    TemperateForest, MontaneForest, SubtropicalForest, MangroveForest,
    TropicalRainforest,
    Water
];

const map_size = 6;
const noise_maps = Object.fromEntries(Climate.measurements.map(k => [ k, Climate.noise_map(map_size, 1) ]));

const size = 2 ** map_size;
const len = size ** 2;

const [ cx, cy ] = [ (size - 1) / 2, (size - 1) / 2 ];
const map = [];
for (let i = 0; i < len; i++) {
    const o = {};
    for (const k of Climate.measurements)
        o[k] = noise_maps[k][i];

    const [ x, y ] = [ i % size, Math.floor(i / size) ];
    const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    const climate = $(Climate, o).combine(Biomes[0].climate, 1 - dist / (size / 15));

    let match;
    if (climate.altitude < 0.1)
        match = Water;
    else
        match = Biomes.map(biome => [ biome, biome.climate.compare(climate) ]).sort((a, b) => a[1] - b[1])[0][0];

    map.push($(match, {
        climate,
        distance: dist,
        locked: !((x === Math.floor(cx) || x === Math.ceil(cx)) && (y === Math.floor(cy) || y === Math.ceil(cy))),
    }));
}

export default new DimensionMap(size, size)
    .offset("center", "center")
    .set(map)
    .constant;

// lumbering
class Tree extends Prefab {
    static level = NaN;
    static strength = NaN;

    static size = NaN;
    static time = NaN;
    static death = NaN;

    static seed = class extends Item {};
    static drop = class extends Drop {};
};
class BuckeyeTree extends Tree {
    static id = "tree:buckeye_tree";
    static name = new Word("buckeye tree");

    static level = 0;
    static strength = 4;

    static size = 20;
    static time = new Variable("error:0", Time.month(20), Time.week(2));
    static death = 0.15;

    static seed = class extends Item {
        static id = "tree:buckeye_tree:seed";
        static name = new Word("buckeye sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 25.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:buckeye_tree:item#drop";
        static name = new Word("buckeye lumber").plural("");

        static yield = new Variable("variance:0", 3000, .1);
        static item = class extends Item {
            static id = "tree:buckeye_tree:item";
            static name = new Word("buckeye lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.55, 1e-20);
        };
    };
};
class BirchTree extends Tree {
    static id = "tree:birch_tree";
    static name = new Word("birch tree");

    static level = 0;
    static strength = 3;

    static size = 15;
    static time = new Variable("error:0", Time.month(15), Time.week(1));
    static death = 0.22;

    static seed = class extends Item {
        static id = "tree:birch_tree:seed";
        static name = new Word("birch sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 35.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:birch_tree:item#drop";
        static name = new Word("birch lumber").plural("");

        static yield = new Variable("variance:0", 2000, .1);
        static item = class extends Item {
            static id = "tree:birch_tree:item";
            static name = new Word("birch lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.60, 1e-20);
        };
    };
};
class CottonwoodTree extends Tree {
    static id = "tree:cottonwood_tree";
    static name = new Word("cottonwood tree");

    static level = 1;
    static strength = 6;

    static size = 55;
    static time = new Variable("error:0", Time.month(20), Time.week(2));
    static death = 0.15;

    static seed = class extends Item {
        static id = "tree:cottonwood_tree:seed";
        static name = new Word("cottonwood sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 40.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:cottonwood_tree:item#drop";
        static name = new Word("cottonwood lumber").plural("");

        static yield = new Variable("variance:0", 9500, .1);
        static item = class extends Item {
            static id = "tree:cottonwood_tree:item";
            static name = new Word("cottonwood lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.55, 1e-20);
        };
    };
};
class PineTree extends Tree {
    static id = "tree:pine_tree";
    static name = new Word("pine tree");

    static level = 1;
    static strength = 6;

    static size = 30;
    static time = new Variable("error:0", Time.month(20), Time.week(2));
    static death = 0.10;

    static seed = class extends Item {
        static id = "tree:pine_tree:seed";
        static name = new Word("pine sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 65.00, 0.001);
    };
    static drop = class extends Drop {
        static id = "tree:pine_tree:item#drop";
        static name = new Word("pine lumber").plural("");

        static yield = new Variable("variance:0", 5500, .1);
        static item = class extends Item {
            static id = "tree:pine_tree:item";
            static name = new Word("pine lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.70, 1e-20);
        };
    };
};
class SycamoreTree extends Tree {
    static id = "tree:sycamore_tree";
    static name = new Word("sycamore tree");

    static level = 2;
    static strength = 7;

    static size = 45;
    static time = new Variable("error:0", Time.month(25), Time.week(3));
    static death = 0.05;

    static seed = class extends Item {
        static id = "tree:sycamore_tree:seed";
        static name = new Word("sycamore sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 70.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:sycamore_tree:item#drop";
        static name = new Word("sycamore lumber").plural("");

        static yield = new Variable("variance:0", 10000, .1);
        static item = class extends Item {
            static id = "tree:sycamore_tree:item";
            static name = new Word("sycamore lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.60, 1e-20);
        };
    };
};
class SpruceTree extends Tree {
    static id = "tree:spruce_tree";
    static name = new Word("spruce tree");

    static level = 2;
    static strength = 5;

    static size = 30;
    static time = new Variable("error:0", Time.month(35), Time.month(1)+Time.week(2));
    static death = 0.15;

    static seed = class extends Item {
        static id = "tree:spruce_tree:seed";
        static name = new Word("spruce sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 60.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:spruce_tree:item#drop";
        static name = new Word("spruce lumber").plural("");

        static yield = new Variable("variance:0", 7500, .1);
        static item = class extends Item {
            static id = "tree:spruce_tree:item";
            static name = new Word("spruce lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.70, 1e-20);
        };
    };
};
class MapleTree extends Tree {
    static id = "tree:maple_tree";
    static name = new Word("maple tree");

    static level = 3;
    static strength = 8;

    static size = 35;
    static time = new Variable("error:0", Time.month(30), Time.week(3));
    static death = 0.09;

    static seed = class extends Item {
        static id = "tree:maple_tree:seed";
        static name = new Word("maple sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 80.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:maple_tree:item#drop";
        static name = new Word("maple lumber").plural("");

        static yield = new Variable("variance:0", 9000, .1);
        static item = class extends Item {
            static id = "tree:maple_tree:item";
            static name = new Word("maple lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.80, 1e-20);
        };
    };
};
class ElmTree extends Tree {
    static id = "tree:elm_tree";
    static name = new Word("elm tree");

    static level = 3;
    static strength = 6;

    static size = 30;
    static time = new Variable("error:0", Time.month(30), Time.month(1));
    static death = 0.25;

    static seed = class extends Item {
        static id = "tree:elm_tree:seed";
        static name = new Word("elm sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 40.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:elm_tree:item#drop";
        static name = new Word("elm lumber").plural("");

        static yield = new Variable("variance:0", 8000, .1);
        static item = class extends Item {
            static id = "tree:elm_tree:item";
            static name = new Word("elm lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.70, 1e-20);
        };
    };
};
class OakTree extends Tree {
    static id = "tree:oak_tree";
    static name = new Word("oak tree");

    static level = 4;
    static strength = 9;

    static size = 40;
    static time = new Variable("error:0", Time.month(40), Time.month(2));
    static death = 0.06;

    static seed = class extends Item {
        static id = "tree:oak_tree:seed";
        static name = new Word("oak sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 100.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:oak_tree:item#drop";
        static name = new Word("oak lumber").plural("");

        static yield = new Variable("variance:0", 10000, .1);
        static item = class extends Item {
            static id = "tree:oak_tree:item";
            static name = new Word("oak lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 1.10, 1e-20);
        };
    };
};
class CedarTree extends Tree {
    static id = "tree:cedar_tree";
    static name = new Word("cedar tree");

    static level = 4;
    static strength = 7;

    static size = 25;
    static time = new Variable("error:0", Time.month(35), Time.month(1)+Time.week(2));
    static death = 0.12;

    static seed = class extends Item {
        static id = "tree:cedar_tree:seed";
        static name = new Word("cedar sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 60.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:cedar_tree:item#drop";
        static name = new Word("cedar lumber").plural("");

        static yield = new Variable("variance:0", 4500, .1);
        static item = class extends Item {
            static id = "tree:cedar_tree:item";
            static name = new Word("cedar lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 1.20, 1e-20);
        };
    };
};
class RedwoodTree extends Tree {
    static id = "tree:redwood_tree";
    static name = new Word("redwood tree");

    static level = 5;
    static strength = 10;

    static size = 100;
    static time = new Variable("error:0", Time.month(100), Time.month(5));
    static death = 0.02;

    static seed = class extends Item {
        static id = "tree:redwood_tree:seed";
        static name = new Word("redwood sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 350.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:redwood_tree:item#drop";
        static name = new Word("redwood lumber").plural("");

        static yield = new Variable("variance:0", 35000, .1);
        static item = class extends Item {
            static id = "tree:redwood_tree:item";
            static name = new Word("redwood lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 2.50, 1e-20);
        };
    };
};

// workers