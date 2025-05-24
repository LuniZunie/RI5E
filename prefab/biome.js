import $ from "../module/define.js";
import Prefab from "./prefab.js";
import Text from "../module/text.js";
import Climate from "../module/climate.js";
import { Grass, Clover, Dandelion, Mushroom, Blackberry, Raspberry, Blueberry, Grape, Strawberry, Banana, Apple, Orange, Peach, Lemon, Lime, Cherry, Pineapple, Coconut } from "./forageable.js";

export default class Biome extends Prefab {
    static sprite = "";

    static climate;

    static forageables = [];
    static fishable = false;

    climate;
    distance;
    locked = true;
};

export class TemperateGrassland extends Biome {
    static id = "biome:temperate_grassland";
    static name = new Text("temperate grassland");
    static description = new Text("a wide, open area with grass and few trees");

    static sprite = "#88c070";

    static climate = $(Climate, {
        altitude: 0.5,
        temperature: 0.5,
        humidity: 0.5,
    });

    static forageables = [ Grass, Clover, Dandelion, Blackberry, Grape, Strawberry, Apple, Cherry ];
};
export class TropicalGrassland extends Biome {
    static id = "biome:tropical_grassland";
    static name = new Text("tropical grassland");
    static description = new Text("a warm, open area with tall grass and scattered trees");

    static sprite = "#b8d07d";

    static climate = $(Climate, {
        altitude: 0.5,
        temperature: 0.6,
        humidity: 0.8,
    });

    static forageables = [ Grass, Banana, Orange, Lemon, Lime, Pineapple, Coconut ];
};

export class Shrubland extends Biome {
    static id = "biome:shrubland";
    static name = new Text("shrubland");
    static description = new Text("a dry, open area with scattered shrubs");

    static sprite = "#c2a662";

    static climate = $(Climate, {
        altitude: 0.7,
        temperature: 0.9,
        humidity: 0.1,
    });

    static forageables = [ Grass, Clover, Dandelion, Mushroom, Blackberry, Raspberry, Grape, Strawberry, Apple, Peach, Cherry ];
};
export class Scrubland extends Biome {
    static id = "biome:scrubland";
    static name = new Text("scrubland");
    static description = new Text("a dry, open area with low shrubs and grasses");

    static sprite = "#b79e68";

    static climate = $(Climate, {
        altitude: 0.3,
        temperature: 0.8,
        humidity: 0.3,
    });

    static forageables = [ Grass, Blackberry, Grape, Orange, Lemon, Lime ];
};

export class TemperateForest extends Biome {
    static id = "biome:temperate_forest";
    static name = new Text("temperate forest");
    static description = new Text("a dense, wooded area with a variety of plants");

    static sprite = "#4b8b3b";

    static climate = $(Climate, {
        altitude: 0.5,
        temperature: 0.6,
        humidity: 0.3,
    });

    static forageables = [ Grass, Clover, Dandelion, Mushroom, Blackberry, Raspberry, Blueberry, Grape, Strawberry, Apple, Peach, Cherry ];
};
export class MontaneForest extends Biome {
    static id = "biome:montane_forest";
    static name = new Text("montane forest");
    static description = new Text("a forest located in mountainous regions with diverse flora");

    static sprite = "#44695f";

    static climate = $(Climate, {
        altitude: 1,
        temperature: 0.2,
        humidity: 0.5,
    });

    static forageables = [ Grass, Clover, Dandelion, Mushroom, Blackberry, Raspberry, Blueberry, Grape, Strawberry, Apple, Orange, Peach, Lemon, Lime, Cherry ];
};
export class SubtropicalForest extends Biome {
    static id = "biome:subtropical_forest";
    static name = new Text("subtropical forest");
    static description = new Text("a warm, humid forest with lush vegetation");

    static sprite = "#5aa85c";

    static climate = $(Climate, {
        altitude: 0.4,
        temperature: 0.8,
        humidity: 0.7,
    });

    static forageables = [ Grass, Mushroom, Blackberry, Raspberry, Blueberry, Grape, Strawberry, Banana, Apple, Orange, Peach, Lemon, Lime, Cherry, Pineapple, Coconut ];
};
export class MangroveForest extends Biome {
    static id = "biome:mangrove_forest";
    static name = new Text("mangrove forest");
    static description = new Text("a coastal forest with salt-tolerant trees");

    static sprite = "#417760";

    static climate = $(Climate, {
        altitude: 0.2,
        temperature: 0.7,
        humidity: 0.9,
    });

    static forageables = [ Pineapple, Coconut ];
};

export class TropicalRainforest extends Biome {
    static id = "biome:tropical_rainforest";
    static name = new Text("tropical rainforest");
    static description = new Text("a dense, humid forest with a high diversity of plants and animals");

    static sprite = "#2f844c";

    static climate = $(Climate, {
        altitude: 0.4,
        temperature: 0.8,
        humidity: 0.8,

    });

    static forageables = [ Grass, Mushroom, Grape, Banana, Orange, Lemon, Lime, Pineapple, Coconut ];
};

export class Water extends Biome {
    static id = "biome:water";
    static name = new Text("water");
    static description = new Text("a body of water, such as a river, lake, or ocean");

    static sprite = "#3ca9dd";

    static climate = $(Climate, {
        altitude: 0,
        temperature: 0.3,
        humidity: 1,
    });

    static forageables = [];
    static fishable = true;
};