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