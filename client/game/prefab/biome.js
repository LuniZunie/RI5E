import linker from "../linker.js";
import Time from "../time.js";

import "../../module/object.js";
import Climate from "../../module/climate.js";
import define from "../../module/define.js";
import Text from "../../module/text.js";
import Variable from "../../module/variable.js";

import Prefab from "./prefab.js";
import Forageable, {
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
} from "./forageable.js";

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

// TODO: add more water biomes, and a desert

export default class Biome extends Prefab {
    static id = "prefab.biome";

    static sprite = "";
    static climate;

    static forageables = [];
    static fishes = {};

    element;
    x; y;
    climate;
    distance;
    locked = true;

    _forageables = new Map();
    get forageables() {
        return Array.from(this._forageables.values());
    }
    set forageables(value) {
        if (!Array.isArray(value))
            throw new TypeError("Biome.forageables must be an array");
        this._forageables.clear();
        for (const forageable of value)
            this._forageables.set(forageable.constructor.id, forageable);
    }

    static format = {
        ...Prefab.format,
        x: { required: true, test: v => Number.isInteger(v) },
        y: { required: true, test: v => Number.isInteger(v) },
        climate: { required: true, test: v => Object.match(v, Climate.format) },
        distance: { required: true, test: v => Number.isFinite(v) && v >= 0 },
        locked: { required: false, test: v => typeof v === "boolean" },
        forageables: { required: false, test: v => Array.isArray(v) && v.every(f => f === null || f instanceof Forageable || Object.match(f.data, Forageable.format)) },
    };

    capture(game, event) {
        switch (event.id) {
            case "prefab.game_event.day_change": {
                const target = this.constructor.forageables;
                if (target.length === 0)
                    return;

                const temp = [];
                let changed = false;
                for (const forageable of target) {
                    const thisForageable = this._forageables.get(forageable.id) || new forageable();
                    if (
                        (thisForageable.constructor.season & Time.Month[Time.getMonth(thisForageable.grown)]) &&
                        (thisForageable.constructor.season & Time.Month[Time.getMonth()])
                        )
                        temp.push(thisForageable);
                    else
                        changed = true; // existing forageable is not in season, remove it
                }

                if (changed)
                    game.user.inventory.change(this, biome => {
                        biome.forageables = temp;
                    });
            } break;
        }
    }
};
linker.link(Biome);

class TemperateGrassland extends Biome {
    static id = "prefab.biome.temperate_grassland";
    static name = new Text("temperate grassland");
    static description = new Text("A wide, open area with grass and few trees.").plural(false);

    static sprite = "#88c070";

    static climate = define(Climate, {
        altitude: 0.5,
        temperature: 0.4,
        humidity: 0.4,
    });

    static forageables = [ Grass, Clover, Dandelion, Blackberry, Grape, Strawberry, Apple, Cherry ];
};
linker.goto(Biome).link(TemperateGrassland);

class TropicalGrassland extends Biome {
    static id = "prefab.biome.tropical_grassland";
    static name = new Text("tropical grassland");
    static description = new Text("A warm, open area with tall grass and scattered trees.").plural(false);

    static sprite = "#b8d07d";

    static climate = define(Climate, {
        altitude: 0.5,
        temperature: 0.6,
        humidity: 0.6,
    });

    static forageables = [ Grass, Banana, Orange, Lemon, Lime, Pineapple, Coconut ];
};
linker.goto(Biome).link(TropicalGrassland);

class Shrubland extends Biome {
    static id = "prefab.biome.shrubland";
    static name = new Text("shrubland");
    static description = new Text("A dry, open area with scattered shrubs.").plural(false);

    static sprite = "#c2a662";

    static climate = define(Climate, {
        altitude: 0.5,
        temperature: 0.9,
        humidity: 0.1,
    });

