import linker from "../linker.js";

import "../../module/object.js";
import Climate from "../../module/climate.js";
import define from "../../module/define.js";
import Text from "../../module/text.js";
import Variable from "../../module/variable.js";

import Prefab from "./prefab.js";
import {
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

export default class Biome extends Prefab {
    static id = "prefab.biome";

    static sprite = "";
    static climate;

    static forageables = [];
    static fishable = false;

    x; y;
    climate;
    distance;
    locked = true;

    static format = {
        x: { required: true, test: v => Number.isInteger(v) },
        y: { required: true, test: v => Number.isInteger(v) },
        climate: { required: true, test: v => Object.match(v, Climate.format) },
        distance: { required: true, test: v => Number.isFinite(v) && v >= 0 },
        locked: { required: false, test: v => typeof v === "boolean" }
    };
};
linker.link(Biome);

class TemperateGrassland extends Biome {
    static id = "prefab.biome.temperate_grassland";
    static name = new Text("temperate grassland");
    static description = new Text("A wide, open area with grass and few trees.").plural(false);

    static sprite = "#88c070";

    static climate = define(Climate, {
        altitude: 0.5,
        temperature: 0.5,
        humidity: 0.5,
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
        humidity: 0.8,
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
        altitude: 0.7,
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
        altitude: 0.3,
        temperature: 0.8,
        humidity: 0.3,
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
        altitude: 0.5,
        temperature: 0.6,
        humidity: 0.3,
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
        altitude: 1,
        temperature: 0.2,
        humidity: 0.5,
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
        humidity: 0.7,
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
        altitude: 0.2,
        temperature: 0.7,
        humidity: 0.9,
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
        temperature: 0.8,
        humidity: 0.8,

    });

    static forageables = [ Grass, Mushroom, Grape, Banana, Orange, Lemon, Lime, Pineapple, Coconut ];
};
linker.goto(Biome).link(TropicalRainforest);

class Water extends Biome {
    static id = "prefab.biome.water";
    static name = new Text("water");
    static description = new Text("A body of water, such as a river, lake, or ocean.").plural(false);

    static sprite = "#3ca9dd";

    static climate = define(Climate, {
        altitude: 0,
        temperature: 0.3,
        humidity: 1,
    });

    static forageables = [];
    static fishable = true;
};
linker.goto(Biome).link(Water);

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
    Water
};