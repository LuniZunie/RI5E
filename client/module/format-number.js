const abbreviations = [
    "",
    "K",
    "M",
    "B",
    "T",
    "Qa",
    "Qi",
    "Sx",
    "Sp",
    "Oc",
    "No",
    "Dc",
];
export default function format_number(n) {
    let i = 0;
    while (n >= 1000 && i < abbreviations.length - 1) {
        n /= 1000;
        i++;
    }
    return n.toFixed(2) + abbreviations[i];
};

export function parse_formatted_number(str) {
    if (typeof str !== "string") throw new TypeError("format_number: Argument must be a string.");

    const suffix = str.match(/[A-z]+$/)?.[0] || "";
    if (!abbreviations.includes(suffix))
        throw new Error(`format_number: Unknown suffix "${suffix}".`);

    const num = parseFloat(str.slice(0, -suffix.length));
    if (isNaN(num))
        throw new Error("format_number: Invalid number format.");
    return num * Math.pow(1000, abbreviations.indexOf(suffix));
}