    static forageables = [ Grass, Clover, Dandelion, Mushroom, Blackberry, Raspberry, Grape, Strawberry, Apple, Peach, Cherry ];
};
linker.goto(Biome).link(Shrubland);

class Scrubland extends Biome {
    static id = "prefab.biome.scrubland";
    static name = new Text("scrubland");
    static description = new Text("A dry, open area with low shrubs and grasses.").plural(false);

    static sprite = "#b79e68";

    static climate = define(Climate, {
        altitude: 0.5,
        temperature: 0.8,
        humidity: 0.2,
    });

    static forageables = [ Grass, Blackberry, Grape, Orange, Lemon, Lime ];
};
linker.goto(Biome).link(Scrubland);

class TemperateForest extends Biome {
    static id = "prefab.biome.temperate_forest";
    static name = new Text("temperate forest");
    static description = new Text("A dense, wooded area with a variety of plants.").plural(false);

    static sprite = "#4b8b3b";

    static climate = define(Climate, {
        altitude: 0.7,
        temperature: 0.4,
        humidity: 0.7,
    });

    static forageables = [ Grass, Clover, Dandelion, Mushroom, Blackberry, Raspberry, Blueberry, Grape, Strawberry, Apple, Peach, Cherry ];
};
linker.goto(Biome).link(TemperateForest);

class MontaneForest extends Biome {
    static id = "prefab.biome.montane_forest";
    static name = new Text("montane forest");
    static description = new Text("A forest located in mountainous regions with diverse flora.").plural(false);

    static sprite = "#44695f";

    static climate = define(Climate, {
        altitude: 0.9,
        temperature: 0.2,
        humidity: 0.4,
    });

    static forageables = [ Grass, Clover, Dandelion, Mushroom, Blackberry, Raspberry, Blueberry, Grape, Strawberry, Apple, Orange, Peach, Lemon, Lime, Cherry ];
};
linker.goto(Biome).link(MontaneForest);

class SubtropicalForest extends Biome {
    static id = "prefab.biome.subtropical_forest";
    static name = new Text("subtropical forest");
    static description = new Text("A warm, humid forest with lush vegetation.").plural(false);

    static sprite = "#5aa85c";

    static climate = define(Climate, {
        altitude: 0.4,
        temperature: 0.8,
        humidity: 0.6,
    });

    static forageables = [ Grass, Mushroom, Blackberry, Raspberry, Blueberry, Grape, Strawberry, Banana, Apple, Orange, Peach, Lemon, Lime, Cherry, Pineapple, Coconut ];
};
linker.goto(Biome).link(SubtropicalForest);

class MangroveForest extends Biome {
    static id = "prefab.biome.mangrove_forest";
    static name = new Text("mangrove forest");
    static description = new Text("A coastal forest with salt-tolerant trees.").plural(false);

    static sprite = "#417760";

    static climate = define(Climate, {
        altitude: 0.3,
        temperature: 0.3,
        humidity: 0.8,
    });

