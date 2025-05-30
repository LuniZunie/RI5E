import linker from "../linker.js";

import Prefab from "./prefab.js";

export default class Clock extends Prefab {
    static id = "prefab.clock";

    display_clock = null;
};
linker.link(Clock);