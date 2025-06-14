import linker from "../linker.js";

import Text from "../../module/text.js";
import Variable from "../../module/variable.js";

import Prefab from "./prefab.js";
import Fish, {
    MangroveSnapper,
    Mudskipper,
    Flounder,
    Grouper,
    SeaBass,
    Barramundi,
    Tarpon,
    Barracuda,
    Mackerel,
    Tuna,
    Cod,
    Halibut,
    Seahorse,
    Eel,
    Pufferfish,
    Sardine,
    RedDrum,
    Shark,
    Lionfish,
    Goby
} from "./fish.js";

export default class Bait extends Prefab {
    static id = "prefab.bait";

    static power = new Map();
};
linker.link(Bait);

class FlyBait extends Bait {
    static id = "prefab.bait.fly";
    static name = new Text("Fly bait");
    static description = new Text("A dead fly used for fishing.").plural(false);

    static power = new Map([
        [ MangroveSnapper, 0.80 ], [ Mudskipper, 1.50 ], [ Flounder, 0.50 ], [ Grouper, 0.00 ],
        [ SeaBass, 0.60 ], [ Barramundi, 0.30 ], [ Tarpon, 0.50 ], [ Barracuda, 0.00 ],
        [ Mackerel, 0.40 ], [ Tuna, 0.00 ], [ Cod, 0.40 ], [ Halibut, 0.20 ],
        [ Seahorse, 1.00 ], [ Eel, 0.00 ], [ Pufferfish, 0.70 ], [ Sardine, 1.60 ],
        [ RedDrum, 0.40 ], [ Shark, 0.00 ], [ Lionfish, 0.10 ], [ Goby, 1.30 ]
    ]);
};
linker.goto(Bait).link(FlyBait);

class WormBait extends Bait {
    static id = "prefab.bait.worm";
    static name = new Text("Worm bait");
    static description = new Text("A common bait for fishing.").plural(false);

    static power = new Map([
        [ MangroveSnapper, 1.00 ], [ Mudskipper, 1.60 ], [ Flounder, 0.90 ], [ Grouper, 0.20 ],
        [ SeaBass, 0.80 ], [ Barramundi, 0.60 ], [ Tarpon, 0.20 ], [ Barracuda, 0.00 ],
        [ Mackerel, 0.30 ], [ Tuna, 0.00 ], [ Cod, 0.50 ], [ Halibut, 0.40 ],
        [ Seahorse, 1.40 ], [ Eel, 0.20 ], [ Pufferfish, 0.80  ], [ Sardine, 1.80 ],
        [ RedDrum, 0.50 ], [ Shark, 0.00 ], [ Lionfish, 0.20 ], [ Goby, 1.70 ]
    ]);
};
linker.goto(Bait).link(WormBait);

class MinnowBait extends Bait {
    static id = "prefab.bait.minnow";
    static name = new Text("Minnow bait");
    static description = new Text("A small fish used as bait.").plural(false);

    static power = new Map([
        [ MangroveSnapper, 1.20 ], [ Mudskipper, 0.40 ], [ Flounder, 1.00 ], [ Grouper, 0.70 ],
        [ SeaBass, 1.00 ], [ Barramundi, 0.90 ], [ Tarpon, 0.80 ], [ Barracuda, 0.60 ],
        [ Mackerel, 1.40 ], [ Tuna, 0.20 ], [ Cod, 0.80 ], [ Halibut, 0.70 ],
        [ Seahorse, 0.60 ], [ Eel, 0.40 ], [ Pufferfish, 1.00 ], [ Sardine, 1.60 ],
        [ RedDrum, 1.20 ], [ Shark, 0.00 ], [ Lionfish, 0.40 ], [ Goby, 1.20 ]
    ]);
};
linker.goto(Bait).link(MinnowBait);

class ShrimpBait extends Bait {
    static id = "prefab.bait.shrimp";
    static name = new Text("Shrimp bait");
    static description = new Text("A small crustacean used as bait.").plural(false);

    static power = new Map([
        [ MangroveSnapper, 1.30 ], [ Mudskipper, 0.80 ], [ Flounder, 1.20 ], [ Grouper, 1.00 ],
        [ SeaBass, 1.10 ], [ Barramundi, 1.00 ], [ Tarpon, 1.10 ], [ Barracuda, 0.80 ],
        [ Mackerel, 1.30 ], [ Tuna, 0.50 ], [ Cod, 1.10 ], [ Halibut, 1.20 ],
        [ Seahorse, 0.70 ], [ Eel, 0.80 ], [ Pufferfish, 0.90 ], [ Sardine, 1.40 ],
        [ RedDrum, 1.30 ], [ Shark, 0.20 ], [ Lionfish, 0.80 ], [ Goby, 0.90 ]
    ]);
};
linker.goto(Bait).link(ShrimpBait);

