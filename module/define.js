export default function $(construct, o) {
    let tmp = new construct();
    for (const [ k, v ] of Object.entries(o)) {
        if (k in tmp) tmp[k] = v;
        else throw new Error("invalid definition");
    }
    return tmp;
};