    static forageables = [ Pineapple, Coconut ];
    static fishes = {
        [Time.Month.January]: new Map([
            [ Goby, .68 ], [ RedDrum, .46 ], [ Mudskipper, .51 ], [ MangroveSnapper, .34 ],
            [ Seahorse, .29 ], [ Barramundi, .60 ], [ Tarpon, .12 ], [ Pufferfish, .67 ]
        ]),
        [Time.Month.February]: new Map([
            [ Goby, .12 ], [ RedDrum, .30 ], [ Mudskipper, .96 ], [ MangroveSnapper, .29 ],
            [ Seahorse, .22 ], [ Barramundi, .75 ], [ Tarpon, .76 ], [ Pufferfish, .40 ]
        ]),
        [Time.Month.March]: new Map([
            [ Goby, .35 ], [ RedDrum, 1 ], [ Mudskipper, .89 ], [ MangroveSnapper, .59 ],
            [ Seahorse, .94 ], [ Barramundi, .24 ], [ Tarpon, .40 ], [ Pufferfish, .84 ]
        ]),
        [Time.Month.April]: new Map([
            [ Goby, .30 ], [ RedDrum, .56 ], [ Mudskipper, .34 ], [ MangroveSnapper, .76 ],
            [ Seahorse, .61 ], [ Barramundi, .37 ], [ Tarpon, .94 ], [ Pufferfish, .78 ]
        ]),
        [Time.Month.May]: new Map([
            [ Goby, .76 ], [ RedDrum, .18 ], [ Mudskipper, .55 ], [ MangroveSnapper, .28 ],
            [ Seahorse, .53 ], [ Barramundi, .97 ], [ Tarpon, .82 ], [ Pufferfish, .71 ]
        ]),
        [Time.Month.June]: new Map([
            [ Goby, .71 ], [ RedDrum, .14 ], [ Mudskipper, .26 ], [ MangroveSnapper, .38 ],
            [ Seahorse, .81 ], [ Barramundi, .62 ], [ Tarpon, .88 ], [ Pufferfish, .30 ]
        ]),
        [Time.Month.July]: new Map([
            [ Goby, .90 ], [ RedDrum, .20 ], [ Mudskipper, .92 ], [ MangroveSnapper, 1 ],
            [ Seahorse, .83 ], [ Barramundi, .59 ], [ Tarpon, .83 ], [ Pufferfish, .28 ]
        ]),
        [Time.Month.August]: new Map([
            [ Goby, .18 ], [ RedDrum, .66 ], [ Mudskipper, .88 ], [ MangroveSnapper, .68 ],
            [ Seahorse, .27 ], [ Barramundi, .77 ], [ Tarpon, .34 ], [ Pufferfish, .12 ]
        ]),
        [Time.Month.September]: new Map([
            [ Goby, .48 ], [ RedDrum, .81 ], [ Mudskipper, .37 ], [ MangroveSnapper, .49 ],
            [ Seahorse, .19 ], [ Barramundi, .15 ], [ Tarpon, .81 ], [ Pufferfish, .32 ]
        ]),
        [Time.Month.October]: new Map([
            [ Goby, .13 ], [ RedDrum, .48 ], [ Mudskipper, .68 ], [ MangroveSnapper, .57 ],
            [ Seahorse, .49 ], [ Barramundi, .63 ], [ Tarpon, .20 ], [ Pufferfish, .53 ]
        ]),
        [Time.Month.November]: new Map([
            [ Goby, .30 ], [ RedDrum, .16 ], [ Mudskipper, .65 ], [ MangroveSnapper, .21 ],
            [ Seahorse, .48 ], [ Barramundi, .55 ], [ Tarpon, .88 ], [ Pufferfish, .86 ]
        ]),
        [Time.Month.December]: new Map([
            [ Goby, .55 ], [ RedDrum, .44 ], [ Mudskipper, .24 ], [ MangroveSnapper, .30 ],
            [ Seahorse, .52 ], [ Barramundi, .87 ], [ Tarpon, .87 ], [ Pufferfish, .17 ]
        ]),
        "list": [ Goby, RedDrum, Mudskipper, MangroveSnapper, Seahorse, Barramundi, Tarpon, Pufferfish ]
    };
};
linker.goto(Biome).link(MangroveForest);

class TropicalRainforest extends Biome {
    static id = "prefab.biome.tropical_rainforest";
    static name = new Text("tropical rainforest");
    static description = new Text("A dense, humid forest with a high diversity of plants and animals.").plural(false);

    static sprite = "#2f844c";

    static climate = define(Climate, {
        altitude: 0.4,
        temperature: 0.9,
        humidity: 0.8,
    });

    static forageables = [ Grass, Mushroom, Grape, Banana, Orange, Lemon, Lime, Pineapple, Coconut ];
};
linker.goto(Biome).link(TropicalRainforest);

