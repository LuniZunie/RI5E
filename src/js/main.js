import display_map from './display-map.js';
import map from './prefab.js';

display_map(map);

document.querySelectorAll("*.auto-scroll").forEach($el => { // scroll horizontally constantly
    const scroll = dir => {
        $el.scrollLeft += dir;
        if ($el.scrollLeft >= $el.scrollWidth - $el.clientWidth)
            setTimeout(() => scroll(-1), 750);
        else if ($el.scrollLeft <= 0)
            setTimeout(() => scroll(1), 750);
        else
            requestAnimationFrame(() => scroll(dir));
    };
    requestAnimationFrame(() => scroll(1));
});

document.body.addEventListener("keydown", e => {
    switch (e.key) {
        case "Enter":
            document.querySelectorAll("*.enter-focus:not(.disabled)").forEach($el => {
                if (getComputedStyle($el).display !== "none") {
                    $el.click();
                    $el.classList.remove("enter-focus");
                }
            });
            break;
    }
});