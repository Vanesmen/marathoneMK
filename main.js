class Player {
    constructor(characterDate) {
        this.divClass = characterDate.divClass;
        this.name = characterDate.name;
        this.hp = characterDate.hp;
        this.img = characterDate.img;
        this.weapon = characterDate.weapon;

        this.playerContainer = document.querySelector(".arenas");
    }

    attack() {
        console.log(`${this.name} Fight...`)
    }

    createPlayer = () => {
        const $player = document.createElement("div");
        $player.classList.add(this.divClass);

        const $progressbar = document.createElement("div");
        $progressbar.classList.add("progressbar");

        const $life = document.createElement("div");
        $life.classList.add("life");
        $life.style.width = `${this.hp}%`;

        const $name = document.createElement("div");
        $name.classList.add("name");
        $name.innerText = this.name;

        const $character = document.createElement("div");
        $character.classList.add("character");

        const $img = document.createElement("img");
        $img.src = this.img;

        $progressbar.appendChild($life);
        $progressbar.appendChild($name);

        $character.appendChild($img);

        $player.appendChild($progressbar);
        $player.appendChild($character);

        this.playerContainer.appendChild($player);
    }
}

let scorpionDate = {
    divClass: "player1",
    name: "SCORPION",
    hp: 55,
    img: "http://reactmarathon-api.herokuapp.com/assets/scorpion.gif",
    weapon: ["HOOK"]
}

let subzeroDate = {
    divClass: "player2",
    name: "SUB-ZERO",
    hp: 70,
    img: "http://reactmarathon-api.herokuapp.com/assets/subzero.gif",
    weapon: ["SWORD"]
}

let scorpion = new Player(scorpionDate);
let subzero = new Player(subzeroDate);

scorpion.createPlayer();
subzero.createPlayer();

scorpion.attack();
subzero.attack();

