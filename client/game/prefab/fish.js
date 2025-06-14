import linker from "../linker.js";
import Time from "../time.js";

import Text from "../../module/text.js";
import Variable from "../../module/variable.js";

import Prefab from "./prefab.js";
import Item from './item.js';
import Drop from './drop.js';

export default class Fish extends Prefab {
    static id = "prefab.fish";

    static drop = class extends Drop {};
};
linker.link(Fish);

class MangroveSnapper extends Fish {
    static id = "prefab.fish.mangrove_snapper";
    static name = new Text("mangrove snapper");
    static description = new Text("Year-round").plural(false);

    static sprite = "/game/assets/fish/mangrove-snapper.svg";

    static drop = class extends Drop {
        static id = "prefab.fish.mangrove_snapper>prefab.drop#drop";
        static name = new Text("mangrove snapper").plural(false);

        static yield = new Variable("variance:3", 5, .01);
        static item = class extends Item {
            static id = "prefab.fish.mangrove_snapper>prefab.drop#drop>prefab.item#item";
            static name = new Text("mangrove snapper").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 15, .05);
        };
    };
};
linker
    .goto(Fish).link(MangroveSnapper)
    .goto(MangroveSnapper).link(MangroveSnapper.drop)
    .goto(MangroveSnapper.drop).link(MangroveSnapper.drop.item);

class Mudskipper extends Fish {
    static id = "prefab.fish.mudskipper";
    static name = new Text("mudskipper");
    static description = new Text("Feb. - Sep.").plural(false);

    static sprite = "/game/assets/fish/mudskipper.svg";

    static drop = class extends Drop {
        static id = "prefab.fish.mudskipper>prefab.drop#drop";
        static name = new Text("kg mudskipper").plural(false);

        static yield = new Variable("error:3", 0.3, .2);
        static item = class extends Item {
            static id = "prefab.fish.mudskipper>prefab.drop#drop>prefab.item#item";
            static name = new Text("kg mudskipper").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 3, .02);
        };
    };
};
linker
    .goto(Fish).link(Mudskipper)
    .goto(Mudskipper).link(Mudskipper.drop)
    .goto(Mudskipper.drop).link(Mudskipper.drop.item);

class Flounder extends Fish {
    static id = "prefab.fish.flounder";
    static name = new Text("flounder");
    static description = new Text("Jan. - Oct.").plural(false);

    static sprite = "/game/assets/fish/flounder.svg";

    static drop = class extends Drop {
        static id = "prefab.fish.flounder>prefab.drop#drop";
        static name = new Text("kg flounder").plural(false);

        static yield = new Variable("variance:3", 3, .1);
        static item = class extends Item {
            static id = "prefab.fish.flounder>prefab.drop#drop>prefab.item#item";
            static name = new Text("kg flounder").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 12, .01);
        };
    };
};
linker
    .goto(Fish).link(Flounder)
    .goto(Flounder).link(Flounder.drop)
    .goto(Flounder.drop).link(Flounder.drop.item);

class Grouper extends Fish {
    static id = "prefab.fish.grouper";
    static name = new Text("grouper");
    static description = new Text("Jan. - Oct.").plural(false);

    static sprite = "/game/assets/fish/grouper.svg";

    static drop = class extends Drop {
        static id = "prefab.fish.grouper>prefab.drop#drop";
        static name = new Text("kg grouper").plural(false);

        static yield = new Variable("variance:3", 30, .1);
        static item = class extends Item {
            static id = "prefab.fish.grouper>prefab.drop#drop>prefab.item#item";
            static name = new Text("kg grouper").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 18, .01);
        };
    };
};
linker
    .goto(Fish).link(Grouper)
    .goto(Grouper).link(Grouper.drop)
    .goto(Grouper.drop).link(Grouper.drop.item);

class SeaBass extends Fish {
    static id = "prefab.fish.sea_bass";
    static name = new Text("sea bass");
    static description = new Text("Jan. - Oct.").plural(false);

    static sprite = "/game/assets/fish/sea-bass.svg";

