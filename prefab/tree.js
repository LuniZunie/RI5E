import linker from "./linker.js";
import Prefab from "./prefab.js";
import Item from '../item.js';
import Drop from '../drop.js';
import Text from "../module/text.js";
import Variable from "../module/variable.js";
import Time from "../game/time.js";

export default class Tree extends Prefab {
    static level = NaN;
    static strength = NaN;

    static size = NaN;
    static time = NaN;
    static death = NaN;

    static seed = class extends Item {};
    static drop = class extends Drop {};
};
linker.link(Tree);

class BuckeyeTree extends Tree {
    static id = "tree:buckeye_tree";
    static name = new Text("buckeye tree");

    static level = 0;
    static strength = 4;

    static size = 20;
    static time = new Variable("error:0", Time.month(20), Time.week(2));
    static death = 0.15;

    static seed = class extends Item {
        static id = "tree:buckeye_tree:seed";
        static name = new Text("buckeye sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 25.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:buckeye_tree:item#drop";
        static name = new Text("buckeye lumber").plural("");

        static yield = new Variable("variance:0", 3000, .1);
        static item = class extends Item {
            static id = "tree:buckeye_tree:item";
            static name = new Text("buckeye lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.55, 1e-20);
        };
    };
};
class BirchTree extends Tree {
    static id = "tree:birch_tree";
    static name = new Text("birch tree");

    static level = 0;
    static strength = 3;

    static size = 15;
    static time = new Variable("error:0", Time.month(15), Time.week(1));
    static death = 0.22;

    static seed = class extends Item {
        static id = "tree:birch_tree:seed";
        static name = new Text("birch sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 35.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:birch_tree:item#drop";
        static name = new Text("birch lumber").plural("");

        static yield = new Variable("variance:0", 2000, .1);
        static item = class extends Item {
            static id = "tree:birch_tree:item";
            static name = new Text("birch lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.60, 1e-20);
        };
    };
};
class CottonwoodTree extends Tree {
    static id = "tree:cottonwood_tree";
    static name = new Text("cottonwood tree");

    static level = 1;
    static strength = 6;

    static size = 55;
    static time = new Variable("error:0", Time.month(20), Time.week(2));
    static death = 0.15;

    static seed = class extends Item {
        static id = "tree:cottonwood_tree:seed";
        static name = new Text("cottonwood sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 40.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:cottonwood_tree:item#drop";
        static name = new Text("cottonwood lumber").plural("");

        static yield = new Variable("variance:0", 9500, .1);
        static item = class extends Item {
            static id = "tree:cottonwood_tree:item";
            static name = new Text("cottonwood lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.55, 1e-20);
        };
    };
};
class PineTree extends Tree {
    static id = "tree:pine_tree";
    static name = new Text("pine tree");

    static level = 1;
    static strength = 6;

    static size = 30;
    static time = new Variable("error:0", Time.month(20), Time.week(2));
    static death = 0.10;

    static seed = class extends Item {
        static id = "tree:pine_tree:seed";
        static name = new Text("pine sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 65.00, 0.001);
    };
    static drop = class extends Drop {
        static id = "tree:pine_tree:item#drop";
        static name = new Text("pine lumber").plural("");

        static yield = new Variable("variance:0", 5500, .1);
        static item = class extends Item {
            static id = "tree:pine_tree:item";
            static name = new Text("pine lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.70, 1e-20);
        };
    };
};
class SycamoreTree extends Tree {
    static id = "tree:sycamore_tree";
    static name = new Text("sycamore tree");

    static level = 2;
    static strength = 7;

    static size = 45;
    static time = new Variable("error:0", Time.month(25), Time.week(3));
    static death = 0.05;

    static seed = class extends Item {
        static id = "tree:sycamore_tree:seed";
        static name = new Text("sycamore sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 70.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:sycamore_tree:item#drop";
        static name = new Text("sycamore lumber").plural("");

        static yield = new Variable("variance:0", 10000, .1);
        static item = class extends Item {
            static id = "tree:sycamore_tree:item";
            static name = new Text("sycamore lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.60, 1e-20);
        };
    };
};
class SpruceTree extends Tree {
    static id = "tree:spruce_tree";
    static name = new Text("spruce tree");

    static level = 2;
    static strength = 5;

    static size = 30;
    static time = new Variable("error:0", Time.month(35), Time.month(1)+Time.week(2));
    static death = 0.15;

    static seed = class extends Item {
        static id = "tree:spruce_tree:seed";
        static name = new Text("spruce sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 60.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:spruce_tree:item#drop";
        static name = new Text("spruce lumber").plural("");

        static yield = new Variable("variance:0", 7500, .1);
        static item = class extends Item {
            static id = "tree:spruce_tree:item";
            static name = new Text("spruce lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.70, 1e-20);
        };
    };
};
class MapleTree extends Tree {
    static id = "tree:maple_tree";
    static name = new Text("maple tree");

    static level = 3;
    static strength = 8;

    static size = 35;
    static time = new Variable("error:0", Time.month(30), Time.week(3));
    static death = 0.09;

    static seed = class extends Item {
        static id = "tree:maple_tree:seed";
        static name = new Text("maple sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 80.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:maple_tree:item#drop";
        static name = new Text("maple lumber").plural("");

        static yield = new Variable("variance:0", 9000, .1);
        static item = class extends Item {
            static id = "tree:maple_tree:item";
            static name = new Text("maple lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.80, 1e-20);
        };
    };
};
class ElmTree extends Tree {
    static id = "tree:elm_tree";
    static name = new Text("elm tree");

    static level = 3;
    static strength = 6;

    static size = 30;
    static time = new Variable("error:0", Time.month(30), Time.month(1));
    static death = 0.25;

    static seed = class extends Item {
        static id = "tree:elm_tree:seed";
        static name = new Text("elm sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 40.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:elm_tree:item#drop";
        static name = new Text("elm lumber").plural("");

        static yield = new Variable("variance:0", 8000, .1);
        static item = class extends Item {
            static id = "tree:elm_tree:item";
            static name = new Text("elm lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.70, 1e-20);
        };
    };
};
class OakTree extends Tree {
    static id = "tree:oak_tree";
    static name = new Text("oak tree");

    static level = 4;
    static strength = 9;

    static size = 40;
    static time = new Variable("error:0", Time.month(40), Time.month(2));
    static death = 0.06;

    static seed = class extends Item {
        static id = "tree:oak_tree:seed";
        static name = new Text("oak sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 100.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:oak_tree:item#drop";
        static name = new Text("oak lumber").plural("");

        static yield = new Variable("variance:0", 10000, .1);
        static item = class extends Item {
            static id = "tree:oak_tree:item";
            static name = new Text("oak lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 1.10, 1e-20);
        };
    };
};
class CedarTree extends Tree {
    static id = "tree:cedar_tree";
    static name = new Text("cedar tree");

    static level = 4;
    static strength = 7;

    static size = 25;
    static time = new Variable("error:0", Time.month(35), Time.month(1)+Time.week(2));
    static death = 0.12;

    static seed = class extends Item {
        static id = "tree:cedar_tree:seed";
        static name = new Text("cedar sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 60.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:cedar_tree:item#drop";
        static name = new Text("cedar lumber").plural("");

        static yield = new Variable("variance:0", 4500, .1);
        static item = class extends Item {
            static id = "tree:cedar_tree:item";
            static name = new Text("cedar lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 1.20, 1e-20);
        };
    };
};
class RedwoodTree extends Tree {
    static id = "tree:redwood_tree";
    static name = new Text("redwood tree");

    static level = 5;
    static strength = 10;

    static size = 100;
    static time = new Variable("error:0", Time.month(100), Time.month(5));
    static death = 0.02;

    static seed = class extends Item {
        static id = "tree:redwood_tree:seed";
        static name = new Text("redwood sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 350.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:redwood_tree:item#drop";
        static name = new Text("redwood lumber").plural("");

        static yield = new Variable("variance:0", 35000, .1);
        static item = class extends Item {
            static id = "tree:redwood_tree:item";
            static name = new Text("redwood lumber").plural("");

            static sellable = true;
            static sell_price = new Variable("variance:2", 2.50, 1e-20);
        };
    };
};

export { BuckeyeTree, BirchTree, CottonwoodTree, PineTree, SycamoreTree, SpruceTree, MapleTree, ElmTree, OakTree, CedarTree, RedwoodTree };
linker.go(Tree).link(
    BuckeyeTree,
    BirchTree,
    CottonwoodTree,
    PineTree,
    SycamoreTree,
    SpruceTree,
    MapleTree,
    ElmTree,
    OakTree,
    CedarTree,
    RedwoodTree
);