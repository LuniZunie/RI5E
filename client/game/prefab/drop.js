import linker from "../linker.js";

import Text from "../../module/text.js";

import Prefab from "./prefab.js";
import Item from "./item.js";

export default class Drop extends Prefab {
    static id = "prefab.drop";

    static yield = NaN;
    static item = class extends Item {};
};
linker.link(Drop);
linker.link(Drop);