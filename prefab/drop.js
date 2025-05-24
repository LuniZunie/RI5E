import Prefab from "./prefab.js";
import Item from "./item.js";

export default class Drop extends Prefab {
    static yield = NaN;
    static item = class extends Item {};
};