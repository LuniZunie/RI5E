import bin from '../module/bin.js';

export default class Time {
    static #seconds_per_day = 10;
    static day = n => n*Time.#seconds_per_day; // 10s
    static week = n => Time.day(n*7); // 1m10s
    static month = n => Time.week(n*4); // 4m40s
    static season = n => Time.month(n*3); // 14m00s
    static year = n => Time.season(n*4); // 56m00s

    static Month = class Month {
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
    };
    static Season = class Season {
        static Spring = Time.Month.March & Time.Month.April & Time.Month.May;
        static Summer = Time.Month.June & Time.Month.July & Time.Month.August;
        static Autumn = Time.Month.September & Time.Month.October & Time.Month.November;
        static Winter = Time.Month.December & Time.Month.January & Time.Month.February;
    };
    static Year = Time.Season.Spring & Time.Season.Summer & Time.Season.Autumn & Time.Season.Winter;
};