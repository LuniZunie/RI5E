Object.defineProperties(String, {
    format_literal: {
        value(str) {
            if (typeof str !== "string") throw new TypeError("String.format_literal: Argument must be a string.");

            let end = 0, mn = Infinity; // min indent
            const lines = str.split(/\r\n|\n|\r/); const len = lines.length;
            for (let i = 0; i < len; i++) {
                const line = lines[i];
                if (line.trim() === "") continue; // skip empty lines
                end = i + 1; // update end index

                const indent = line.match(/^\s*/)[0].length; // get indent length
                if (indent < mn) mn = indent; // update min indent
            }

            if (mn === Infinity) mn = 0; // if no non-empty lines, set min indent to 0

            let found_content = false; // flag to check if any content is found
            const rtn = []; // return value
            for (let i = 0; i < len; i++) {
                if (i >= end) break; // stop checking after the last non-empty line
                const line = lines[i];
                if (line.trim() === "") {
                    if (found_content) rtn.push(""); // keep empty lines after content
                    continue; // skip empty lines
                } else found_content = true; // set flag if any content is found

                rtn.push(line.slice(mn)); // remove min indent from each line
            }
            return rtn.join("\n");
        }
    }
});
export default true;