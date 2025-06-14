/*
    IDEAS
    - Holy Mackerel!
        - Catch a mackerel > 1kg
        - ~1.9% chance
    - Masterbaited
        - Catch a fish using master bait
    - Professional Masterbaiter
        - Catch one of each fish using master bait
*/

import linker from "../linker.js";

import Text from "../../module/text.js";

import Prefab from "./prefab.js";
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

export default class Achievement extends Prefab {
    static id = "prefab.achievement";

    completed = false;
    progress = "";

    static format = {
        ...Prefab.format,
        completed: { required: true, test: v => typeof v === "boolean" },
        progress: { required: true, test: v => typeof v === "string" }
    };
};