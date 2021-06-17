import { createElement } from "./utils.js";

export default class Player {
    constructor({ player, name, hp, img, weapon }) {
        this.player = player;
        this.name = name;
        this.hp = hp;
        this.img = img;
        this.weapon = weapon;
        this.selector = `.player${this.player}`;
    }

    changeHP(hp) {
        this.hp -= hp;

        if (this.hp <= 0) {
            this.hp = 0;
        }
    };

    elHP() {
        return document.querySelector(`${this.selector} .life`)
    };

    renderHP() {
        const $playerLife = this.elHP();
        $playerLife.style.width = `${this.hp}%`;
    };

    createPlayer() {
        const $player = createElement("div", `player${this.player}`);

        const $progressbar = createElement("div", "progressbar");

        const $life = createElement("div", "life");
        $life.style.width = `${this.hp}%`;

        const $name = createElement("div", "name");
        $name.innerText = this.name;

        const $character = createElement("div", "character");

        const $img = createElement("img", "character");
        $img.src = this.img;

        $progressbar.appendChild($life);
        $progressbar.appendChild($name);

        $character.appendChild($img);

        $player.appendChild($progressbar);
        $player.appendChild($character);

        return $player;
    }
}