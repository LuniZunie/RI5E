function create_diff(before, after) {
    if (Array.isArray(before) && Array.isArray(after)) {
        // Attempt item matching by id
        const useIdMatching = before.every(x => x && x.id) && after.every(x => x === null || (x && x.id));
        if (useIdMatching) {
            const diff = [];
            const beforeMap = Object.fromEntries(before.map(item => [item.id, item]));
            for (let i = 0; i < after.length; i++) {
                const b = after[i];
                if (b === null) {
                    diff.push(null); // explicit removal
                } else {
                    const a = beforeMap[b.id];
                    if (!a) {
                        diff.push(b); // new item
                    } else {
                        const d = create_diff(a, b);
                        diff.push(d ?? a); // if no diff, push a (could optimize to "skip")
                    }
                }
            }
            return diff;
        } else {
            // fallback to index-based diff
            const maxLength = Math.max(before.length, after.length);
            const diff = [];
            let hasDiff = false;

            for (let i = 0; i < maxLength; i++) {
                const a = before[i];
                const b = after[i];
                if (i >= before.length || i >= after.length || b === null) {
                    diff[i] = b;
                    hasDiff = true;
                } else if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
                    const nested = create_diff(a, b);
                    if (nested && Object.keys(nested).length > 0) {
                        diff[i] = nested;
                        hasDiff = true;
                    }
                } else if (a !== b) {
                    diff[i] = b;
                    hasDiff = true;
                }
            }

            return hasDiff ? diff : null;
        }
    }

    if (typeof before === 'object' && before !== null &&
        typeof after === 'object' && after !== null) {
        const diff = {};
        for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
            const a = before[key];
            const b = after[key];

            if (!(key in after)) {
                diff[key] = undefined;
            } else if (typeof a === 'object' && a !== null &&
                       typeof b === 'object' && b !== null) {
                const nested = create_diff(a, b);
                if (nested && Object.keys(nested).length > 0) {
                    diff[key] = nested;
                }
            } else if (a !== b) {
                diff[key] = b;
            }
        }
        return Object.keys(diff).length > 0 ? diff : null;
    }

    return before !== after ? after : null;
}

function apply_diff(base, diff) {
    if (Array.isArray(base) && Array.isArray(diff)) {
        const useIdMatching = base.every(x => x && x.id) && diff.every(x => x === null || (x && x.id));
        if (useIdMatching) {
            const baseMap = Object.fromEntries(base.map(item => [item.id, item]));
            const result = [];

            for (const patch of diff) {
                if (patch === null) {
                    result.push(null);
                } else if (patch.id && baseMap[patch.id]) {
                    const original = baseMap[patch.id];
                    if (typeof patch === 'object' && !Array.isArray(patch)) {
                        result.push(apply_diff(original, patch));
                    } else {
                        result.push(patch);
                    }
                } else {
                    result.push(patch);
                }
            }

            return result;
        } else {
            const result = [];
            const length = Math.max(base.length, diff.length);

            for (let i = 0; i < length; i++) {
                if (i in diff) {
                    const patch = diff[i];
                    if (patch === null || patch === undefined) {
                        result[i] = null;
                    } else if (typeof patch === 'object' && patch !== null &&
                               typeof base[i] === 'object' && base[i] !== null) {
                        result[i] = apply_diff(base[i], patch);
                    } else {
                        result[i] = patch;
                    }
                } else {
                    result[i] = base[i];
                }
            }

            return result;
        }
    }

    if (typeof base === 'object' && base !== null &&
        typeof diff === 'object' && diff !== null) {
        const result = { ...base };

        for (const [k, v] of Object.entries(diff)) {
            if (v === undefined) {
                delete result[k];
            } else if (typeof v === 'object' && v !== null &&
                       typeof result[k] === 'object' && result[k] !== null) {
                result[k] = apply_diff(result[k], v);
            } else {
                result[k] = v;
            }
        }

        return result;
    }

    return diff;
}

export { create_diff, apply_diff };