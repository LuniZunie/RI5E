import linker from "../linker.js";
import Time from "../time.js";

import Text from "../../module/text.js";
import Variable from "../../module/variable.js";

import Prefab from "./prefab.js";
import Item from './item.js';
import Drop from './drop.js';

// TODO: add algae, seaweed, and other water forageables, add cactus

export default class Forageable extends Prefab {
    static id = "prefab.forageable";

    static season = 0;
    static time = NaN;

    static drop = class extends Drop {};

    grown = 0;

    static format = {
        ...Prefab.format,
        grown: { required: true, test: v => Number.isInteger(v) && v >= 0 },
    };

    constructor() {
        super();
        this.grown = Time.now + this.constructor.time.positive;
    }
};
linker.link(Forageable);

class Grass extends Forageable {
    static id = "prefab.forageable.grass_patch";
    static name = new Text("grass patch");
    static description = new Text("Year-round").plural(false);

    static sprite = "/game/assets/forageable/grass.svg";

    static season = Time.Year;
    static time = new Variable("static:0", Time.day(1));

    static drop = class extends Drop {
        static id = "prefab.forageable.grass_patch>prefab.drop#drop";
        static name = new Text("grass").plural(false);

        static yield = new Variable("variance:0", 5, .05);
        static item = class extends Item {
            static id = "prefab.forageable.grass_patch>prefab.drop#drop>prefab.item#item";
            static name = new Text("grass").plural(false);

            static sellable = true;
            static sell_price = new Variable("range:2", 0.01, .001);
        };
    };
};
linker
    .goto(Forageable).link(Grass)
    .goto(Grass).link(Grass.drop)
    .goto(Grass.drop).link(Grass.drop.item);

class Clover extends Forageable {
    static id = "prefab.forageable.clover_patch";
    static name = new Text("clover patch");
    static description = new Text("Year-round").plural(false);

    static sprite = "/game/assets/forageable/clover.svg";

    static season = Time.Year;
    static time = new Variable("error:0", Time.day(2), Time.day(1));

    static drop = class extends Drop {
        static id = "prefab.forageable.clover_patch>prefab.drop#drop";
        static name = new Text("clover");

        static yield = new Variable("variance:0", 5, .05);
        static item = class extends Item {
            static id = "prefab.forageable.clover_patch>prefab.drop#drop>prefab.item#item";
            static name = new Text("clover");

            static sellable = true;
            static sell_price = new Variable("variance:2", 1, .0015);
        };
    }
};
linker
    .goto(Forageable).link(Clover)
    .goto(Clover).link(Clover.drop)
    .goto(Clover.drop).link(Clover.drop.item);

class Dandelion extends Forageable {
    static id = "prefab.forageable.dandelion";
    static name = new Text("dandelion");
    static description = new Text("Spring").plural(false);

    static sprite = "/game/assets/forageable/dandelion.svg";

    static season = Time.Season.Spring;
    static time = new Variable("error:0", Time.day(3), Time.day(1));

    static drop = class extends Drop {
        static id = "prefab.forageable.dandelion>prefab.drop#drop";
        static name = new Text("dandelion");

        static yield = new Variable("static:0", 1);
        static item = class extends Item {
            static id = "prefab.forageable.dandelion>prefab.drop#drop>prefab.item#item";
            static name = new Text("dandelion");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.15, .001);
        };
    };
};
linker
    .goto(Forageable).link(Dandelion)
    .goto(Dandelion).link(Dandelion.drop)
    .goto(Dandelion.drop).link(Dandelion.drop.item);

class Mushroom extends Forageable {
    static id = "prefab.forageable.mushroom";
    static name = new Text("mushroom");
    static description = new Text("Year-round").plural(false);

    static sprite = "/game/assets/forageable/mushroom.svg";

    static season = Time.Year;
    static time = new Variable("error:0", Time.day(3), Time.day(1));

    static drop = class extends Drop {
        static id = "prefab.forageable.mushroom>prefab.drop#drop";
        static name = new Text("mushroom");

        static yield = new Variable("range:0", 1, 5);
        static item = class extends Item {
            static id = "prefab.forageable.mushroom>prefab.drop#drop>prefab.item#item";
            static name = new Text("mushroom");

            static sellable = true;
            static sell_price = new Variable("variance:2", 5.00, .025);
        };
    };
};
linker
    .goto(Forageable).link(Mushroom)
    .goto(Mushroom).link(Mushroom.drop)
    .goto(Mushroom.drop).link(Mushroom.drop.item);