class Mudflat extends Biome {
    static id = "prefab.biome.mudflat";
    static name = new Text("mudflat");
    static description = new Text("A coastal area with soft, muddy ground.").plural(false);

    static sprite = "#b0a08c";

    static climate = define(Climate, {
        altitude: 0.3,
        temperature: 0.6,
        humidity: 0.8,
    });

    static forageables = [];
    static fishes = {
        [Time.Month.January]: new Map([
            [ Goby, .12 ], [ Flounder, .67 ], [ Mudskipper, 1 ], [ Eel, .79 ],
            [ Halibut, .76 ]
        ]),
        [Time.Month.February]: new Map([
            [ Goby, .28 ], [ Flounder, .43 ], [ Mudskipper, .58 ], [ Eel, .59 ],
            [ Halibut, .38 ]
        ]),
        [Time.Month.March]: new Map([
            [ Goby, .68 ], [ Flounder, .43 ], [ Mudskipper, .97 ], [ Eel, .80 ],
            [ Halibut, .65 ]
        ]),
        [Time.Month.April]: new Map([
            [ Goby, .59 ], [ Flounder, .29 ], [ Mudskipper, .87 ], [ Eel, .58 ],
            [ Halibut, .56 ]
        ]),
        [Time.Month.May]: new Map([
            [ Goby, .30 ], [ Flounder, .34 ], [ Mudskipper, .11 ], [ Eel, .10 ],
            [ Halibut, .45 ]
        ]),
        [Time.Month.June]: new Map([
            [ Goby, .63 ], [ Flounder, .94 ], [ Mudskipper, .75 ], [ Eel, .39 ],
            [ Halibut, .62 ]
        ]),
        [Time.Month.July]: new Map([
            [ Goby, .83 ], [ Flounder, .68 ], [ Mudskipper, .71 ], [ Eel, .12 ],
            [ Halibut, .33 ]
        ]),
        [Time.Month.August]: new Map([
            [ Goby, .11 ], [ Flounder, .65 ], [ Mudskipper, .58 ], [ Eel, .94 ],
            [ Halibut, .74 ]
        ]),
        [Time.Month.September]: new Map([
            [ Goby, .83 ], [ Flounder, .25 ], [ Mudskipper, .34 ], [ Eel, .89 ],
            [ Halibut, .10 ]
        ]),
        [Time.Month.October]: new Map([
            [ Goby, .73 ], [ Flounder, .76 ], [ Mudskipper, .68 ], [ Eel, .85 ],
            [ Halibut, .93 ]
        ]),
        [Time.Month.November]: new Map([
            [ Goby, .41 ], [ Flounder, .25 ], [ Mudskipper, .20 ], [ Eel, .38 ],
            [ Halibut, .58 ]
        ]),
        [Time.Month.December]: new Map([
            [ Goby, .24 ], [ Flounder, .44 ], [ Mudskipper, .49 ], [ Eel, .15 ],
            [ Halibut, .75 ]
        ]),
        "list": [ Goby, Flounder, Mudskipper, Eel, Halibut ]
    };
}
linker.goto(Biome).link(Mudflat);

class ShallowWater extends Biome {
    static id = "prefab.biome.shallow_water";
    static name = new Text("shallow water");
    static description = new Text("A body of shallow water.").plural(false);

    static sprite = "#3ca9dd";

    static climate = define(Climate, {
        altitude: 0.2,
        temperature: 0.3,
        humidity: 0.8,
    });

