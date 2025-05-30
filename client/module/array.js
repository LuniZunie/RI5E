Object.defineProperties(Array, {
    repeat: { value(v, count = 1) {
        if (typeof count !== "number" || count < 0)
            throw new TypeError("repeat: count must be a non-negative number.");

        const res = [];
        for (let i = 0; i < count; i++)
            res.push(v);
        return res;
    } },
});
export default true;