function encodeJSON(obj) {
    const json = JSON.stringify(obj);
    const uint8 = new TextEncoder().encode(json);
    const binary = Array.from(uint8, byte => String.fromCharCode(byte)).join('');
    return btoa(binary);
}

function decodeJSON(base64) {
    const binary = atob(base64);
    const uint8 = new Uint8Array([...binary].map(c => c.charCodeAt(0)));
    const json = new TextDecoder().decode(uint8);
    return JSON.parse(json);
}

export { encodeJSON, decodeJSON };