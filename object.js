const $ = function(construct, o) {
    const tmp = new construct();
    for (const [ k, v ] of Object.entries(o)) {
        if (k in tmp) tmp[k] = v;
        else throw new Error('invalid definition');
    }
    return tmp;
};
const bin = n => 2**n;

class Time {
    static #seconds_per_day = 10;
    static {
        const day = n => n*Time.#seconds_per_day; // 10s
        const week = n => Time.day(n*7); // 1m10s
        const month = n => Time.week(n*4); // 4m40s
        const season = n => Time.month(n*3); // 14m00s
        const year = n => Time.season(n*4); // 56m00s

        const Month = class Month {
            static {
                March = bin(0);
                April = bin(1);
                May = bin(2);
                June = bin(3);
                July = bin(4);
                August = bin(5);
                September = bin(6);
                October = bin(7);
                November = bin(8);
                December = bin(9);
                January = bin(10);
                February = bin(11);
            };
        };
        const Season = class Season {
            static {
                Spring = Time.Month.March & Time.Month.April & Time.Month.May;
                Summer = Time.Month.June & Time.Month.July & Time.Month.August;
                Autumn = Time.Month.September & Time.Month.October & Time.Month.November;
                Winter = Time.Month.December & Time.Month.January & Time.Month.February;
            };
        };
        const Year = Time.Season.Spring & Time.Season.Summer & Time.Season.Autumn & Time.Season.Winter;
    };
};