    static forageables = [];
    static fishes = {
        [Time.Month.January]: new Map([
            [ Sardine, .96 ], [ Flounder, .99 ], [ RedDrum, .89 ], [ MangroveSnapper, .40 ],
            [ Seahorse, .76 ], [ Lionfish, .32 ], [ Barramundi, .24 ], [ Mackerel, .48 ],
            [ Cod, .85 ], [ SeaBass, .48 ], [ Tarpon, .30 ], [ Barracuda, .46 ],
            [ Pufferfish, .49 ]
        ]),
        [Time.Month.February]: new Map([
            [ Sardine, .40 ], [ Flounder, .68 ], [ RedDrum, .38 ], [ MangroveSnapper, .63 ],
            [ Seahorse, .71 ], [ Lionfish, .93 ], [ Barramundi, .96 ], [ Mackerel, .63 ],
            [ Cod, .73 ], [ SeaBass, .35 ], [ Tarpon, .83 ], [ Barracuda, .37 ],
            [ Pufferfish, .62 ]
        ]),
        [Time.Month.March]: new Map([
            [ Sardine, .18 ], [ Flounder, .60 ], [ RedDrum, .69 ], [ MangroveSnapper, .31 ],
            [ Seahorse, .99 ], [ Lionfish, .50 ], [ Barramundi, .17 ], [ Mackerel, .57 ],
            [ Cod, .65 ], [ SeaBass, .10 ], [ Tarpon, .51 ], [ Barracuda, .21 ],
            [ Pufferfish, .69 ]
        ]),
        [Time.Month.April]: new Map([
            [ Sardine, .19 ], [ Flounder, .72 ], [ RedDrum, .46 ], [ MangroveSnapper, .30 ],
            [ Seahorse, .19 ], [ Lionfish, .88 ], [ Barramundi, .27 ], [ Mackerel, .94 ],
            [ Cod, .99 ], [ SeaBass, .79 ], [ Tarpon, .37 ], [ Barracuda, .48 ],
            [ Pufferfish, .52 ]
        ]),
        [Time.Month.May]: new Map([
            [ Sardine, .86 ], [ Flounder, .86 ], [ RedDrum, .92 ], [ MangroveSnapper, .16 ],
            [ Seahorse, .46 ], [ Lionfish, .60 ], [ Barramundi, .64 ], [ Mackerel, .28 ],
            [ Cod, .69 ], [ SeaBass, .67 ], [ Tarpon, .82 ], [ Barracuda, .95 ],
            [ Pufferfish, .50 ]
        ]),
        [Time.Month.June]: new Map([
            [ Sardine, .64 ], [ Flounder, .80 ], [ RedDrum, .51 ], [ MangroveSnapper, .67 ],
            [ Seahorse, .41 ], [ Lionfish, .15 ], [ Barramundi, .71 ], [ Mackerel, .74 ],
            [ Cod, .11 ], [ SeaBass, .34 ], [ Tarpon, .30 ], [ Barracuda, .1712 ],
            [ Pufferfish, .29 ]
        ]),
        [Time.Month.July]: new Map([
            [ Sardine, .83 ], [ Flounder, .31 ], [ RedDrum, .34 ], [ MangroveSnapper, .31 ],
            [ Seahorse, .88 ], [ Lionfish, 1 ], [ Barramundi, .31 ], [ Mackerel, .31 ],
            [ Cod, .84 ], [ SeaBass, .77 ], [ Tarpon, .12 ], [ Barracuda, .91 ],
            [ Pufferfish, .53 ]
        ]),
        [Time.Month.August]: new Map([
            [ Sardine, .76 ], [ Flounder, .13 ], [ RedDrum, .32 ], [ MangroveSnapper, .91 ],
            [ Seahorse, .32 ], [ Lionfish, .85 ], [ Barramundi, .21 ], [ Mackerel, .46 ],
            [ Cod, .37 ], [ SeaBass, .60 ], [ Tarpon, .27 ], [ Barracuda, .65 ],
            [ Pufferfish, .91 ]
        ]),
        [Time.Month.September]: new Map([
            [ Sardine, .58 ], [ Flounder, .38 ], [ RedDrum, .61 ], [ MangroveSnapper, .87 ],
            [ Seahorse, .27 ], [ Lionfish, .97 ], [ Barramundi, .90 ], [ Mackerel, .70 ],
            [ Cod, .70 ], [ SeaBass, .48 ], [ Tarpon, .40 ], [ Barracuda, .37 ],
            [ Pufferfish, 82 ]
        ]),
        [Time.Month.October]: new Map([
            [ Sardine, .98 ], [ Flounder, .34 ], [ RedDrum, .34 ], [ MangroveSnapper, .16 ],
            [ Seahorse, .50 ], [ Lionfish, .93 ], [ Barramundi, .32 ], [ Mackerel, .37 ],
            [ Cod, .95 ], [ SeaBass, .11 ], [ Tarpon, .88 ], [ Barracuda, .59 ],
            [ Pufferfish, .25 ]
        ]),
        [Time.Month.November]: new Map([
            [ Sardine, .44 ], [ Flounder, .29 ], [ RedDrum, .63 ], [ MangroveSnapper, .31 ],
            [ Seahorse, .48 ], [ Lionfish, .86 ], [ Barramundi, .64 ], [ Mackerel, .38 ],
            [ Cod, .22 ], [ SeaBass, .17 ], [ Tarpon, .97 ], [ Barracuda, .10 ],
            [ Pufferfish, .18 ]
        ]),
        [Time.Month.December]: new Map([
            [ Sardine, .60 ], [ Flounder, .95 ], [ RedDrum, .91 ], [ MangroveSnapper, .70 ],
            [ Seahorse, .35 ], [ Lionfish, .25 ], [ Barramundi, .66 ], [ Mackerel, .78 ],
            [ Cod, .20 ], [ SeaBass, .89 ], [ Tarpon, .35 ], [ Barracuda, .36 ],
            [ Pufferfish, .56 ]
        ]),
        "list": [ Sardine, Flounder, RedDrum, MangroveSnapper, Seahorse, Lionfish, Barramundi, Mackerel, Cod, SeaBass, Tarpon, Barracuda, Pufferfish ]
    };
};
linker.goto(Biome).link(ShallowWater);

