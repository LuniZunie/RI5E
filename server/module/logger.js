import fs from "fs";

export default class Logger {
    static log(type, source, secondSource = "", message) {
        secondSource ||= "";
        const [ date, time ] = new Date().toISOString().split("T");
        const path = `server/logs/${date}.log`;

        const field = (len, msg) => (msg.slice(0, len) || "-").padEnd(len, " ");

        const logMessage = `${date} ${time.slice(0, 8)} ${field(8, type)} ${field(16, source)} ${field(16, secondSource)} ${message}\n`;
        // append log synchronously
        try {
            fs.appendFileSync(path, logMessage, "utf8");
        } catch (err) { console.error(`Failed to write log: ${err.message}`); }
    }
}