    static drop = class extends Drop {
        static id = "prefab.fish.sea_bass>prefab.drop#drop";
        static name = new Text("sea bass").plural(false);

        static yield = new Variable("variance:3", 6, .01);
        static item = class extends Item {
            static id = "prefab.fish.sea_bass>prefab.drop#drop>prefab.item#item";
            static name = new Text("sea bass").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 17, .005);
        };
    };
};
linker
    .goto(Fish).link(SeaBass)
    .goto(SeaBass).link(SeaBass.drop)
    .goto(SeaBass.drop).link(SeaBass.drop.item);

class Barramundi extends Fish {
    static id = "prefab.fish.barramundi";
    static name = new Text("barramundi");
    static description = new Text("Oct. - Jul.").plural(false);

    static sprite = "/game/assets/fish/barramundi.svg";

    static drop = class extends Drop {
        static id = "prefab.fish.barramundi>prefab.drop#drop";
        static name = new Text("kg barramundi").plural(false);

        static yield = new Variable("variance:3", 12, .01);
        static item = class extends Item {
            static id = "prefab.fish.barramundi>prefab.drop#drop>prefab.item#item";
            static name = new Text("kg barramundi").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 16, .0075);
        };
    };
};
linker
    .goto(Fish).link(Barramundi)
    .goto(Barramundi).link(Barramundi.drop)
    .goto(Barramundi.drop).link(Barramundi.drop.item);

class Tarpon extends Fish {
    static id = "prefab.fish.tarpon";
    static name = new Text("tarpon");
    static description = new Text("Feb. - Oct.").plural(false);

    static sprite = "/game/assets/fish/tarpon.svg";

    static drop = class extends Drop {
        static id = "prefab.fish.tarpon>prefab.drop#drop";
        static name = new Text("kg tarpon").plural(false);

        static yield = new Variable("variance:3", 25, .035);
        static item = class extends Item {
            static id = "prefab.fish.tarpon>prefab.drop#drop>prefab.item#item";
            static name = new Text("kg tarpon").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 14, .01);
        };
    };
};
linker
    .goto(Fish).link(Tarpon)
    .goto(Tarpon).link(Tarpon.drop)
    .goto(Tarpon.drop).link(Tarpon.drop.item);

class Barracuda extends Fish {
    static id = "prefab.fish.barracuda";
    static name = new Text("barracuda");
    static description = new Text("Jan. - Oct.").plural(false);

    static sprite = "/game/assets/fish/barracuda.svg";

    static drop = class extends Drop {
        static id = "prefab.fish.barracuda>prefab.drop#drop";
        static name = new Text("kg barracuda").plural(false);

        static yield = new Variable("variance:3", 13, .1);
        static item = class extends Item {
            static id = "prefab.fish.barracuda>prefab.drop#drop>prefab.item#item";
            static name = new Text("kg barracuda").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 13, .0125);
        };
    };
};
linker
    .goto(Fish).link(Barracuda)
    .goto(Barracuda).link(Barracuda.drop)
    .goto(Barracuda.drop).link(Barracuda.drop.item);

class Mackerel extends Fish {
    static id = "prefab.fish.mackerel";
    static name = new Text("mackerel");
    static description = new Text("Year-round").plural(false);

    static sprite = "/game/assets/fish/mackerel.svg";

    static drop = class extends Drop {
        static id = "prefab.fish.mackerel>prefab.drop#drop";
        static name = new Text("kg mackerel").plural(false);

        static yield = new Variable("variance:3", .5, .01);
        static item = class extends Item {
            static id = "prefab.fish.mackerel>prefab.drop#drop>prefab.item#item";
            static name = new Text("kg mackerel").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 8, .001);
        };
    };
};
linker
    .goto(Fish).link(Mackerel)
    .goto(Mackerel).link(Mackerel.drop)
    .goto(Mackerel.drop).link(Mackerel.drop.item);

class Tuna extends Fish {
    static id = "prefab.fish.tuna";
    static name = new Text("tuna");
    static description = new Text("Feb. - Nov.").plural(false);

    static sprite = "/game/assets/fish/tuna.svg";

