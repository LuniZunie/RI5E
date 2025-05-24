export default class Variable {
    #fn = () => NaN;
    #round = NaN;
    constructor(type="static", ...args) {
        [type,this.#round=NaN] = type.split(":");

        let v,mn,mx,dif,mean,variance;
        switch (type) {
            case "static":
                [v=NaN] = args;
                this.#fn = () => v;
                break;
            case "range":
                [mn,mx] = args;
                this.#fn = () => Math.random() * (mx - mn + 1) + mn;
                break;
            case "error":
                [v,dif] = args;
                [mn,mx] = [v-dif,v+dif];
                this.#fn = () => Math.random() * (mx - mn + 1) + mn + v;
                break;
            case "variance":
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
        return Math.floor((this.#fn()||0) * b10) / b10;
    };
    get positive() {
        const b10 = 10**this.#round;
        return Math.max(Number.EPSILON,1/b10, this.value);
    };
};