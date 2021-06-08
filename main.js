function createElement(tag, className) {
    const $tag = document.createElement(tag);
    if (className) {
        $tag.classList.add(className);
    }

    return $tag;
}

function changeHP(hp) {
    this.hp -= hp;

    if (this.hp <= 0) {
        this.hp = 0;
    }
};

function elHP() {
    return document.querySelector(`.player${this.player} .life`)
};

function renderHP() {
    const $playerLife = this.elHP();
    $playerLife.style.width = `${this.hp}%`;
};

function createReloadButton() {
    const reloadWrap = createElement("div", "reloadWrap");
    const button = createElement("button", "button");
    button.innerText = "Restart";

    button.addEventListener("click", function () {
        window.location.reload();
    })
};

class Player {
    constructor(characterData) {
        this.player = characterData.player;
        this.name = characterData.name;
        this.hp = characterData.hp;
        this.img = characterData.img;
        this.weapon = characterData.weapon;

        this.changeHP = changeHP;
        this.elHP = elHP;
        this.renderHP = renderHP;
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

    playerWin(name) {
        const $loseTittle = createElement("div", "loseTitle");

        if (name) {
            $loseTittle.innerText = `${name} win!`;
        } else {
            $loseTittle.innerText = `draw!`;
        }


        return $loseTittle;
    }

    createReloadButton() {
        const reloadWrap = createElement("div", "reloadWrap");

        const button = createElement("button", "button");
        button.innerText = "Restart";

        reloadWrap.appendChild(button);
        this.$playersContainer.appendChild(reloadWrap);

        button.addEventListener("click", function () {
            window.location.reload();
        })
    };

    $randomButtonAction() {
        this.$randomButton.addEventListener("click", () => {
            console.log("####: Click Random Button");

            this.player1.changeHP(Math.floor(Math.random() * 20));
            this.player2.changeHP(Math.floor(Math.random() * 20));

            this.player1.renderHP();
            this.player2.renderHP();

            if (this.player1.hp <= 0 || this.player2.hp <= 0) {
                this.$randomButton.disabled = true;
                this.createReloadButton();
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


