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

// TODO: add more water biomes, and a desert

export default class Biome extends Prefab {
    static id = "prefab.biome";

    static sprite = "";
    static climate;

    static forageables = [];
    static fishes = [];

    element;
    x; y;
    climate;
    distance;
    locked = true;
    forageables = [];

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
                    return; // no forageables to check

                const temp = [];
                let changed = false;
                for (const forageable of target) {
                    const thisForageable = this.forageables.find(f => f.constructor.id === forageable.id) || new forageable();
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
    static fishes = [];
};
linker.goto(Biome).link(ShallowWater);

class DeepWater extends Biome {
    static id = "prefab.biome.deep_water";
    static name = new Text("deep water");
    static description = new Text("A body of deep water.").plural(false);

    static sprite = "#1e6f9c";

    static climate = define(Climate, {
        altitude: 0.1,
        temperature: 0.1,
        humidity: 0.9,
    });

    static forageables = [];
    static fishes = [];
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