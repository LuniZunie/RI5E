import linker from "./linker.js";
import Prefab from "./prefab.js";
import Variable from "../module/variable.js";

export default class Item extends Prefab {
    static buyable = false;
    static buy_price = new Variable();

    static sellable = false;
    static sell_price = new Variable();
};
linker.link(Item);