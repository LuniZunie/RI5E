import "../../module/html.js";
export default function confirm(message, options = {}) {
    return new Promise((resolve, reject) => {
        const dialog = document.createElement("div");
        dialog.className = "confirm-dialog";
        dialog.innerHTML = `
            <div class="message">${message}</div>
            <div class="buttons">
                <button class="yes">Yes</button>
                <button class="no">No</button>
            </div>
        `;

        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(2, 3, 14, 0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            font-size: 1.5em;
            text-align: center;
            box-shadow: 0 0 10px rgba(2, 3, 14, 0.5);
        `;

        document.body.appendChild(dialog);

        dialog.qs("div.buttons").style.cssText = `
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
        `;

        dialog.qs("div.buttons>button.yes").style.cssText = `
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
        `;
        dialog.qs("div.buttons>button.no").style.cssText = `
            background: #f44336;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
        `;

        dialog.qs("div.buttons>button.yes").addEventListener("click", () => {
            document.body.removeChild(dialog);
            resolve(true);
        });

        dialog.qs("div.buttons>button.no").addEventListener("click", () => {
            document.body.removeChild(dialog);
            resolve(false);
        });

        if (options.timeout) {
            setTimeout(() => {
                document.body.removeChild(dialog);
                resolve(false);
            }, options.timeout);
        }
    });
};