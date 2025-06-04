import linker from "../linker.js";
import Time from "../time.js";

import Text from "../../module/text.js";
import Variable from "../../module/variable.js";

import Prefab from "./prefab.js";
import Item from './item.js';
import Drop from './drop.js';

export default class Fish extends Prefab {
    static id = "prefab.fish";

    static season = 0;
    static time = NaN;

    static drop = class extends Drop {};
};
linker.link(Fish);