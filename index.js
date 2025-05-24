class Variable {
    #fn = () => NaN;
    #round = 2;
    constructor(type='static', ...args) {
        [type,this.#round=2] = type.split(':');

        let v,mn,mx,mean,variance;
        switch (type) {
            case 'static':
                [v=NaN] = args;
                this.#fn = () => v;
                break;
            case 'range':
                [mn,mx] = args;
                this.#fn = () => Math.random() * (mx - mn + 1) + mn;
                break;
            case 'variance':
                [mean,variance] = args;
                const [_sqrtMean,_logVariance] = [Math.sqrt(mean), Math.log(variance)]; // constants
                this.#fn = () => mean + Math.log(Math.random()+Number.EPSILON) / _logVariance * _sqrtMean * (Math.random() < 0.5 ? -1 : 1);
                break;
            default:
                this.#fn = () => NaN;
                break;
        }
    };

    get value() {
        const b10 = 10**this.#round;
        return Math.max(Number.EPSILON,1/b10, Math.floor((this.#fn()||0) * b10) / b10);
    };
};

const args = [3000, 5e-2];
const view_scale = 500;

const [tests,int] = [10000,11];

window.addEventListener('load', () => {
    function draw(type) {
        type = `${type}:${+document.querySelector('input#argument0').value}`;
        const v = new Variable(type, +document.querySelector('input#argument1').value, +document.querySelector('input#argument2').value);

        const values = []; for (let i = 0; i < tests; i++)
            values.push(v.value);

        let [vmin,vmax] = [Math.min(...values), Math.max(...values)];
        vmax = Math.ceil(vmax+1);
        vmin = Math.max(Math.floor(vmin - 1),0);

        const paper = document.getElementById('paper');
        const pen = paper.getContext('2d');
        const getY = v => Math.floor(paper.height - (v - vmin) / (vmax - vmin) * paper.height);

        pen.clearRect(0, 0, paper.width, paper.height);

        pen.strokeStyle = '#0808'; pen.lineWidth = 1; pen.beginPath();
        for (let i = 0; i < tests; i++) {
            const [x,y] = [Math.floor((i / tests) * paper.width), Math.floor(getY(values[i]))];
            if (i) pen.lineTo(x, y);
            else pen.moveTo(x, y);
        }
        pen.stroke(); pen.closePath();

        for (let i = 0; i < int; i++) {
            const text = ((vmax - vmin) / (int-1) * i + vmin).toFixed(2);
            const [y,h] = [Math.floor((i / (int-1)) * paper.height), Math.ceil(paper.height / innerHeight * 0.98)];
            const dy = paper.height - y - h / 2;

            pen.fillStyle = '#fff2';
            pen.fillRect(0, dy, paper.width, h);

            if (i === 0) pen.textBaseline = 'bottom';
            else if (i === int - 1) pen.textBaseline = 'top';
            else pen.textBaseline = 'middle';
            pen.textAlign = 'left'; pen.font = `${h*10}px sans-serif`;

            pen.fillStyle = '#121215bb';
            pen.fillRect(0, dy+h/2-h*12, pen.measureText(text).width+paper.width/100, h*24);

            pen.fillStyle = '#666';
            pen.fillText(text, 0, dy + h / 2);
        }
    };

    for (const el of document.querySelectorAll('.button-group')) {
        const buttons = el.querySelectorAll('.button');
        for (const button of buttons)
            button.addEventListener('click', () => {
                el.querySelector('.button.selected')?.classList.remove('selected');
                button.classList.add('selected');

                if(el.id==='types')
                    draw(button.getAttribute('value'));
            });
    }

    for (const el of document.querySelectorAll('input[type="text"]'))
        el.addEventListener('input', () => {
            const value = el.value.replace(/[^0-9.\-e]/g, '');
            if (value !== el.value) el.value = value;
            draw(document.querySelector('div.button-group#types>div.button.selected').getAttribute('value'));
        });

    document.querySelector('div.button#regenerate').addEventListener('click', () => {
        draw(document.querySelector('div.button-group#types>div.button.selected').getAttribute('value'));
    });

    draw(document.querySelector('div.button-group#types>div.button.selected').getAttribute('value'));
}, { once: true });