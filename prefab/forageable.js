import linker from "./linker.js";
import Item from "./item.js";
import Drop from "./drop.js";
import Text from "../module/text.js";
import Variable from "../module/variable.js";
import Time from "../game/time.js";

export default class Forageable extends Item {
    static season = 0;
    static time = NaN;

    static drop = class extends Drop {};
};
linker.go(Item).link(Forageable);

class Grass extends Forageable {
    static id = "forageable:grass_patch";
    static name = new Text("grass patch");

    static season = Time.Year;
    static time = new Variable("static:0", Time.day(1));

    static drop = class extends Drop {
        static id = "forageable:grass_patch:item#drop";
        static name = new Text("grass").plural("");

        static yield = new Variable("variance:0", 5, .05);
        static item = class extends Item {
            static id = "forageable:grass_patch:item";
            static name = new Text("grass").plural("");

            static sellable = true;
            static sell_price = new Variable("range:2", 0.01, .001);
        };
    };
};
class Clover extends Forageable {
    static id = "forageable:clover_patch";
    static name = new Text("clover patch");

    static season = Time.Year;
    static time = new Variable("error:0", Time.day(2), Time.day(1));

    static drop = class extends Drop {
        static id = "forageable:clover_patch:item#drop";
        static name = new Text("clover");

        static yield = new Variable("variance:0", 5, .05);
        static item = class extends Item {
            static id = "forageable:clover_patch:item";
            static name = new Text("clover");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.02, .0025);
        };
    }
};
class Dandelion extends Forageable {
    static id = "forageable:dandelion";
    static name = new Text("dandelion");

    static season = Time.Season.Spring;
    static time = new Variable("error:0", Time.day(3), Time.day(1));

    static drop = class extends Drop {
        static id = "forageable:dandelion:item#drop";
        static name = new Text("dandelion");

        static yield = new Variable("static:0", 1);
        static item = class extends Item {
            static id = "forageable:dandelion:item";
            static name = new Text("dandelion");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.15, .001);
        };
    };
};
class Mushroom extends Forageable {
    static id = "forageable:mushroom";
    static name = new Text("mushroom");

    static season = Time.Year;
    static time = new Variable("error:0", Time.day(3), Time.day(1));

    static drop = class extends Drop {
        static id = "forageable:mushroom:item#drop";
        static name = new Text("mushroom");

        static yield = new Variable("range:0", 1, 5);
        static item = class extends Item {
            static id = "forageable:mushroom:item";
            static name = new Text("mushroom");

            static sellable = true;
            static sell_price = new Variable("variance:2", 5.00, .025);
        };
    };
};
class Blackberry extends Forageable {
    static id = "forageable:blackberry_cane";
    static name = new Text("blackberry cane");

    static season = Time.Season.Summer;
    static time = new Variable("error:0", Time.day(5), Time.day(2));

    static drop = class extends Drop {
        static id = "forageable:blackberry_cane:item#drop";
        static name = new Text("blackberry");

        static yield = new Variable("error:0", 4, 2);
        static item = class extends Item {
            static id = "forageable:blackberry_cane:item";
            static name = new Text("blackberry");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.50, .01);
        };
    };
};
class Raspberry extends Forageable {
    static id = "forageable:raspberry_cane";
    static name = new Text("raspberry cane");

    static season = Time.Season.Summer;
    static time = new Variable("error:0", Time.day(5), Time.day(2));

    static drop = class extends Drop {
        static id = "forageable:raspberry_cane:item#drop";
        static name = new Text("raspberry");

        static yield = new Variable("error:0", 3, 2);
        static item = class extends Item {
            static id = "forageable:raspberry_cane:item";
            static name = new Text("raspberry");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.60, .01);
        };
    };
};
class Blueberry extends Forageable {
    static id = "forageable:blueberry_bush";
    static name = new Text("blueberry bush");

    static season = Time.Season.Summer;
    static time = new Variable("error:0", Time.week(2), Time.day(5));

    static drop = class extends Drop {
        static id = "forageable:blueberry_bush:item#drop";
        static name = new Text("blueberry");

        static yield = new Variable("error:0", 10, 5);
        static item = class extends Item {
            static id = "forageable:blueberry_bush:item";
            static name = new Text("blueberry");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.75, .0065);
        };
    };
};
class Grape extends Forageable {
    static id = "forageable:grape_vine";
    static name = new Text("grape vine");

    static season = Time.Season.Autumn;
    static time = new Variable("error:0", Time.week(2), Time.day(5));

    static drop = class extends Drop {
        static id = "forageable:grape_vine:item#drop";
        static name = new Text("grape");

        static yield = new Variable("error:0", 5, 3);
        static item = class extends Item {
            static id = "forageable:grape_vine:item";
            static name = new Text("grape");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.80, .0065);
        }
    };
};
class Strawberry extends Forageable {
    static id = "forageable:strawberry_bush";
    static name = new Text("strawberry bush");

    static season = Time.Season.Spring;
    static time = new Variable("error:0", Time.week(1), Time.day(3));

    static drop = class extends Drop {
        static id = "forageable:strawberry_bush:item#drop";
        static name = new Text("strawberry");

        static yield = new Variable("error:0", 2, 1);
        static item = class extends Item {
            static id = "forageable:strawberry_bush:item";
            static name = new Text("strawberry");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.90, .025);
        };
    };
};
class Banana extends Forageable {
    static id = "forageable:banana_tree";
    static name = new Text("banana tree");

    static season = Time.Season.Summer;
    static time = new Variable("error:0", Time.week(2), Time.day(3));