class TadpoleBait extends Bait {
    static id = "prefab.bait.tadpole";
    static name = new Text("Tadpole bait");
    static description = new Text("A small amphibian used as bait.").plural(false);

    static power = new Map([
        [ MangroveSnapper, 0.90 ], [ Mudskipper, 0.10 ], [ Flounder, 0.80 ], [ Grouper, 0.90 ],
        [ SeaBass, 0.95 ], [ Barramundi, 1.30 ], [ Tarpon, 1.50 ], [ Barracuda, 1.60 ],
        [ Mackerel, 1.00 ], [ Tuna, 1.30 ], [ Cod, 0.90 ], [ Halibut, 1.00 ],
        [ Seahorse, 0.10 ], [ Eel, 0.60 ], [ Pufferfish, 0.70 ], [ Sardine, 0.60 ],
        [ RedDrum, 1.30 ], [ Shark, 0.70 ], [ Lionfish, 0.80 ], [ Goby, 0.20 ]
    ]);
};
linker.goto(Bait).link(TadpoleBait);

class CrabBait extends Bait {
    static id = "prefab.bait.crab";
    static name = new Text("Crab bait");
    static description = new Text("A small crustacean used as bait.").plural(false);

    static power = new Map([
        [ MangroveSnapper, 1.50 ], [ Mudskipper, 0.00 ], [ Flounder, 1.10 ], [ Grouper, 1.50 ],
        [ SeaBass, 1.10 ], [ Barramundi, 1.00 ], [ Tarpon, 1.00 ], [ Barracuda, 1.20 ],
        [ Mackerel, 0.80 ], [ Tuna, 1.20 ], [ Cod, 1.00 ], [ Halibut, 1.40 ],
        [ Seahorse, 0.00 ], [ Eel, 0.80 ], [ Pufferfish, 0.40 ], [ Sardine, 0.40 ],
        [ RedDrum, 1.20 ], [ Shark, 1.50 ], [ Lionfish, 0.90 ], [ Goby, 0.00 ]
    ]);
};
linker.goto(Bait).link(CrabBait);

class SquidBait extends Bait {
    static id = "prefab.bait.squid";
    static name = new Text("Squid bait");
    static description = new Text("A small cephalopod used as bait.").plural(false);

    static power = new Map([
        [ MangroveSnapper, 0.90 ], [ Mudskipper, 0.00 ], [ Flounder, 1.10 ], [ Grouper, 1.70 ],
        [ SeaBass, 1.30 ], [ Barramundi, 1.30 ], [ Tarpon, 1.20 ], [ Barracuda, 1.50 ],
        [ Mackerel, 1.10 ], [ Tuna, 2.00 ], [ Cod, 1.30 ], [ Halibut, 1.60 ],
        [ Seahorse, 0 ], [ Eel, 1.20 ], [ Pufferfish, 0.60 ], [ Sardine, 0.60 ],
        [ RedDrum, 1.20 ], [ Shark, 2.00 ], [ Lionfish, 1.10 ], [ Goby, 0.00 ]
    ]);
};
linker.goto(Bait).link(SquidBait);

class MasterBait extends Bait {
    static id = "prefab.bait.master";
    static name = new Text("Master bait");
    static description = new Text("A very special bait that attracts all fish equally.").plural(false);

    static power = new Map([
        [ MangroveSnapper, 2.00 ], [ Mudskipper, 2.00 ], [ Flounder, 2.00 ], [ Grouper, 2.00 ],
        [ SeaBass, 2.00 ], [ Barramundi, 2.00 ], [ Tarpon, 2.00 ], [ Barracuda, 2.00 ],
        [ Mackerel, 2.00 ], [ Tuna, 2.00 ], [ Cod, 2.00 ], [ Halibut, 2.00 ],
        [ Seahorse, 2.00 ], [ Eel, 2.00 ], [ Pufferfish, 2.00 ], [ Sardine, 2.00 ],
        [ RedDrum, 2.00 ], [ Shark, 2.00 ], [ Lionfish, 2.00 ], [ Goby, 2.00 ]
    ]);
};
linker.goto(Bait).link(MasterBait);