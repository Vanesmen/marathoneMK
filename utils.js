export const createElement = function (tag, className) {
    const $tag = document.createElement(tag);
    if (className) {
        $tag.classList.add(className);
    }

    return $tag;
}

export const getRandom = function (max) {
    const random = Math.floor(Math.random() * max);
    return random;
}