class Blackberry extends Forageable {
    static id = "prefab.forageable.blackberry_cane";
    static name = new Text("blackberry cane");
    static description = new Text("Summer").plural(false);

    static sprite = "/game/assets/forageable/blackberry.svg";

    static season = Time.Season.Summer;
    static time = new Variable("error:0", Time.day(5), Time.day(2));

    static drop = class extends Drop {
        static id = "prefab.forageable.blackberry_cane>prefab.drop#drop";
        static name = new Text("blackberry");

        static yield = new Variable("error:0", 4, 2);
        static item = class extends Item {
            static id = "prefab.forageable.blackberry_cane>prefab.drop#drop>prefab.item#item";
            static name = new Text("blackberry");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.50, .01);
        };
    };
};
linker
    .goto(Forageable).link(Blackberry)
    .goto(Blackberry).link(Blackberry.drop)
    .goto(Blackberry.drop).link(Blackberry.drop.item);

class Raspberry extends Forageable {
    static id = "prefab.forageable.raspberry_cane";
    static name = new Text("raspberry cane");
    static description = new Text("Summer").plural(false);

    static sprite = "/game/assets/forageable/raspberry.svg";

    static season = Time.Season.Summer;
    static time = new Variable("error:0", Time.day(5), Time.day(2));

    static drop = class extends Drop {
        static id = "prefab.forageable.raspberry_cane>prefab.drop#drop";
        static name = new Text("raspberry");

        static yield = new Variable("error:0", 3, 2);
        static item = class extends Item {
            static id = "prefab.forageable.raspberry_cane>prefab.drop#drop>prefab.item#item";
            static name = new Text("raspberry");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.60, .01);
        };
    };
};
linker
    .goto(Forageable).link(Raspberry)
    .goto(Raspberry).link(Raspberry.drop)
    .goto(Raspberry.drop).link(Raspberry.drop.item);

class Blueberry extends Forageable {
    static id = "prefab.forageable.blueberry_bush";
    static name = new Text("blueberry bush");
    static description = new Text("Summer").plural(false);

    static sprite = "/game/assets/forageable/blueberry.svg";

    static season = Time.Season.Summer;
    static time = new Variable("error:0", Time.week(2), Time.day(5));

    static drop = class extends Drop {
        static id = "prefab.forageable.blueberry_bush>prefab.drop#drop";
        static name = new Text("blueberry");

        static yield = new Variable("error:0", 10, 5);
        static item = class extends Item {
            static id = "prefab.forageable.blueberry_bush>prefab.drop#drop>prefab.item#item";
            static name = new Text("blueberry");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.75, .0065);
        };
    };
};
linker
    .goto(Forageable).link(Blueberry)
    .goto(Blueberry).link(Blueberry.drop)
    .goto(Blueberry.drop).link(Blueberry.drop.item);

class Grape extends Forageable {
    static id = "prefab.forageable.grape_vine";
    static name = new Text("grape vine");
    static description = new Text("Autumn").plural(false);

    static sprite = "/game/assets/forageable/grape.svg";

    static season = Time.Season.Autumn;
    static time = new Variable("error:0", Time.week(2), Time.day(5));

    static drop = class extends Drop {
        static id = "prefab.forageable.grape_vine>prefab.drop#drop";
        static name = new Text("grape");

        static yield = new Variable("error:0", 5, 3);
        static item = class extends Item {
            static id = "prefab.forageable.grape_vine>prefab.drop#drop>prefab.item#item";
            static name = new Text("grape");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.80, .0065);
        }
    };
};
linker
    .goto(Forageable).link(Grape)
    .goto(Grape).link(Grape.drop)
    .goto(Grape.drop).link(Grape.drop.item);

class Strawberry extends Forageable {
    static id = "prefab.forageable.strawberry_bush";
    static name = new Text("strawberry bush");
    static description = new Text("Spring").plural(false);

    static sprite = "/game/assets/forageable/strawberry.svg";

    static season = Time.Season.Spring;
    static time = new Variable("error:0", Time.week(1), Time.day(3));

    static drop = class extends Drop {
        static id = "prefab.forageable.strawberry_bush>prefab.drop#drop";
        static name = new Text("strawberry");

        static yield = new Variable("error:0", 5, 3);
        static item = class extends Item {
            static id = "prefab.forageable.strawberry_bush>prefab.drop#drop>prefab.item#item";
            static name = new Text("strawberry");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.90, .025);
        };
    };
};
linker
    .goto(Forageable).link(Strawberry)
    .goto(Strawberry).link(Strawberry.drop)
    .goto(Strawberry.drop).link(Strawberry.drop.item);

