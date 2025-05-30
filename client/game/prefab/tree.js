import linker from "../linker.js";
import Time from "../time.js";

import Text from "../../module/text.js";
import Variable from "../../module/variable.js";

import Prefab from "./prefab.js";
import Item from './item.js';
import Drop from './drop.js';

export default class Tree extends Prefab {
    static id = "prefab.tree";

    static level = NaN;
    static strength = NaN;

    static size = NaN;
    static time = NaN;
    static death = NaN;

    static seed = class extends Item {};
    static drop = class extends Drop {};

    static format = {
        ...Prefab.format,
        grown: { required: true, test: v => Number.isInteger(v) && v >= 0 },
    };

    grown = 0; // time when the tree will be fully grown, in ticks
};
linker.link(Tree);

class BuckeyeTree extends Tree {
    static id = "prefab.tree.buckeye";
    static name = new Text("buckeye tree");

    static level = 0;
    static strength = 4;

    static size = 20;
    static time = new Variable("error:0", Time.month(20), Time.week(2));
    static death = 0.15;

    static seed = class extends Item {
        static id = "prefab.tree.buckeye>prefab.item#seed";
        static name = new Text("buckeye sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 25.00, .001);
    };
    static drop = class extends Drop {
        static id = "prefab.tree.buckeye>prefab.drop#drop";
        static name = new Text("buckeye lumber").plural(false);

        static yield = new Variable("variance:0", 3000, .1);
        static item = class extends Item {
            static id = "prefab.tree.buckeye>prefab.drop#drop>prefab.item#item";
            static name = new Text("buckeye lumber").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.55, 1e-20);
        };
    };
};
linker
    .goto(Tree).link(BuckeyeTree)
    .goto(BuckeyeTree).link(BuckeyeTree.seed, BuckeyeTree.drop)
    .goto(BuckeyeTree.drop).link(BuckeyeTree.drop.item);

class BirchTree extends Tree {
    static id = "prefab.tree.birch";
    static name = new Text("birch tree");

    static level = 0;
    static strength = 3;

    static size = 15;
    static time = new Variable("error:0", Time.month(15), Time.week(1));
    static death = 0.22;

    static seed = class extends Item {
        static id = "prefab.tree.birch>prefab.item#seed";
        static name = new Text("birch sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 35.00, .001);
    };
    static drop = class extends Drop {
        static id = "prefab.tree.birch>prefab.drop#drop";
        static name = new Text("birch lumber").plural(false);

        static yield = new Variable("variance:0", 2000, .1);
        static item = class extends Item {
            static id = "prefab.tree.birch>prefab.drop#drop>prefab.item#item";
            static name = new Text("birch lumber").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.60, 1e-20);
        };
    };
};
linker
    .goto(Tree).link(BirchTree)
    .goto(BirchTree).link(BirchTree.seed, BirchTree.drop)
    .goto(BirchTree.drop).link(BirchTree.drop.item);

class CottonwoodTree extends Tree {
    static id = "prefab.tree.cottonwood";
    static name = new Text("cottonwood tree");

    static level = 1;
    static strength = 6;

    static size = 55;
    static time = new Variable("error:0", Time.month(20), Time.week(2));
    static death = 0.15;

    static seed = class extends Item {
        static id = "prefab.tree.cottonwood>prefab.item#seed";
        static name = new Text("cottonwood sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 40.00, .001);
    };
    static drop = class extends Drop {
        static id = "prefab.tree.cottonwood>prefab.drop#drop";
        static name = new Text("cottonwood lumber").plural(false);

        static yield = new Variable("variance:0", 9500, .1);
        static item = class extends Item {
            static id = "prefab.tree.cottonwood>prefab.drop#drop>prefab.item#item";
            static name = new Text("cottonwood lumber").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.55, 1e-20);
        };
    };
};
linker
    .goto(Tree).link(CottonwoodTree)
    .goto(CottonwoodTree).link(CottonwoodTree.seed, CottonwoodTree.drop)
    .goto(CottonwoodTree.drop).link(CottonwoodTree.drop.item);

class PineTree extends Tree {
    static id = "prefab.tree.pine";
    static name = new Text("pine tree");

    static level = 1;
    static strength = 6;