class Variable {
    #fn = () => NaN;
    #round = NaN;
    constructor(type='static', ...args) {
        [type,this.#round=NaN] = type.split(':');

        let v,mn,mx,dif,mean,variance;
        switch (type) {
            case 'static':
                [v=NaN] = args;
                this.#fn = () => v;
                break;
            case 'range':
                [mn,mx] = args;
                this.#fn = () => Math.random() * (mx - mn + 1) + mn;
                break;
            case 'error':
                [v,dif] = args;
                [mn,mx] = [v-dif,v+dif];
                this.#fn = () => Math.random() * (mx - mn + 1) + mn + v;
                break;
            case 'variance:2':
                [mean,variance] = args;
                const [_sqrtMean,_logVariance] = [Math.sqrt(mean), Math.log(variance)]; // constants
                this.#fn = () => mean + Math.log(Math.random()+Number.EPSILON) / _logVariance * _sqrtMean * (Math.random() < 0.5 ? -1 : 1);
                break;
            default:
                this.#fn = () => NaN;
                break;
        }
    };

    get value() {
        const b10 = 10**this.#round;
        return Math.max(Number.EPSILON,1/b10, Math.floor((this.#fn()||0) * b10) / b10);
    };
};

class Prefab {
    static id = "ERROR";
    static name = "<none>";
    static description = "<none>";
};
class Item extends Prefab {
    static buyable = false;
    static buy_price = new Variable();

    static sellable = false;
    static sell_price = new Variable();
};
class Drop extends Prefab {
    static yield = NaN;
    static item = class extends Item {};
};

// foraging
class Forageable extends Item {
    static season = 0;
    static time = NaN;

    static drop = class extends Drop {};
};
class Grass extends Forageable {
    static id = "forageable:grass";
    static name = "Grass";

    static season = Time.Year;
    static time = new Variable('static:0', Time.day(1));

    static drop = class extends Drop {
        static id = "forageable:grass:drop#Drop";
        static name = "Grass (kg)";

        static yield = new Variable('static:0', 1);
        static item = class extends Item {
            static id = "forageable:grass:drop";
            static name = "Grass (kg)";

            static sellable = true;
            static sell_price = new Variable('range:2', 0.01, .001);
        };
    };
};
class Clover extends Forageable {
    static id = "forageable:clover";
    static name = "Clover";

    static season = Time.Year;
    static time = new Variable('error:0', Time.day(4), Time.day(1));

    static drop = class extends Drop {
        static id = "forageable:clover:drop#Drop";
        static name = "Clover (kg)";

        static yield = new Variable('variance:0', 5, .05);
        static item = class extends Item {
            static id = "forageable:clover:drop";
            static name = "Clover (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 0.02, .0025);
        };
    }
};
class Dandelion extends Forageable {
    static id = "forageable:dandelion";
    static name = "Dandelion";

    static season = Time.Season.Spring;
    static time = new Variable('error:0', Time.day(2), Time.day(1));

    static drop = class extends Drop {
        static id = "forageable:dandelion:drop#Drop";
        static name = "Dandelion (kg)";

        static yield = new Variable('range:0', 1, 2);
        static item = class extends Item {
            static id = "forageable:dandelion:drop";
            static name = "Dandelion (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 0.10, .001);
        };
    };
};
class Mushroom extends Forageable {
    static id = "forageable:mushroom";
    static name = "Mushroom";

    static season = Time.Year;
    static time = new Variable('error:0', Time.day(3), Time.day(1));

    static drop = class extends Drop {
        static id = "forageable:mushroom:drop#Drop";
        static name = "Mushroom (kg)";

        static yield = new Variable('range:0', 1, 5);
        static item = class extends Item {
            static id = "forageable:mushroom:drop";
            static name = "Mushroom (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 5.00, .025);
        };
    };
};
class Blackberry extends Forageable {
    static id = "forageable:blackberry";
    static name = "Blackberry";

    static season = Time.Season.Summer;
    static time = new Variable('error:0', Time.day(5), Time.day(2));

    static drop = class extends Drop {
        static id = "forageable:blackberry:drop#Drop";
        static name = "Blackberry (kg)";

        static yield = new Variable('error:0', 4, 2);
        static item = class extends Item {
            static id = "forageable:blackberry:drop";
            static name = "Blackberry (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 0.50, .01);
        };
    };
};
class Raspberry extends Forageable {
    static id = "forageable:raspberry";
    static name = "Raspberry";

    static season = Time.Season.Summer;
    static time = new Variable('error:0', Time.day(5), Time.day(2));

    static drop = class extends Drop {
        static id = "forageable:raspberry:drop#Drop";
        static name = "Raspberry (kg)";

        static yield = new Variable('error:0', 3, 2);
        static item = class extends Item {
            static id = "forageable:raspberry:drop";
            static name = "Raspberry (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 0.60, .01);
        };
    };
};
class Blueberry extends Forageable {
    static id = "forageable:blueberry";
    static name = "Blueberry";

    static season = Time.Season.Summer;
    static time = new Variable('error:0', Time.week(2), Time.day(5));

    static drop = class extends Drop {
        static id = "forageable:blueberry:drop#Drop";
        static name = "Blueberry (kg)";

        static yield = new Variable('error:0', 10, 5);
        static item = class extends Item {
            static id = "forageable:blueberry:drop";
            static name = "Blueberry (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 0.75, .0065);
        };
    };
};
class Grape extends Forageable {
    static id = "forageable:grape";
    static name = "Grape";

    static season = Time.Season.Autumn;
    static time = new Variable('error:0', Time.week(2), Time.day(5));

    static drop = class extends Drop {
        static id = "forageable:grape:drop#Drop";
        static name = "Grape (kg)";

        static yield = new Variable('error:0', 5, 3);
        static item = class extends Item {
            static id = "forageable:grape:drop";
            static name = "Grape (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 0.80, .0065);
        }
    };
};
class Strawberry extends Forageable {
    static id = "forageable:strawberry";
    static name = "Strawberry";

    static season = Time.Season.Spring;
    static time = new Variable('error:0', Time.week(1), Time.day(3));

    static drop = class extends Drop {
        static id = "forageable:strawberry:drop#Drop";
        static name = "Strawberry (kg)";

        static yield = new Variable('error:0', 2, 1);
        static item = class extends Item {
            static id = "forageable:strawberry:drop";
            static name = "Strawberry (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 0.90, .025);
        };
    };
};
class Banana extends Forageable {
    static id = "forageable:banana";
    static name = "Banana";

    static season = Time.Season.Summer;
    static time = new Variable('error:0', Time.week(2), Time.day(3));

    static drop = class extends Drop {
        static id = "forageable:banana:drop#Drop";
        static name = "Banana (kg)";

        static yield = new Variable('error:0', 5, 2);
        static item = class extends Item {
            static id = "forageable:banana:drop";
            static name = "Banana (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 1.00, .01);
        };
    };
};
class Apple extends Forageable {
    static id = "forageable:apple";
    static name = "Apple";

    static season = Time.Season.Autumn;
    static time = new Variable('error:0', Time.week(2), Time.day(3));

    static drop = class extends Drop {
        static id = "forageable:apple:drop#Drop";
        static name = "Apple (kg)";

        static yield = new Variable('variance:0', 25, .025);
        static item = class extends Item {
            static id = "forageable:apple:drop";
            static name = "Apple (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 1.50, .01);
        };
    };
};
class Cherry extends Forageable {
    static id = "forageable:cherry";
    static name = "Cherry";

    static season = Time.Season.Spring;
    static time = new Variable('error:0', Time.week(2), Time.day(3));

    static drop = class extends Drop {
        static id = "forageable:cherry:drop#Drop";
        static name = "Cherry (kg)";

        static yield = new Variable('variance:0', 25, .025);
        static item = class extends Item {
            static id = "forageable:cherry:drop";
            static name = "Cherry (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 4.00, .1);
        };
    };
};

/*
    foraging
    [DONE]
    - grass
    - clover
    - dandelion
    - mushroom
    - blackberry
    - raspberry
    - blueberry
    - grape
    - strawberry
    - banana
    - apple
    - orange [TODO]
    - peach [TODO]
    - lemon [TODO]
    - lime [TODO]
    - cherry
    - pineapple [TODO]
    - coconut [TODO]
*/

class Plot extends Prefab {
    static x = NaN;
    static y = NaN;
};

// lumbering
class Tree extends Prefab {
    static level = NaN;
    static strength = NaN;

    static size = NaN;
    static time = NaN;
    static death = NaN;

    static seed = class extends Item {};
    static drop = class extends Drop {};
};
class BuckeyeTree extends Tree {
    static id = "tree:buckeye";
    static name = "Buckeye";

    static level = 0;
    static strength = 4;

    static size = 20;
    static time = new Variable('error:0', Time.month(20), Time.week(2));
    static death = 0.15;

    static seed = class extends Item {
        static id = "tree:buckeye:seed";
        static name = "Buckeye Sapling";

        static buyable = true;
        static buy_price = new Variable('variance:2', 25.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:buckeye:drop#Drop";
        static name = "Buckeye Lumber (kg)";

        static yield = new Variable('variance:0', 3000, .1);
        static item = class extends Item {
            static id = "tree:buckeye:drop";
            static name = "Buckeye Lumber (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 0.55, 1e-20);
        };
    };
};
class BirchTree extends Tree {
    static id = "tree:birch";
    static name = "Birch";

    static level = 0;
    static strength = 3;

    static size = 15;
    static time = new Variable('error:0', Time.month(15), Time.week(1));
    static death = 0.22;

    static seed = class extends Item {
        static id = "tree:birch:seed";
        static name = "Birch Sapling";

        static buyable = true;
        static buy_price = new Variable('variance:2', 35.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:birch:drop#Drop";
        static name = "Birch Lumber (kg)";

        static yield = new Variable('variance:0', 2000, .1);
        static item = class extends Item {
            static id = "tree:birch:drop";
            static name = "Birch Lumber (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 0.60, 1e-20);
        };
    };
};
class CottonwoodTree extends Tree {
    static id = "tree:cottonwood";
    static name = "Cottonwood";

    static level = 1;
    static strength = 6;

    static size = 55;
    static time = new Variable('error:0', Time.month(20), Time.week(2));
    static death = 0.15;

    static seed = class extends Item {
        static id = "tree:cottonwood:seed";
        static name = "Cottonwood Sapling";

        static buyable = true;
        static buy_price = new Variable('variance:2', 40.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:cottonwood:drop#Drop";
        static name = "Cottonwood Lumber (kg)";

        static yield = new Variable('variance:0', 9500, .1);
        static item = class extends Item {
            static id = "tree:cottonwood:drop";
            static name = "Cottonwood Lumber (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 0.55, 1e-20);
        };
    };
};
class PineTree extends Tree {
    static id = "tree:pine";
    static name = "Pine";

    static level = 1;
    static strength = 6;

    static size = 30;
    static time = new Variable('error:0', Time.month(20), Time.week(2));
    static death = 0.10;

    static seed = class extends Item {
        static id = "tree:pine:seed";
        static name = "Pine Sapling";

        static buyable = true;
        static buy_price = new Variable('variance:2', 65.00, 0.001);
    };
    static drop = class extends Drop {
        static id = "tree:pine:drop#Drop";
        static name = "Pine Lumber (kg)";

        static yield = new Variable('variance:0', 5500, .1);
        static item = class extends Item {
            static id = "tree:pine:drop";
            static name = "Pine Lumber (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 0.70, 1e-20);
        };
    };
};
class SycamoreTree extends Tree {
    static id = "tree:sycamore";
    static name = "Sycamore";

    static level = 2;
    static strength = 7;

    static size = 45;
    static time = new Variable('error:0', Time.month(25), Time.week(3));
    static death = 0.05;

    static seed = class extends Item {
        static id = "tree:sycamore:seed";
        static name = "Sycamore Sapling";

        static buyable = true;
        static buy_price = new Variable('variance:2', 70.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:sycamore:drop#Drop";
        static name = "Sycamore Lumber (kg)";

        static yield = new Variable('variance:0', 10000, .1);
        static item = class extends Item {
            static id = "tree:sycamore:drop";
            static name = "Sycamore Lumber (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 0.60, 1e-20);
        };
    };
};
class SpruceTree extends Tree {
    static id = "tree:spruce";
    static name = "Spruce";

    static level = 2;
    static strength = 5;

    static size = 30;
    static time = new Variable('error:0', Time.month(35), Time.month(1)+Time.week(2));
    static death = 0.15;

    static seed = class extends Item {
        static id = "tree:spruce:seed";
        static name = "Spruce Sapling";

        static buyable = true;
        static buy_price = new Variable('variance:2', 60.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:spruce:drop#Drop";
        static name = "Spruce Lumber (kg)";

        static yield = new Variable('variance:0', 7500, .1);
        static item = class extends Item {
            static id = "tree:spruce:drop";
            static name = "Spruce Lumber (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 0.70, 1e-20);
        };
    };
};
class MapleTree extends Tree {
    static id = "tree:maple";
    static name = "Maple";

    static level = 3;
    static strength = 8;

    static size = 35;
    static time = new Variable('error:0', Time.month(30), Time.week(3));
    static death = 0.09;

    static seed = class extends Item {
        static id = "tree:maple:seed";
        static name = "Maple Sapling";

        static buyable = true;
        static buy_price = new Variable('variance:2', 80.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:maple:drop#Drop";
        static name = "Maple Lumber (kg)";

        static yield = new Variable('variance:0', 9000, .1);
        static item = class extends Item {
            static id = "tree:maple:drop";
            static name = "Maple Lumber (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 0.80, 1e-20);
        };
    };
};
class ElmTree extends Tree {
    static id = "tree:elm";
    static name = "Elm";

    static level = 3;
    static strength = 6;

    static size = 30;
    static time = new Variable('error:0', Time.month(30), Time.month(1));
    static death = 0.25;

    static seed = class extends Item {
        static id = "tree:elm:seed";
        static name = "Elm Sapling";

        static buyable = true;
        static buy_price = new Variable('variance:2', 40.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:elm:drop#Drop";
        static name = "Elm Lumber (kg)";

        static yield = new Variable('variance:0', 8000, .1);
        static item = class extends Item {
            static id = "tree:elm:drop";
            static name = "Elm Lumber (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 0.70, 1e-20);
        };
    };
};
class OakTree extends Tree {
    static id = "tree:oak";
    static name = "Oak";

    static level = 4;
    static strength = 9;

    static size = 40;
    static time = new Variable('error:0', Time.month(40), Time.month(2));
    static death = 0.06;

    static seed = class extends Item {
        static id = "tree:oak:seed";
        static name = "Oak Sapling";

        static buyable = true;
        static buy_price = new Variable('variance:2', 100.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:oak:drop#Drop";
        static name = "Oak Lumber (kg)";

        static yield = new Variable('variance:0', 10000, .1);
        static item = class extends Item {
            static id = "tree:oak:drop";
            static name = "Oak Lumber (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 1.10, 1e-20);
        };
    };
};
class CedarTree extends Tree {
    static id = "tree:cedar";
    static name = "Cedar";

    static level = 4;
    static strength = 7;

    static size = 25;
    static time = new Variable('error:0', Time.month(35), Time.month(1)+Time.week(2));
    static death = 0.12;

    static seed = class extends Item {
        static id = "tree:cedar:seed";
        static name = "Cedar Sapling";

        static buyable = true;
        static buy_price = new Variable('variance:2', 60.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:cedar:drop#Drop";
        static name = "Cedar Lumber (kg)";

        static yield = new Variable('variance:0', 4500, .1);
        static item = class extends Item {
            static id = "tree:cedar:drop";
            static name = "Cedar Lumber (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 1.20, 1e-20);
        };
    };
};
class RedwoodTree extends Tree {
    static id = "tree:redwood";
    static name = "Redwood";

    static level = 5;
    static strength = 10;

    static size = 100;
    static time = new Variable('error:0', Time.month(100), Time.month(5));
    static death = 0.02;

    static seed = class extends Item {
        static id = "tree:redwood:seed";
        static name = "Redwood Sapling";

        static buyable = true;
        static buy_price = new Variable('variance:2', 350.00, .001);
    };
    static drop = class extends Drop {
        static id = "tree:redwood:drop#Drop";
        static name = "Redwood Lumber (kg)";

        static yield = new Variable('variance:0', 35000, .1);
        static item = class extends Item {
            static id = "tree:redwood:drop";
            static name = "Redwood Lumber (kg)";

            static sellable = true;
            static sell_price = new Variable('variance:2', 2.50, 1e-20);
        };
    };
};

// workers