class Banana extends Forageable {
    static id = "prefab.forageable.banana_tree";
    static name = new Text("banana tree");
    static description = new Text("Summer").plural(false);

    static sprite = "/game/assets/forageable/banana.svg";

    static season = Time.Season.Summer;
    static time = new Variable("error:0", Time.week(2), Time.day(3));

    static drop = class extends Drop {
        static id = "prefab.forageable.banana_tree>prefab.drop#drop";
        static name = new Text("banana");

        static yield = new Variable("error:0", 5, 2);
        static item = class extends Item {
            static id = "prefab.forageable.banana_tree>prefab.drop#drop>prefab.item#item";
            static name = new Text("banana");

            static sellable = true;
            static sell_price = new Variable("variance:2", 1.00, .01);
        };
    };
};
linker
    .goto(Forageable).link(Banana)
    .goto(Banana).link(Banana.drop)
    .goto(Banana.drop).link(Banana.drop.item);

class Apple extends Forageable {
    static id = "prefab.forageable.apple_tree";
    static name = new Text("apple tree");
    static description = new Text("Autumn").plural(false);

    static sprite = "/game/assets/forageable/apple.svg";

    static season = Time.Season.Autumn;
    static time = new Variable("error:0", Time.week(2), Time.day(3));

    static drop = class extends Drop {
        static id = "prefab.forageable.apple_tree>prefab.drop#drop";
        static name = new Text("apple");

        static yield = new Variable("variance:0", 30, .025);
        static item = class extends Item {
            static id = "prefab.forageable.apple_tree>prefab.drop#drop>prefab.item#item";
            static name = new Text("apple");

            static sellable = true;
            static sell_price = new Variable("variance:2", 1.50, .01);
        };
    };
};
linker
    .goto(Forageable).link(Apple)
    .goto(Apple).link(Apple.drop)
    .goto(Apple.drop).link(Apple.drop.item);

class Orange extends Forageable {
    static id = "prefab.forageable.orange_tree";
    static name = new Text("orange tree");
    static description = new Text("Spring & Summer").plural(false);

    static sprite = "/game/assets/forageable/orange.svg";

    static season = Time.Season.Spring & Time.Season.Summer;
    static time = new Variable("error:0", Time.week(2), Time.day(2));

    static drop = class extends Drop {
        static id = "prefab.forageable.orange_tree>prefab.drop#drop";
        static name = new Text("orange");

        static yield = new Variable("variance:0", 20, .03);
        static item = class extends Item {
            static id = "prefab.forageable.orange_tree>prefab.drop#drop>prefab.item#item";
            static name = new Text("orange");

            static sellable = true;
            static sell_price = new Variable("variance:2", 1.75, .01);
        };
    };
};
linker
    .goto(Forageable).link(Orange)
    .goto(Orange).link(Orange.drop)
    .goto(Orange.drop).link(Orange.drop.item);

class Peach extends Forageable {
    static id = "prefab.forageable.peach_tree";
    static name = new Text("peach tree");
    static description = new Text("Summer").plural(false);

    static sprite = "/game/assets/forageable/peach.svg";

    static season = Time.Season.Summer;
    static time = new Variable("error:0", Time.week(2), Time.day(2));

    static drop = class extends Drop {
        static id = "prefab.forageable.peach_tree>prefab.drop#drop";
        static name = new Text("peach");

        static yield = new Variable("variance:0", 25, .0275);
        static item = class extends Item {
            static id = "prefab.forageable.peach_tree>prefab.drop#drop>prefab.item#item";
            static name = new Text("peach");

            static sellable = true;
            static sell_price = new Variable("variance:2", 2, .0075);
        };
    };
};
linker
    .goto(Forageable).link(Peach)
    .goto(Peach).link(Peach.drop)
    .goto(Peach.drop).link(Peach.drop.item);

class Lemon extends Forageable {
    static id = "prefab.forageable.lemon_tree";
    static name = new Text("lemon tree");
    static description = new Text("Year-round").plural(false);

    static sprite = "/game/assets/forageable/lemon.svg";

    static season = Time.Year;
    static time = new Variable("error:0", Time.week(3), Time.day(5));