    static size = 30;
    static time = new Variable("error:0", Time.month(20), Time.week(2));
    static death = 0.10;

    static seed = class extends Item {
        static id = "prefab.tree.pine>prefab.item#seed";
        static name = new Text("pine sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 65.00, 0.001);
    };
    static drop = class extends Drop {
        static id = "prefab.tree.pine>prefab.drop#drop";
        static name = new Text("pine lumber").plural(false);

        static yield = new Variable("variance:0", 5500, .1);
        static item = class extends Item {
            static id = "prefab.tree.pine>prefab.drop#drop>prefab.item#item";
            static name = new Text("pine lumber").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.70, 1e-20);
        };
    };
};
linker
    .goto(Tree).link(PineTree)
    .goto(PineTree).link(PineTree.seed, PineTree.drop)
    .goto(PineTree.drop).link(PineTree.drop.item);

class SycamoreTree extends Tree {
    static id = "prefab.tree.sycamore";
    static name = new Text("sycamore tree");

    static level = 2;
    static strength = 7;

    static size = 45;
    static time = new Variable("error:0", Time.month(25), Time.week(3));
    static death = 0.05;

    static seed = class extends Item {
        static id = "prefab.tree.sycamore>prefab.item#seed";
        static name = new Text("sycamore sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 70.00, .001);
    };
    static drop = class extends Drop {
        static id = "prefab.tree.sycamore>prefab.drop#drop";
        static name = new Text("sycamore lumber").plural(false);

        static yield = new Variable("variance:0", 10000, .1);
        static item = class extends Item {
            static id = "prefab.tree.sycamore>prefab.drop#drop>prefab.item#item";
            static name = new Text("sycamore lumber").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.60, 1e-20);
        };
    };
};
linker
    .goto(Tree).link(SycamoreTree)
    .goto(SycamoreTree).link(SycamoreTree.seed, SycamoreTree.drop)
    .goto(SycamoreTree.drop).link(SycamoreTree.drop.item);

class SpruceTree extends Tree {
    static id = "prefab.tree.spruce";
    static name = new Text("spruce tree");

    static level = 2;
    static strength = 5;

    static size = 30;
    static time = new Variable("error:0", Time.month(35), Time.month(1)+Time.week(2));
    static death = 0.15;

    static seed = class extends Item {
        static id = "prefab.tree.spruce>prefab.item#seed";
        static name = new Text("spruce sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 60.00, .001);
    };
    static drop = class extends Drop {
        static id = "prefab.tree.spruce>prefab.drop#drop";
        static name = new Text("spruce lumber").plural(false);

        static yield = new Variable("variance:0", 7500, .1);
        static item = class extends Item {
            static id = "prefab.tree.spruce>prefab.drop#drop>prefab.item#item";
            static name = new Text("spruce lumber").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.70, 1e-20);
        };
    };
};
linker
    .goto(Tree).link(SpruceTree)
    .goto(SpruceTree).link(SpruceTree.seed, SpruceTree.drop)
    .goto(SpruceTree.drop).link(SpruceTree.drop.item);

class MapleTree extends Tree {
    static id = "prefab.tree.maple";
    static name = new Text("maple tree");

    static level = 3;
    static strength = 8;

    static size = 35;
    static time = new Variable("error:0", Time.month(30), Time.week(3));
    static death = 0.09;

    static seed = class extends Item {
        static id = "prefab.tree.maple>prefab.item#seed";
        static name = new Text("maple sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 80.00, .001);
    };
    static drop = class extends Drop {
        static id = "prefab.tree.maple>prefab.drop#drop";
        static name = new Text("maple lumber").plural(false);

        static yield = new Variable("variance:0", 9000, .1);
        static item = class extends Item {
            static id = "prefab.tree.maple>prefab.drop#drop>prefab.item#item";
            static name = new Text("maple lumber").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.80, 1e-20);
        };
    };
};
linker
    .goto(Tree).link(MapleTree)
    .goto(MapleTree).link(MapleTree.seed, MapleTree.drop)
    .goto(MapleTree.drop).link(MapleTree.drop.item);

class ElmTree extends Tree {
    static id = "prefab.tree.elm";
    static name = new Text("elm tree");

