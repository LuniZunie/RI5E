import "../module/array.js";
import "../module/object.js";
import bin from "../module/bin.js";
import Climate from "../module/climate.js";
import define from "../module/define.js";
import DisplayClock from "../module/display-clock.js";
import Linker from "../../module/linker.js";
import Text from "../module/text.js";
import Variable from "../module/variable.js";
import UUID from "../module/uuid.js";
import format_number, { parse_formatted_number } from "../module/format-number.js";

import Notification from "./function/notification.js";
import Page, { Pages } from "./function/page.js";

import linker from "./linker.js";
import Time from "./time.js";
import User from "./user.js";

import Prefab from "./prefab/prefab.js";
import Item from "./prefab/item.js";
import Drop from "./prefab/drop.js";
import Tree from "./prefab/tree.js";
import GameMap from "./prefab/game-map.js";
import Clock from "./prefab/clock.js";
import Wallet from "./prefab/wallet.js";

import GameEvent, {
    TickEvent,

    DayChangeEvent,
    WeekChangeEvent,
    MonthChangeEvent,
    SeasonChangeEvent,
    SemesterChangeEvent,
    YearChangeEvent,

    WalletChangeEvent
} from "./prefab/game-event.js";
import { encodeJSON, decodeJSON } from "../global/module/base64.js";

export default class Game {
    static TPS = Time.TPS; // ticks per second
    static SPT = 1 / Time.TPS; // seconds per tick

    static get tick() {
        return Math.floor(Time.now / 1000 * Game.TPS);
    }
    static get day() {
        return Math.floor(Game.tick / Time.day(1)) % (Time.month(1) / Time.day(1)) + 1;
    }
    static get week() {
        return Math.floor(Game.tick / Time.week(1)) % (Time.month(1) / Time.week(1)) + 1;
    }
    static get month() {
        return Time.Month.order[Math.floor(Game.tick / Time.month(1)) % Time.Month.order.length];
    }
    static get season() {
        return Time.Season.order[Math.floor(Game.tick / Time.season(1)) % Time.Season.order.length];
    }
    static get semester() {
        return Time.Semester.order[Math.floor(Game.tick / Time.semester(1)) % Time.Semester.order.length];
    }
    static get year() {
        return Math.floor(Game.tick / Time.year(1)) + 1;
    }

