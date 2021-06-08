const createElement = (tag, className) => {
    const $tag = document.createElement(tag);
    if (className) {
        $tag.classList.add(className);
    }

    return $tag;
}


class Player {
    constructor(characterData) {
        this.player = characterData.player;
        this.name = characterData.name;
        this.hp = characterData.hp;
        this.img = characterData.img;
        this.weapon = characterData.weapon;
    }

    attack() {
        console.log(`${this.name} Fight...`)
    }

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

class Game {
    constructor(player1Data, player2Data) {
        this.$playersContainer = document.querySelector(".arenas");
        this.$randomButton = document.querySelector(".button");

        this.player1 = new Player(player1Data);
        this.player2 = new Player(player2Data);

        this.init();
    }

    changeHP(player) {
        const $playerLife = document.querySelector(`.player${player.player} .life`);
        player.hp -= Math.floor(Math.random() * 20);

        if (player.hp <= 0) {
            player.hp = 0;
        }

        $playerLife.style.width = `${player.hp}%`;
    }

    playerWin(name) {
        const $loseTittle = createElement("div", "loseTitle");

        if (name) {
            $loseTittle.innerText = `${name} win!`;
        } else {
            $loseTittle.innerText = `draw!`;
        }


        return $loseTittle;
    }

    $randomButtonAction() {
        this.$randomButton.addEventListener("click", () => {
            console.log("####: Click Random Button");

            this.changeHP(this.player1);
            this.changeHP(this.player2);

            if (this.player1.hp <= 0 || this.player2.hp <= 0) {
                this.$randomButton.disabled = true;
            }

            if (this.player1.hp === 0 && this.player1.hp < this.player2.hp) {
                this.$playersContainer.appendChild(this.playerWin(this.player2.name))
            } else if (this.player2.hp === 0 && this.player2.hp < this.player1.hp) {
                this.$playersContainer.appendChild(this.playerWin(this.player1.name))
            } else if (this.player2.hp === 0 && this.player2.hp === this.player1.hp) {
                this.$playersContainer.appendChild(this.playerWin())
            }

        })
    }

    init() {
        this.$playersContainer.appendChild(this.player1.createPlayer());
        this.$playersContainer.appendChild(this.player2.createPlayer());

        this.$randomButtonAction();

        this.player1.attack();
        this.player2.attack();
    }
}

let scorpionData = {
    player: 1,
    name: "SCORPION",
    hp: 100,
    img: "http://reactmarathon-api.herokuapp.com/assets/scorpion.gif",
    weapon: ["HOOK"]
}

let subzeroData = {
    player: 2,
    name: "SUB-ZERO",
    hp: 100,
    img: "http://reactmarathon-api.herokuapp.com/assets/subzero.gif",
    weapon: ["SWORD"]
}

window.onload = () => {
    const game = new Game(scorpionData, subzeroData);
}


