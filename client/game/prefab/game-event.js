import linker from "../linker.js";

import Prefab from "./prefab.js";

export default class GameEvent extends Prefab {
    static id = "prefab.game_event";
    static type = "default";

    static prefabs = new Map();
    static connect(prefab, c = 1) {
        const ref = `${this.id}.connect`;
        if (!(prefab instanceof Prefab))
            throw new Error(`${ref}: Could not connect non-prefab object to event.`);
        else if (this.prefabs.has(prefab))
            throw new Error(`${ref}: Event already has prefab.`);
        else if (!(Number.isInteger(c) && c > 0))
            throw new Error(`${ref}: Event count is invalid`);
        this.prefabs.set(prefab, { at: 0n, to: BigInt(c) });
    };
    static disconnect(prefab) {
        const ref = `${this.id}.connect`;
        if (!(prefab instanceof Prefab))
            throw new Error(`${ref}: Could not disconnect non-prefab object from event.`);
        else if (!this.prefabs.has(prefab))
            throw new Error(`${ref}: Event does not have prefab.`);
        this.prefabs.delete(prefab);
    };
    static trigger(game) {
        for (const [ prefab, c ] of this.prefabs.entries()) // TODO: might not need *.entries()
            if ((c.at = (c.at + 1n) % c.to) === 0n)
                prefab.capture?.(game, this);
    };
}
linker.link(GameEvent);

/* ---TIME EVENTS--- */

class TickEvent extends GameEvent {
    static id = "prefab.game_event.tick";
    static type = "tick";

    static prefabs = new Map();
}
linker.goto(GameEvent).link(TickEvent);


class DayChangeEvent extends GameEvent {
    static id = "prefab.game_event.day_change";
    static type = "day_change";

    static prefabs = new Map();
}
linker.goto(GameEvent).link(DayChangeEvent);

class WeekChangeEvent extends GameEvent {
    static id = "prefab.game_event.week_change";
    static type = "week_change";

    static prefabs = new Map();
}
linker.goto(GameEvent).link(WeekChangeEvent);

class MonthChangeEvent extends GameEvent {
    static id = "prefab.game_event.month_change";
    static type = "month_change";

    static prefabs = new Map();
}
linker.goto(GameEvent).link(MonthChangeEvent);

class SeasonChangeEvent extends GameEvent {
    static id = "prefab.game_event.season_change";
    static type = "season_change";

    static prefabs = new Map();
}
linker.goto(GameEvent).link(SeasonChangeEvent);

class SemesterChangeEvent extends GameEvent {
    static id = "prefab.game_event.semester_change";
    static type = "semester_change";

    static prefabs = new Map();
}
linker.goto(GameEvent).link(SemesterChangeEvent);

class YearChangeEvent extends GameEvent {
    static id = "prefab.game_event.year_change";
    static type = "year_change";

    static prefabs = new Map();
}
linker.goto(GameEvent).link(YearChangeEvent);


/* ---INTERFACE EVENTS--- */
class WalletChangeEvent extends GameEvent {
    static id = "prefab.game_event.wallet_change";
    static type = "wallet_change";

    static prefabs = new Map();
}
linker.goto(GameEvent).link(WalletChangeEvent);

export {
    TickEvent,

    DayChangeEvent,
    WeekChangeEvent,
    MonthChangeEvent,
    SeasonChangeEvent,
    SemesterChangeEvent,
    YearChangeEvent,


    WalletChangeEvent
};