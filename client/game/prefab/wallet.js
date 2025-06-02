import linker from "../linker.js";

import Prefab from "./prefab.js";

import format_number from "../../module/format-number.js";
import Text from "../../module/text.js";

export default class Wallet extends Prefab {
    static id = "prefab.wallet";
    static name = new Text("Wallet");
    static description = new Text("A wallet to hold your money.").plural(false);

    balance = 0;

    capture(game, event) {
        if (event.type === "wallet_change")
            document.qs("div#game>div.ui>span.wallet").textContent = format_number(this.balance);
    };

    static format = {
        ...Prefab.format,
        balance: { required: true, test: v => typeof v === "number" && v >= 0 },
    };
};
linker.link(Wallet);