    static drop = class extends Drop {
        static id = "prefab.forageable.lemon_tree>prefab.drop#drop";
        static name = new Text("lemon");

        static yield = new Variable("variance:0", 15, .0275);
        static item = class extends Item {
            static id = "prefab.forageable.lemon_tree>prefab.drop#drop>prefab.item#item";
            static name = new Text("lemon");

            static sellable = true;
            static sell_price = new Variable("variance:2", 2.25, .005);
        };
    };
};
linker
    .goto(Forageable).link(Lemon)
    .goto(Lemon).link(Lemon.drop)
    .goto(Lemon.drop).link(Lemon.drop.item);

class Lime extends Forageable {
    static id = "prefab.forageable.lime_tree";
    static name = new Text("lime");
    static description = new Text("Summer & Autumn").plural(false);

    static sprite = "/game/assets/forageable/lime.svg";

    static season = Time.Season.Summer & Time.Season.Autumn;
    static time = new Variable("error:0", Time.week(3), Time.week(1));

    static drop = class extends Drop {
        static id = "prefab.forageable.lime_tree>prefab.drop#drop";
        static name = new Text("lime");

        static yield = new Variable("variance:0", 15, .0275);
        static item = class extends Item {
            static id = "prefab.forageable.lime_tree>prefab.drop#drop>prefab.item#item";
            static name = new Text("lime");

            static sellable = true;
            static sell_price = new Variable("variance:2", 2.5, .005);
        };
    };
};
linker
    .goto(Forageable).link(Lime)
    .goto(Lime).link(Lime.drop)
    .goto(Lime.drop).link(Lime.drop.item);

class Cherry extends Forageable {
    static id = "prefab.forageable.cherry_tree";
    static name = new Text("cherry tree");
    static description = new Text("Spring").plural(false);

    static sprite = "/game/assets/forageable/cherry.svg";

    static season = Time.Season.Spring;
    static time = new Variable("error:0", Time.week(2), Time.day(3));

    static drop = class extends Drop {
        static id = "prefab.forageable.cherry_tree>prefab.drop#drop";
        static name = new Text("cherry");

        static yield = new Variable("variance:0", 25, .025);
        static item = class extends Item {
            static id = "prefab.forageable.cherry_tree>prefab.drop#drop>prefab.item#item";
            static name = new Text("cherry");

            static sellable = true;
            static sell_price = new Variable("variance:2", 4.00, .1);
        };
    };
};
linker
    .goto(Forageable).link(Cherry)
    .goto(Cherry).link(Cherry.drop)
    .goto(Cherry.drop).link(Cherry.drop.item);

class Pineapple extends Forageable {
    static id = "prefab.forageable.pineapple_plant";
    static name = new Text("pineapple plant");
    static description = new Text("Spring & Summer").plural(false);

    static sprite = "/game/assets/forageable/pineapple.svg";

    static season = Time.Season.Spring & Time.Season.Summer;
    static time = new Variable("error:0", Time.month(1), Time.day(4));

    static drop = class extends Drop {
        static id = "prefab.forageable.pineapple_plant>prefab.drop#drop";
        static name = new Text("pineapple");

        static yield = new Variable("static:0", 1);
        static item = class extends Item {
            static id = "prefab.forageable.pineapple_plant>prefab.drop#drop>prefab.item#item";
            static name = new Text("pineapple");

            static sellable = true;
            static sell_price = new Variable("variance:2", 10.00, .05);
        };
    };
};
linker
    .goto(Forageable).link(Pineapple)
    .goto(Pineapple).link(Pineapple.drop)
    .goto(Pineapple.drop).link(Pineapple.drop.item);

class Coconut extends Forageable {
    static id = "prefab.forageable.coconut_tree";
    static name = new Text("coconut tree");
    static description = new Text("Year-round").plural(false);

    static sprite = "/game/assets/forageable/coconut.svg";

    static season = Time.Year;
    static time = new Variable("error:0", Time.month(2), Time.week(2));

    static drop = class extends Drop {
        static id = "prefab.forageable.coconut_tree>prefab.drop#drop";
        static name = new Text("coconut");

        static yield = new Variable("error:0", 7, 3);
        static item = class extends Item {
            static id = "prefab.forageable.coconut_tree>prefab.drop#drop>prefab.item#item";
            static name = new Text("coconut");

            static sellable = true;
            static sell_price = new Variable("variance:2", 20.00, .075);
        };
    };
};
linker
    .goto(Forageable).link(Coconut)
    .goto(Coconut).link(Coconut.drop)
    .goto(Coconut.drop).link(Coconut.drop.item);

export {
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
};