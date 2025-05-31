Object.defineProperties(Math, {
    clamp: { value(v, min, max) {
        if (typeof v !== "number" || typeof min !== "number" || typeof max !== "number")
            throw new TypeError("Math.clamp: All arguments must be numbers.");
        return Math.min(Math.max(v, min), max);
    } },
});
export default true;