class DeepWater extends Biome {
    static id = "prefab.biome.deep_water";
    static name = new Text("deep water");
    static description = new Text("A body of deep water.").plural(false);

    static sprite = "#1e6f9c";

    static climate = define(Climate, {
        altitude: 0,
        temperature: 0.1,
        humidity: 0.9,
    });

    static forageables = [];
    static fishes = {
        [Time.Month.January]: new Map([
            [ Sardine, .85 ], [ Eel, .89 ], [ Lionfish, .54 ], [ Mackerel, .17 ],
            [ Cod, .20 ], [ SeaBass, .91 ], [ Grouper, .32 ], [ Halibut, .68 ],
            [ Barracuda, .77 ], [ Shark, .47 ], [ Tuna, .26 ]
        ]),
        [Time.Month.February]: new Map([
            [ Sardine, .66 ], [ Eel, .95 ], [ Lionfish, .29 ], [ Mackerel, .51 ],
            [ Cod, .60 ], [ SeaBass, .59 ], [ Grouper, .19 ], [ Halibut, .46 ],
            [ Barracuda, .70 ], [ Shark, .67 ], [ Tuna, .96 ]
        ]),
        [Time.Month.March]: new Map([
            [ Sardine, .88 ], [ Eel, .18 ], [ Lionfish, .46 ], [ Mackerel, 1 ],
            [ Cod, .35 ], [ SeaBass, .85 ], [ Grouper, .80 ], [ Halibut, .98 ],
            [ Barracuda, .43 ], [ Shark, .27 ], [ Tuna, .57 ]
        ]),
        [Time.Month.April]: new Map([
            [ Sardine, .62 ], [ Eel, .54 ], [ Lionfish, .15 ], [ Mackerel, 1 ],
            [ Cod, .64 ], [ SeaBass, .62 ], [ Grouper, .90 ], [ Halibut, .58 ],
            [ Barracuda, .16 ], [ Shark, .73 ], [ Tuna, .15 ]
        ]),
        [Time.Month.May]: new Map([
            [ Sardine, .73 ], [ Eel, .16 ], [ Lionfish, .44 ], [ Mackerel, .17 ],
            [ Cod, .75 ], [ SeaBass, .23 ], [ Grouper, .47 ], [ Halibut, .95 ],
            [ Barracuda, .70 ], [ Shark, .54 ], [ Tuna, .32 ]
        ]),
        [Time.Month.June]: new Map([
            [ Sardine, .14 ], [ Eel, .78 ], [ Lionfish, .99 ], [ Mackerel, .29 ],
            [ Cod, .28 ], [ SeaBass, .21 ], [ Grouper, .66 ], [ Halibut, .20 ],
            [ Barracuda, .40 ], [ Shark, .32 ], [ Tuna, .86 ]
        ]),
        [Time.Month.July]: new Map([
            [ Sardine, .31 ], [ Eel, .79 ], [ Lionfish, .34 ], [ Mackerel, .34 ],
            [ Cod, .67 ], [ SeaBass, .38 ], [ Grouper, .24 ], [ Halibut, .97 ],
            [ Barracuda, .38 ], [ Shark, .69 ], [ Tuna, .51 ]
        ]),
        [Time.Month.August]: new Map([
            [ Sardine, .36 ], [ Eel, .22 ], [ Lionfish, .81 ], [ Mackerel, .94 ],
            [ Cod, .34 ], [ SeaBass, .91 ], [ Grouper, .94 ], [ Halibut, .26 ],
            [ Barracuda, .86 ], [ Shark, .10 ], [ Tuna, .82 ]
        ]),
        [Time.Month.September]: new Map([
            [ Sardine, .17 ], [ Eel, .53 ], [ Lionfish, .51 ], [ Mackerel, .89 ],
            [ Cod, .54 ], [ SeaBass, .82 ], [ Grouper, .88 ], [ Halibut, .97 ],
            [ Barracuda, .75 ], [ Shark, .78 ], [ Tuna, .70 ]
        ]),
        [Time.Month.October]: new Map([
            [ Sardine, .31 ], [ Eel, .59 ], [ Lionfish, .48 ], [ Mackerel, .89 ],
            [ Cod, .91 ], [ SeaBass, .87 ], [ Grouper, .98 ], [ Halibut, .34 ],
            [ Barracuda, .37 ], [ Shark, .79 ], [ Tuna, .99 ]
        ]),
        [Time.Month.November]: new Map([
            [ Sardine, .19 ], [ Eel, .34 ], [ Lionfish, .96 ], [ Mackerel, .43 ],
            [ Cod, .86 ], [ SeaBass, .91 ], [ Grouper, .83 ], [ Halibut, .20 ],
            [ Barracuda, .38 ], [ Shark, .20 ], [ Tuna, .64 ]
        ]),
        [Time.Month.December]: new Map([
            [ Sardine, .35 ], [ Eel, .89 ], [ Lionfish, 1 ], [ Mackerel, .24 ],
            [ Cod, .18 ], [ SeaBass, .29 ], [ Grouper, .89 ], [ Halibut, .49 ],
            [ Barracuda, .47 ], [ Shark, .48 ], [ Tuna, .96 ]
        ]),
        "list": [ Sardine, Eel, Lionfish, Mackerel, Cod, SeaBass, Grouper, Halibut, Barracuda, Shark, Tuna ]
    };
};
linker.goto(Biome).link(DeepWater);

export {
    Biome,
    TemperateGrassland,
    TropicalGrassland,
    Shrubland,
    Scrubland,
    TemperateForest,
    MontaneForest,
    SubtropicalForest,
    MangroveForest,
    TropicalRainforest,
    Mudflat,
    ShallowWater,
    DeepWater
};