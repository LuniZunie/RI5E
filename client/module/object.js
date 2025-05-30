Object.defineProperties(Object, {
    any: {
        value(O, fn = v => v) {
            if (typeof O !== "object" || O === null) return false;
            if (typeof fn !== "function") fn = v => v;
            if (Array.isArray(O))
                for (const [ k, v ] of O.entries())
                    if (fn(v, k)) return true;
            else
                for (const [ k, v ] of Object.entries(O))
                    if (fn(v, k)) return true;
            return false;
        }
    },
    match: {
        value(a, b) {
            if (typeof a !== "object" || a === null) return false;

            const vs_b = Object.values(b);
            const [ mn_len, mx_len ] = [ vs_b.filter(v => v.required === true).length, vs_b.length ];

            let trues = 0;
            const ens_a = Object.entries(a);
            if (ens_a.length < mn_len || ens_a.length > mx_len) return false;
            for (const [ k, v ] of ens_a) {
                if (k in b) {
                    if (!b[k].test(v)) return false;
                    if (b[k].required === true)
                        trues++;
                } else return false;
            }

            if (trues < mn_len) return false;
            return true;
        }
    },
});
export default true;