    static drop = class extends Drop {
        static id = "prefab.fish.tuna>prefab.drop#drop";
        static name = new Text("kg tuna").plural(false);

        static yield = new Variable("variance:3", 60, .15);
        static item = class extends Item {
            static id = "prefab.fish.tuna>prefab.drop#drop>prefab.item#item";
            static name = new Text("kg tuna").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 20, .01);
        };
    };
};
linker
    .goto(Fish).link(Tuna)
    .goto(Tuna).link(Tuna.drop)
    .goto(Tuna.drop).link(Tuna.drop.item);

class Cod extends Fish {
    static id = "prefab.fish.cod";
    static name = new Text("cod");
    static description = new Text("Year-round").plural(false);

    static sprite = "/game/assets/fish/cod.svg";

    static drop = class extends Drop {
        static id = "prefab.fish.cod>prefab.drop#drop";
        static name = new Text("kg cod").plural(false);

        static yield = new Variable("variance:3", 25, .02);
        static item = class extends Item {
            static id = "prefab.fish.cod>prefab.drop#drop>prefab.item#item";
            static name = new Text("kg cod").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 10, .015);
        };
    };
};
linker
    .goto(Fish).link(Cod)
    .goto(Cod).link(Cod.drop)
    .goto(Cod.drop).link(Cod.drop.item);

class Halibut extends Fish {
    static id = "prefab.fish.halibut";
    static name = new Text("halibut");
    static description = new Text("Jan. - Oct.").plural(false);

    static sprite = "/game/assets/fish/halibut.svg";

    static drop = class extends Drop {
        static id = "prefab.fish.halibut>prefab.drop#drop";
        static name = new Text("kg halibut").plural(false);

        static yield = new Variable("variance:3", 40, .075);
        static item = class extends Item {
            static id = "prefab.fish.halibut>prefab.drop#drop>prefab.item#item";
            static name = new Text("kg halibut").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 22, .001);
        };
    };
};
linker
    .goto(Fish).link(Halibut)
    .goto(Halibut).link(Halibut.drop)
    .goto(Halibut.drop).link(Halibut.drop.item);

class Seahorse extends Fish {
    static id = "prefab.fish.seahorse";
    static name = new Text("seahorse");
    static description = new Text("Feb. - Sep.").plural(false);

    static sprite = "/game/assets/fish/seahorse.svg";

    static drop = class extends Drop {
        static id = "prefab.fish.seahorse>prefab.drop#drop";
        static name = new Text("kg seahorse").plural(false);

        static yield = new Variable("variance:3", .001, .001);
        static item = class extends Item {
            static id = "prefab.fish.seahorse>prefab.drop#drop>prefab.item#item";
            static name = new Text("kg seahorse").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 55, .25);
        };
    };
};
linker
    .goto(Fish).link(Seahorse)
    .goto(Seahorse).link(Seahorse.drop)
    .goto(Seahorse.drop).link(Seahorse.drop.item);

class Eel extends Fish {
    static id = "prefab.fish.eel";
    static name = new Text("eel");
    static description = new Text("Feb. - Sep.").plural(false);

    static sprite = "/game/assets/fish/eel.svg";

    static drop = class extends Drop {
        static id = "prefab.fish.eel>prefab.drop#drop";
        static name = new Text("kg eel").plural(false);

        static yield = new Variable("variance:3", 2, .0001);
        static item = class extends Item {
            static id = "prefab.fish.eel>prefab.drop#drop>prefab.item#item";
            static name = new Text("kg eel").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 25, .01);
        };
    };
};
linker
    .goto(Fish).link(Eel)
    .goto(Eel).link(Eel.drop)
    .goto(Eel.drop).link(Eel.drop.item);

class Pufferfish extends Fish {
    static id = "prefab.fish.pufferfish";
    static name = new Text("pufferfish");
    static description = new Text("Year-round").plural(false);

    static sprite = "/game/assets/fish/pufferfish.svg";

    static drop = class extends Drop {
        static id = "prefab.fish.pufferfish>prefab.drop#drop";
        static name = new Text("kg pufferfish").plural(false);

        static yield = new Variable("variance:3", .8, .000001);
        static item = class extends Item {
            static id = "prefab.fish.pufferfish>prefab.drop#drop>prefab.item#item";
            static name = new Text("kg pufferfish").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 30, .0125);
        };
    };
};
linker
    .goto(Fish).link(Pufferfish)
    .goto(Pufferfish).link(Pufferfish.drop)
    .goto(Pufferfish.drop).link(Pufferfish.drop.item);