    #pause = {
        import: false,
        export: false,
    };

    #instance;
    #user = new User("0", "johndoe@example.com", "John Doe", "Anonymous", null);

    #map;
    #view;

    #clocks = {
        season: null,
        month: null,
        day: null,
    };

    #cache = {
        day: Game.day,
        week: Game.week,
        month: Game.month,
        season: Game.season,
        semester: Game.semester,
        year: Game.year,
    };

    constructor(O) {
        this.#instance = UUID();
        if (O.user instanceof User)
            this.#user = O.user;
        else { // TODO: error popup
            console.error("Game: User data is required to initialize the game.");
            return;
        }

        if (O.container instanceof HTMLElement)
            this.#view = O.container;
        else
            this.#view = document.querySelector(O.container) || document.body;
    }

    get instance() { return this.#instance; }
    get user() { return this.#user; }
    get map() { return this.#map.map; }

    async init(hash) {
        const top_bar = this.#view.querySelector("div.top-bar");
        top_bar.querySelector("div.user-info>span.username").textContent = this.#user.username;
        top_bar.querySelector("div.user-info>div.avatar>img").src = this.user.avatar;

        { // season clock
            const clock = new DisplayClock("season-clock", DisplayClock.UPPERCASE, ...Array.repeat(DisplayClock.LOWERCASE, 5));
            document.qs("div#game>div.top-bar>div.title>span.date>span.season").appendChild(clock.element);
            clock.resize();
            this.#clocks.season = define(Clock, {
                display_clock: clock,
                capture(game, event) {
                    if (Object.is(event, SeasonChangeEvent))
                        clock.display(game.constructor.season, Array.repeat("AUTOx1", 6));
                }
            });

            SeasonChangeEvent.connect(this.#clocks.season);
            this.#clocks.season.capture(this, SeasonChangeEvent);
        }

        { // month clock
            const clock = new DisplayClock("month-clock", DisplayClock.UPPERCASE, ...Array.repeat(DisplayClock.LOWERCASE, 2));
            document.qs("div#game>div.top-bar>div.title>span.date>span.month").appendChild(clock.element);
            clock.resize();
            this.#clocks.month = define(Clock, {
                display_clock: clock,
                capture(game, event) {
                    if (Object.is(event, MonthChangeEvent))
                        clock.display(game.constructor.month.slice(0, 3), Array.repeat("AUTOx1", 3));
                }
            });

            MonthChangeEvent.connect(this.#clocks.month);
            this.#clocks.month.capture(this, MonthChangeEvent);
        }

        { // day clock
            const clock = new DisplayClock("day-clock", "012", DisplayClock.DECIMAL);
            document.qs("div#game>div.top-bar>div.title>span.date>span.day").appendChild(clock.element);
            clock.resize();
            this.#clocks.day = define(Clock, {
                display_clock: clock,
                capture(game, event) {
                    if (Object.is(event, DayChangeEvent))
                        clock.display(game.constructor.day.toString().padStart(2, "0"), "INC");
                }
            });

            DayChangeEvent.connect(this.#clocks.day);
            this.#clocks.day.capture(this, DayChangeEvent);
        }

        await this.import();

        { // game map
            const id = this.#user.inventory.findByType(GameMap).values().next().value;
            this.#map = this.#user.inventory.findById(id) || null;
            if (!this.#map) {
                this.#map = new GameMap();
                this.#user.inventory.add(this.#map);
            }
            this.#map.generate(this);
        }

        { // wallet
            const id = this.#user.inventory.findByType(Wallet).values().next().value;
            let wallet = this.#user.inventory.findById(id) || null;
            if (!wallet) {
                wallet = new Wallet();
                this.#user.inventory.add(wallet);
            }

            WalletChangeEvent.connect(wallet);
            wallet.capture(this, WalletChangeEvent);
        }

        await this.export();

        return this;
    }

    hash(hash) { this.view(Pages[hash.slice(1)] || Pages.home); }

    view(page) {
        if (!(page instanceof Page))
            page = new Page("error");

        document.body.dataset.page = page.name;
        window.location.hash = page.name;
        page.draw(this.#view, this);
    }

    async import() {
        if (Object.any(this.#pause)) return false;
        this.#pause.import = true;

        await fetch("api/user/data", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            cache: "no-store"
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => this.#user.inventory.import(data?.inventory))
            .catch(error => console.error("Game: Failed to load user data:", error))
            .finally(() => { this.#pause.loading = false; });
        return true;
    }

    async export() {
        if (Object.any(this.#pause)) return false;
        this.#pause.export = true;

        const { added, changed, removed } = this.#user.inventory.export();
        if (!(added.length | changed.length | removed.length))
            return true; // nothing to export

        const body = { added, changed, removed };
        await fetch("api/user/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(body),
            cache: "no-store"
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .catch(error => console.error("Game: Failed to save user data:", error))
            .finally(() => { this.#pause.export = false; });
        return true;
    }

    pay(cost) {
        try {
            cost = parse_formatted_number(cost);
        } catch (e) {
            console.error("Game: Invalid cost format:", cost, e);
            return false;
        }

        const id = this.#user.inventory.findByType(Wallet).values().next().value;
        const wallet = this.#user.inventory.findById(id) || null;
        if (!wallet) {
            wallet = new Wallet();
            this.#user.inventory.add(wallet);
            WalletChangeEvent.connect(wallet);
            wallet.capture(this, WalletChangeEvent);
        }

        const balance = parse_formatted_number(format_number(wallet.balance));
        if (balance < cost) {
            Notification.error("Not enough funds for this purchase.");
            return false;
        } else {
            this.#user.inventory.change(wallet, w => { w.balance = balance - cost; });
            WalletChangeEvent.trigger(wallet);
            return true;
        }
    }

    sell(price) {
        const id = this.#user.inventory.findByType(Wallet).values().next().value;
        const wallet = this.#user.inventory.findById(id) || null;
        if (!wallet) {
            wallet = new Wallet();
            this.#user.inventory.add(wallet);
            WalletChangeEvent.connect(wallet);
            wallet.capture(this, WalletChangeEvent);
        }

        this.#user.inventory.change(wallet, w => { w.balance += price; });
        WalletChangeEvent.trigger(wallet);
    }

    async #smooth_scroll(el, dist, time, callback = () => true) {
        if (dist === 0) return Promise.resolve([ 0, 0 ]); // no scrolling needed

        const start = el.scrollLeft, end = start + dist;
        const step = dist / time; // pixels per millisecond

        let resolve;
        const promise = new Promise(res => resolve = res);
        const deadline = Date.now() + time;

        const scroll = () => {
            const now = Date.now();
            const progress = Math.min(1, (now - (deadline - time)) / time);

            const pos = start + progress * dist;
            if (now >= deadline) {
                el.scrollLeft = end; // ensure we reach the end
                resolve([ 0, 0 ]);
            } else if (!callback(el, pos))
                resolve([ dist - (pos - start), Math.max(0, deadline - now) ]);
            else {
                el.scrollLeft = pos;
                requestAnimationFrame(scroll); // continue scrolling
            }
        };

        requestAnimationFrame(scroll); // start scrolling
        return promise;
    }

    update() {
        TickEvent.trigger(this);

        const { day, week, month, season, semester, year } = Game;
        if (this.#cache.day !== day) {
            DayChangeEvent.trigger(this);
            this.export(); // export user data on day change
        }
        if (this.#cache.week !== week) WeekChangeEvent.trigger(this);
        if (this.#cache.month !== month) MonthChangeEvent.trigger(this);
        if (this.#cache.season !== season) SeasonChangeEvent.trigger(this);
        if (this.#cache.semester !== semester) SemesterChangeEvent.trigger(this);
        if (this.#cache.year !== year) YearChangeEvent.trigger(this);

        document.qsa("*.auto-scroll").forEach(el => {
            let speed = parseFloat(el.dataset.scrollSpeed) || 5;
            let carry = (parseFloat(el.dataset.scrollCarry) || 0) + speed;

            speed = Math.floor(carry);
            el.dataset.scrollCarry = carry % 1;

            let scrollEls = el.qsa("span.scroll-text").length;
            if (scrollEls === 0) {
                const scrollText = document.createElement("span");
                scrollText.className = "scroll-text";
                scrollText.textContent = el.textContent;
                el.textContent = "";
                el.appendChild(scrollText);
                scrollEls = 1;
            }

            const scrollText = el.qs("span.scroll-text");
            const cs = getComputedStyle(scrollText);

            const textWidth = el.text_width(scrollText.textContent) + ((parseFloat(cs.marginLeft) || 0) + (parseFloat(cs.marginRight) || 0));
            const containerWidth = el.clientWidth;

            if (textWidth < containerWidth)
                return el.qsa("span.scroll-text:not(:first-child)").forEach(e => e.remove());

            const minElements = Math.ceil(containerWidth / textWidth) + 1;
            const n = minElements - scrollEls;
            if (n > 0) scrollText.duplicate(n);
            else if (n < 0) {
                const scrollTexts = el.qsa("span.scroll-text");
                for (let i = 0; i < -n; i++)
                    if (scrollTexts[i]) scrollTexts[i].remove();
            }

            const scroll = (el, dist, time) => {
                this.#smooth_scroll(el, dist, time, (el, pos) => {
                    const loopLen = textWidth;
                    if (pos >= loopLen) {
                        el.scrollLeft = pos % loopLen;
                        return false;
                    }
                    return true;
                }).then(([ rDist, rTime ]) => {
                    if (rDist > 0)
                        scroll(el, rDist, rTime); // continue scrolling with the remaining distance and time
                });
            };

            scroll(el, speed, Game.SPT * 1000); // scroll at the speed defined by data-scroll-speed attribute
        });

        this.#cache.day = day;
        this.#cache.week = week;
        this.#cache.month = month;
        this.#cache.season = season;
        this.#cache.semester = semester;
        this.#cache.year = year;
    }
};