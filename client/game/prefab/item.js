import linker from "../linker.js";

import Text from "../../module/text.js";
import Variable from "../../module/variable.js";

import Prefab from "./prefab.js";

export default class Item extends Prefab {
    static id = "prefab.item";

    static buyable = false;
    static buy_price = new Variable();

    static sellable = false;
    static sell_price = new Variable();
};
linker.link(Item);