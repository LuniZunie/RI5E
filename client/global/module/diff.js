function create_diff(oldObj, newObj) {
  if (oldObj === newObj) return;

  // Handle primitives and array differences
  if (
    typeof oldObj !== 'object' || oldObj === null ||
    typeof newObj !== 'object' || newObj === null ||
    Array.isArray(oldObj) || Array.isArray(newObj)
  ) {
    return oldObj === newObj ? undefined : [{ k: '', u: newObj }];
  }

  const diffs = [];
  const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

  for (const key of allKeys) {
    const oVal = oldObj[key];
    const nVal = newObj[key];

    if (!(key in newObj)) {
      diffs.push({ k: key, r: 1 }); // removed
    } else if (!(key in oldObj)) {
      diffs.push({ k: key, a: nVal }); // added
    } else if (
      typeof oVal !== 'object' || oVal === null ||
      typeof nVal !== 'object' || nVal === null ||
      Array.isArray(oVal) || Array.isArray(nVal)
    ) {
      if (JSON.stringify(oVal) !== JSON.stringify(nVal)) {
        diffs.push({ k: key, u: nVal }); // updated primitive or array
      }
    } else {
      const nested = create_diff(oVal, nVal);
      if (nested && nested.length > 0) {
        diffs.push({ k: key, d: nested }); // nested diff
      }
    }
  }

  return diffs.length > 0 ? diffs : undefined;
}

function apply_diff(base, diff) {
  if (!diff) return base;

  const isArray = Array.isArray(base);
  const copy = isArray ? [...base] : { ...base };

  for (const patch of diff) {
    const key = patch.k;

    if ('r' in patch) {
      delete copy[key];
    } else if ('a' in patch || 'u' in patch) {
      copy[key] = patch.a ?? patch.u;
    } else if ('d' in patch) {
      copy[key] = apply_diff(base[key] ?? {}, patch.d);
    }
  }

  return copy;
}

export { create_diff, apply_diff };