    static level = 3;
    static strength = 6;

    static size = 30;
    static time = new Variable("error:0", Time.month(30), Time.month(1));
    static death = 0.25;

    static seed = class extends Item {
        static id = "prefab.tree.elm>prefab.item#seed";
        static name = new Text("elm sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 40.00, .001);
    };
    static drop = class extends Drop {
        static id = "prefab.tree.elm>prefab.drop#drop";
        static name = new Text("elm lumber").plural(false);

        static yield = new Variable("variance:0", 8000, .1);
        static item = class extends Item {
            static id = "prefab.tree.elm>prefab.drop#drop>prefab.item#item";
            static name = new Text("elm lumber").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 0.70, 1e-20);
        };

    };
};
linker
    .goto(Tree).link(ElmTree)
    .goto(ElmTree).link(ElmTree.seed, ElmTree.drop)
    .goto(ElmTree.drop).link(ElmTree.drop.item);

class OakTree extends Tree {
    static id = "prefab.tree.oak";
    static name = new Text("oak tree");

    static level = 4;
    static strength = 9;

    static size = 40;
    static time = new Variable("error:0", Time.month(40), Time.month(2));
    static death = 0.06;

    static seed = class extends Item {
        static id = "prefab.tree.oak>prefab.item#seed";
        static name = new Text("oak sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 100.00, .001);
    };
    static drop = class extends Drop {
        static id = "prefab.tree.oak>prefab.drop#drop";
        static name = new Text("oak lumber").plural(false);

        static yield = new Variable("variance:0", 10000, .1);
        static item = class extends Item {
            static id = "prefab.tree.oak>prefab.drop#drop>prefab.item#item";
            static name = new Text("oak lumber").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 1.10, 1e-20);
        };
    };
};
linker
    .goto(Tree).link(OakTree)
    .goto(OakTree).link(OakTree.seed, OakTree.drop)
    .goto(OakTree.drop).link(OakTree.drop.item);

class CedarTree extends Tree {
    static id = "prefab.tree.cedar";
    static name = new Text("cedar tree");

    static level = 4;
    static strength = 7;

    static size = 25;
    static time = new Variable("error:0", Time.month(35), Time.month(1)+Time.week(2));
    static death = 0.12;

    static seed = class extends Item {
        static id = "prefab.tree.cedar>prefab.item#seed";
        static name = new Text("cedar sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 60.00, .001);
    };
    static drop = class extends Drop {
        static id = "prefab.tree.cedar>prefab.drop#drop";
        static name = new Text("cedar lumber").plural(false);

        static yield = new Variable("variance:0", 4500, .1);
        static item = class extends Item {
            static id = "prefab.tree.cedar>prefab.drop#drop>prefab.item#item";
            static name = new Text("cedar lumber").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 1.20, 1e-20);
        };
    };
};
linker
    .goto(Tree).link(CedarTree)
    .goto(CedarTree).link(CedarTree.seed, CedarTree.drop)
    .goto(CedarTree.drop).link(CedarTree.drop.item);

class RedwoodTree extends Tree {
    static id = "prefab.tree.redwood";
    static name = new Text("redwood tree");

    static level = 5;
    static strength = 10;

    static size = 100;
    static time = new Variable("error:0", Time.month(100), Time.month(5));
    static death = 0.02;

    static seed = class extends Item {
        static id = "prefab.tree.redwood>prefab.item#seed";
        static name = new Text("redwood sapling");

        static buyable = true;
        static buy_price = new Variable("variance:2", 350.00, .001);
    };
    static drop = class extends Drop {
        static id = "prefab.tree.redwood>prefab.drop#drop";
        static name = new Text("redwood lumber").plural(false);

        static yield = new Variable("variance:0", 35000, .1);
        static item = class extends Item {
            static id = "prefab.tree.redwood>prefab.drop#drop>prefab.item#item";
            static name = new Text("redwood lumber").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 2.50, 1e-20);
        };
    };
};
linker
    .goto(Tree).link(RedwoodTree)
    .goto(RedwoodTree).link(RedwoodTree.seed, RedwoodTree.drop)
    .goto(RedwoodTree.drop).link(RedwoodTree.drop.item);

export {
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
};