class Sardine extends Fish {
    static id = "prefab.fish.sardine";
    static name = new Text("sardine");
    static description = new Text("Year-round").plural(false);

    static sprite = "/game/assets/fish/sardine.svg";

    static drop = class extends Drop {
        static id = "prefab.fish.sardine>prefab.drop#drop";
        static name = new Text("kg sardine").plural(false);

        static yield = new Variable("variance:3", .1, .00001);
        static item = class extends Item {
            static id = "prefab.fish.sardine>prefab.drop#drop>prefab.item#item";
            static name = new Text("kg sardine").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 4, .0000001);
        };
    };
};
linker
    .goto(Fish).link(Sardine)
    .goto(Sardine).link(Sardine.drop)
    .goto(Sardine.drop).link(Sardine.drop.item);

class RedDrum extends Fish {
    static id = "prefab.fish.red_drum";
    static name = new Text("red drum");
    static description = new Text("Year-round").plural(false);

    static sprite = "/game/assets/fish/red-drum.svg";

    static drop = class extends Drop {
        static id = "prefab.fish.red_drum>prefab.drop#drop";
        static name = new Text("red drum").plural(false);

        static yield = new Variable("variance:3", 9, .001);
        static item = class extends Item {
            static id = "prefab.fish.red_drum>prefab.drop#drop>prefab.item#item";
            static name = new Text("red drum").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 14, .0035);
        };
    };
};
linker
    .goto(Fish).link(RedDrum)
    .goto(RedDrum).link(RedDrum.drop)
    .goto(RedDrum.drop).link(RedDrum.drop.item);

class Shark extends Fish {
    static id = "prefab.fish.shark";
    static name = new Text("shark");
    static description = new Text("Year-round").plural(false);

    static sprite = "/game/assets/fish/shark.svg";

    static drop = class extends Drop {
        static id = "prefab.fish.shark>prefab.drop#drop";
        static name = new Text("kg shark").plural(false);

        static yield = new Variable("variance:3", 300, .4);
        static item = class extends Item {
            static id = "prefab.fish.shark>prefab.drop#drop>prefab.item#item";
            static name = new Text("kg shark").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 12, .025);
        };
    };
};
linker
    .goto(Fish).link(Shark)
    .goto(Shark).link(Shark.drop)
    .goto(Shark.drop).link(Shark.drop.item);

class Lionfish extends Fish {
    static id = "prefab.fish.lionfish";
    static name = new Text("lionfish");
    static description = new Text("Year-round").plural(false);

    static sprite = "/game/assets/fish/lionfish.svg";

    static drop = class extends Drop {
        static id = "prefab.fish.lionfish>prefab.drop#drop";
        static name = new Text("kg lionfish").plural(false);

        static yield = new Variable("variance:3", 1, .00035);
        static item = class extends Item {
            static id = "prefab.fish.lionfish>prefab.drop#drop>prefab.item#item";
            static name = new Text("kg lionfish").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 20, .035);
        };
    };
};
linker
    .goto(Fish).link(Lionfish)
    .goto(Lionfish).link(Lionfish.drop)
    .goto(Lionfish.drop).link(Lionfish.drop.item);

class Goby extends Fish {
    static id = "prefab.fish.goby";
    static name = new Text("goby");
    static description = new Text("Year-round").plural(false);

    static sprite = "/game/assets/fish/goby.svg";

    static drop = class extends Drop {
        static id = "prefab.fish.goby>prefab.drop#drop";
        static name = new Text("kg goby").plural(false);

        static yield = new Variable("variance:3", .03, .000000001);
        static item = class extends Item {
            static id = "prefab.fish.goby>prefab.drop#drop>prefab.item#item";
            static name = new Text("kg goby").plural(false);

            static sellable = true;
            static sell_price = new Variable("variance:2", 3, .0000000001);
        };
    };
};
linker
    .goto(Fish).link(Goby)
    .goto(Goby).link(Goby.drop)
    .goto(Goby.drop).link(Goby.drop.item);

export {
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
};