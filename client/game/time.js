import bin from "../module/bin.js";
import Game from "./game.js";
export default class Time {
    static #ticks_per_second = 20;
    static #seconds_per_day = 10;

    static second = n => n * Time.#ticks_per_second; // 20 ticks (1s)
    static day = n => Time.second(n * Time.#seconds_per_day); // 200 ticks (10s)
    static week = n => Time.day(n * 7); // 1,400 ticks (1m10s)
    static month = n => Time.week(n * 4); // 5,600 ticks (4m40s)
    static season = n => Time.month(n * 3); // 22,400 ticks (14m00s)
    static semester = n => Time.season(n * 2); // 44,800 ticks (28m00s)
    static year = n => Time.semester(n * 2); // 89,600 ticks (56m00s)

    static Month;
    static Season;
    static Semester;
    static Year;

    static {
        this.Month = class {
            static March = bin(0);
            static April = bin(1);
            static May = bin(2);
            static June = bin(3);
            static July = bin(4);
            static August = bin(5);
            static September = bin(6);
            static October = bin(7);
            static November = bin(8);
            static December = bin(9);
            static January = bin(10);
            static February = bin(11);

            static order = [
                "March", "April", "May",
                "June", "July", "August",
                "September", "October", "November",
                "December", "January", "February"
            ];
        }

        const M = this.Month;
        this.Season = class {
            static Spring = M.March | M.April | M.May;
            static Summer = M.June | M.July | M.August;
            static Autumn = M.September | M.October | M.November;
            static Winter = M.December | M.January | M.February;

            static order = [ "Spring", "Summer", "Autumn", "Winter" ];
        }

        const S = this.Season;
        this.Semester = class {
            static Warm = S.Spring | S.Summer;
            static Cold = S.Autumn | S.Winter;

            static order = [ "Warm", "Cold" ];
        }
        this.Year = S.Spring | S.Summer | S.Autumn | S.Winter;
    }

    static get TPS() { return Time.#ticks_per_second; }

    static #time = { value: Date.now(), when: Date.now() };
    static sync_time = (value, when) => {
        Time.#time.value = value || Date.now();
        Time.#time.when = when || Date.now();
    }

    static get now() {
        const elapsed = Date.now() - Time.#time.when;
        return Time.#time.value + elapsed;
    }

    static getDay(tick = Game.tick) {
        return Math.floor(tick / Time.day(1)) % (Time.month(1) / Time.day(1)) + 1;
    }
    static getWeek(tick = Game.tick) {
        return Math.floor(tick / Time.week(1)) % (Time.month(1) / Time.week(1)) + 1;
    }
    static getMonth(tick = Game.tick) {
        return Time.Month.order[Math.floor(tick / Time.month(1)) % Time.Month.order.length];
    }
    static getSeason(tick = Game.tick) {
        return Time.Season.order[Math.floor(tick / Time.season(1)) % Time.Season.order.length];
    }
    static getSemester(tick = Game.tick) {
        return Time.Semester.order[Math.floor(tick / Time.semester(1)) % Time.Semester.order.length];
    }
    static getYear(tick = Game.tick) {
        return Math.floor(tick / Time.year(1)) + 1;
    }
}