    static drop = class extends Drop {
        static id = "forageable:banana_tree:item#drop";
        static name = new Text("banana");

        static yield = new Variable("error:0", 5, 2);
        static item = class extends Item {
            static id = "forageable:banana_tree:item";
            static name = new Text("banana");

            static sellable = true;
            static sell_price = new Variable("variance:2", 1.00, .01);
        };
    };
};
class Apple extends Forageable {
    static id = "forageable:apple_tree";
    static name = new Text("apple tree");

    static season = Time.Season.Autumn;
    static time = new Variable("error:0", Time.week(2), Time.day(3));

    static drop = class extends Drop {
        static id = "forageable:apple_tree:item#drop";
        static name = new Text("apple");

        static yield = new Variable("variance:0", 30, .025);
        static item = class extends Item {
            static id = "forageable:apple_tree:item";
            static name = new Text("apple");

            static sellable = true;
            static sell_price = new Variable("variance:2", 1.50, .01);
        };
    };
};
class Orange extends Forageable {
    static id = "forageable:orange_tree";
    static name = new Text("orange tree");

    static season = Time.Season.Spring & Time.Season.Summer;
    static time = new Variable("error:0", Time.week(2), Time.day(2));

    static drop = class extends Drop {
        static id = "forageable:orange_tree:item#drop";
        static name = new Text("orange");

        static yield = new Variable("variance:0", 20, .03);
        static item = class extends Item {
            static id = "forageable:orange_tree:item";
            static name = new Text("orange");

            static sellable = true;
            static sell_price = new Variable("variance:2", 1.75, .01);
        };
    };
};
class Peach extends Forageable {
    static id = "forageable:peach_tree";
    static name = new Text("peach tree");

    static season = Time.Season.Summer;
    static time = new Variable("error:0", Time.week(2), Time.day(2));

    static drop = class extends Drop {
        static id = "forageable:peach_tree:item#drop";
        static name = new Text("peach");

        static yield = new Variable("variance:0", 25, .0275);
        static item = class extends Item {
            static id = "forageable:peach_tree:item";
            static name = new Text("peach");

            static sellable = true;
            static sell_price = new Variable("variance:2", 2, .0075);
        };
    };
};
class Lemon extends Forageable {
    static id = "forageable:lemon_tree";
    static name = new Text("lemon tree");

    static season = Time.Year;
    static time = new Variable("error:0", Time.week(3), Time.day(5));

    static drop = class extends Drop {
        static id = "forageable:lemon_tree:item#drop";
        static name = new Text("lemon");

        static yield = new Variable("variance:0", 15, .0275);
        static item = class extends Item {
            static id = "forageable:lemon_tree:item";
            static name = new Text("lemon");

            static sellable = true;
            static sell_price = new Variable("variance:2", 2.25, .005);
        };
    };
};
class Lime extends Forageable {
    static id = "forageable:lime_tree";
    static name = new Text("lime");

    static season = Time.Season.Summer & Time.Season.Autumn;
    static time = new Variable("error:0", Time.week(3), Time.week(1));

    static drop = class extends Drop {
        static id = "forageable:lime_tree:item#drop";
        static name = new Text("lime");

        static yield = new Variable("variance:0", 15, .0275);
        static item = class extends Item {
            static id = "forageable:lime_tree:item";
            static name = new Text("lime");

            static sellable = true;
            static sell_price = new Variable("variance:2", 2.5, .005);
        };
    };
};
class Cherry extends Forageable {
    static id = "forageable:cherry_tree";
    static name = new Text("cherry tree");

    static season = Time.Season.Spring;
    static time = new Variable("error:0", Time.week(2), Time.day(3));

    static drop = class extends Drop {
        static id = "forageable:cherry_tree:item#drop";
        static name = new Text("cherry");

        static yield = new Variable("variance:0", 25, .025);
        static item = class extends Item {
            static id = "forageable:cherry_tree:item";
            static name = new Text("cherry");

            static sellable = true;
            static sell_price = new Variable("variance:2", 4.00, .1);
        };
    };
};
class Pineapple extends Forageable {
    static id = "forageable:pineapple_plant";
    static name = new Text("pineapple plant");

    static season = Time.Season.Spring & Time.Season.Summer;
    static time = new Variable("error:0", Time.month(1), Time.day(4));

    static drop = class extends Drop {
        static id = "forageable:pineapple_plant:item#drop";
        static name = new Text("pineapple");

        static yield = new Variable("static:0", 1);
        static item = class extends Item {
            static id = "forageable:pineapple_plant:item";
            static name = new Text("pineapple");

            static sellable = true;
            static sell_price = new Variable("variance:2", 10.00, .05);
        };
    };
};
class Coconut extends Forageable {
    static id = "forageable:coconut_tree";
    static name = new Text("coconut tree");

    static season = Time.Year;
    static time = new Variable("error:0", Time.month(2), Time.week(2));

    static drop = class extends Drop {
        static id = "forageable:coconut_tree:item#drop";
        static name = new Text("coconut");

        static yield = new Variable("error:0", 7, 3);
        static item = class extends Item {
            static id = "forageable:coconut_tree:item";
            static name = new Text("coconut");

            static sellable = true;
            static sell_price = new Variable("variance:2", 20.00, .075);
        };
    };
};

export { Grass, Clover, Dandelion, Mushroom, Blackberry, Raspberry, Blueberry, Grape, Strawberry, Banana, Apple, Orange, Peach, Lemon, Lime, Cherry, Pineapple, Coconut };
linker.go(Item).go(Forageable).link(
    Grass,
    Clover,
    Dandelion,
    Mushroom,
    Blackberry,
    Raspberry,
    Blueberry,
    Grape,
    Strawberry,
    Banana,
    Apple,
    Orange,
    Peach,
    Lemon,
    Lime,
    Cherry,
    Pineapple,
    Coconut
);