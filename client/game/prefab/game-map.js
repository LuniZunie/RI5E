import linker from "../linker.js";

import Climate from "../../module/climate.js";
import define from "../../module/define.js";
import DimensionMap from "../../module/dimension-map.js";
import Linker from "../../module/linker.js";
import prandom from "../../module/prandom.js";
import Text from "../../module/text.js";
import UUID from "../../module/uuid.js";

import Prefab from "./prefab.js";
import Biome, { TemperateGrassland, Water } from "./biome.js";
import GameEvent, {
    TickEvent,

    DayChangeEvent,
    WeekChangeEvent,
    MonthChangeEvent,
    SeasonChangeEvent,
    SemesterChangeEvent,
    YearChangeEvent,

    WalletChangeEvent
} from "./game-event.js";

export default class GameMap extends Prefab {
    static #size = 6;

    static id = "prefab.game_map";
    static name = new Text("map");
    static description = new Text("The game map of the world.").plural(false);

    seed = UUID();
    map = new DimensionMap(2 ** GameMap.#size, 2 ** GameMap.#size).offset("center", "center");

    static format = {
        ...Prefab.format,
        seed: { required: true, test: v => typeof v === "string" && v.length > 0 },
    };

    generate(game) {
        const Biomes = linker.goto(Biome).list(Linker.Terminus, 1);

        const biomes = game.user.find(Biome);
        const current_map = {};
        for (const biome of biomes)
            current_map[`${biome.x},${biome.y}`] = biome;

        const bin_size = GameMap.#size, size = 2 ** bin_size;

        const prng = prandom(this.seed);
        const noise = Object.fromEntries(Object.keys(Climate.measurements).map(k => [ k, Climate.noise(prng, bin_size, 1) ]));
        const [ cx, cy ] = [ (size - 1) / 2, (size - 1) / 2 ];

        const len = size ** 2;
        const map = new Array(len).fill(null);
        for (let i = 0; i < len; i++) {
            const climate_obj = {};
            for (const k of Object.keys(Climate.measurements))
                climate_obj[k] = noise[k][i];

            const [ x, y ] = [ i % size, Math.floor(i / size) ];
            const key = `${x},${y}`;

            const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
            const climate = define(Climate, climate_obj).combine(TemperateGrassland.climate, 1 - dist / (size / 15));

            const match = climate.altitude < 0.1 ?
                Water : Biomes.map(biome => [ biome, biome.climate.compare(climate) ]).sort((a, b) => a[1] - b[1])[0][0];

            let biome = current_map[key];
            if (!biome || !(biome instanceof match && define(Climate, biome.climate).compare(climate) === 0)) { // biome not found or not matching
                if (biome) {
                    console.warn(`GameMap: Found existing biome at ${key} but it does not match the new biome.`);
                    game.user.remove(biome);
                }
                console.log(`GameMap: Generating biome at ${key}.`);

                biome = define(match, {
                    x, y, climate,
                    distance: dist,
                    locked: !((x === Math.floor(cx) || x === Math.ceil(cx)) && (y === Math.floor(cy) || y === Math.ceil(cy)))
                });
                game.user.add(biome);
            }

            DayChangeEvent.connect(biome); // biome will generate forageables on day change
            map[y * size + x] = biome;
        }
        this.map.set(map);
    }
};
linker.link(GameMap);