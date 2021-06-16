function createElement(tag, className) {
    const $tag = document.createElement(tag);
    if (className) {
        $tag.classList.add(className);
    }

    return $tag;
}

function getRandom(max) {
    const random = Math.floor(Math.random() * max);
    return random;
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
        this.$formFight = document.querySelector(".control");
        this.$chat = document.querySelector(".chat");

        this.player1 = new Player(player1Data);
        this.player2 = new Player(player2Data);

        this.init();
    }

    playerWin(name) {
        console.log("игра завершена");
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

    generateLogs(type, player1, player2, damage) {
        let currentTime = new Date();
        let currentHour = currentTime.getHours();
        let currentMinutes = currentTime.getMinutes().toString().length < 2 ? `0${currentTime.getMinutes()}` : currentTime.getMinutes();
        currentTime = `${currentHour}:${currentMinutes}`;

        let text;
        switch (type) {
            case "start":
                text = `${logs[type].replace("[player1]", player1.name).replace("[player2]", player2.name).replace("[time]", currentTime)}`;
                break;
            case "end":
                text = `${logs[type][getRandom(logs[type].length)].replace("[playerWins]", player1.name).replace("[playerLose]", player2.name)}`
                break;
            case "hit":
                text = `${currentTime} - ${logs[type][getRandom(logs[type].length)].replace("[playerKick]", player1.name).replace("[playerDefence]", player2.name)} -${damage} [${player2.hp}/100]`;
                break;
            case "defence":
                text = `${currentTime} - ${logs[type][getRandom(logs[type].length)].replace("[playerKick]", player1.name).replace("[playerDefence]", player2.name)}`;
                break;
            case "draw":
                text = `${logs[type]}`
                break;
        };

        const el = `<p>${text}</p>`;
        this.$chat.insertAdjacentHTML('afterbegin', el);
    }

    formFightAction() {
        this.$formFight.addEventListener("submit", (e) => {
            e.preventDefault();
            const enemy = this.enemyAttack();
            const attack = this.playerAttack();


            if (attack.hit !== enemy.defence) {
                this.player2.changeHP(attack.value);
                this.player2.renderHP();
                this.generateLogs("hit", this.player1, this.player2, attack.value);
            } else {
                this.generateLogs("defence", this.player1, this.player2);
            }

            if (enemy.hit !== attack.defence) {
                this.player1.changeHP(enemy.value);
                this.player1.renderHP();
                this.generateLogs("hit", this.player2, this.player1, enemy.value);
            } else {
                this.generateLogs("defence", this.player2, this.player1);
            }

            if (this.player1.hp <= 0 || this.player2.hp <= 0) {
                this.endGameTrigger();
            }
        })
    }

    enemyAttack() {
        const hit = ATTACK[getRandom(2)];
        const defence = ATTACK[getRandom(2)];

        return {
            value: getRandom(HIT[hit]),
            hit,
            defence
        }
    }

    playerAttack() {
        const attack = {};

        for (let item of this.$formFight) {
            if (item.checked && item.name === "hit") {
                attack.value = getRandom(HIT[item.value]);
                attack.hit = item.value;
            }

            if (item.checked && item.name === "defence") {
                attack.defence = item.value;
            }

            item.checked = false;
        }
        return attack;
    }

    endGameTrigger() {

        if (this.player1.hp === 0 && this.player1.hp < this.player2.hp) {
            this.$playersContainer.appendChild(this.playerWin(this.player2.name));
            this.generateLogs("end", this.player2, this.player1);
        } else if (this.player2.hp === 0 && this.player2.hp < this.player1.hp) {
            this.$playersContainer.appendChild(this.playerWin(this.player1.name));
            this.generateLogs("end", this.player1, this.player2);
        } else if (this.player2.hp === 0 && this.player2.hp === this.player1.hp) {
            this.$playersContainer.appendChild(this.playerWin());
            this.generateLogs("draw");
        }
        this.$randomButton.disabled = true;
        this.createReloadButton();
    }

    init() {
        this.$playersContainer.appendChild(this.player1.createPlayer());
        this.$playersContainer.appendChild(this.player2.createPlayer());

        this.formFightAction();
        this.generateLogs("start", this.player1, this.player2);

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

const HIT = {
    head: 30,
    body: 25,
    foot: 20,
}
const ATTACK = ['head', 'body', 'foot'];

const logs = {
    start: 'Часы показывали [time], когда [player1] и [player2] бросили вызов друг другу.',
    end: [
        'Результат удара [playerWins]: [playerLose] - труп',
        '[playerLose] погиб от удара бойца [playerWins]',
        'Результат боя: [playerLose] - жертва, [playerWins] - убийца',
    ],
    hit: [
        '[playerDefence] пытался сконцентрироваться, но [playerKick] разбежавшись раздробил копчиком левое ухо врага.',
        '[playerDefence] расстроился, как вдруг, неожиданно [playerKick] случайно раздробил грудью грудину противника.',
        '[playerDefence] зажмурился, а в это время [playerKick], прослезившись, раздробил кулаком пах оппонента.',
        '[playerDefence] чесал <вырезано цензурой>, и внезапно неустрашимый [playerKick] отчаянно размозжил грудью левый бицепс оппонента.',
        '[playerDefence] задумался, но внезапно [playerKick] случайно влепил грубый удар копчиком в пояс оппонента.',
        '[playerDefence] ковырялся в зубах, но [playerKick] проснувшись влепил тяжелый удар пальцем в кадык врага.',
        '[playerDefence] вспомнил что-то важное, но внезапно [playerKick] зевнув, размозжил открытой ладонью челюсть противника.',
        '[playerDefence] осмотрелся, и в это время [playerKick] мимоходом раздробил стопой аппендикс соперника.',
        '[playerDefence] кашлянул, но внезапно [playerKick] показав палец, размозжил пальцем грудь соперника.',
        '[playerDefence] пытался что-то сказать, а жестокий [playerKick] проснувшись размозжил копчиком левую ногу противника.',
        '[playerDefence] забылся, как внезапно безумный [playerKick] со скуки, влепил удар коленом в левый бок соперника.',
        '[playerDefence] поперхнулся, а за это [playerKick] мимоходом раздробил коленом висок врага.',
        '[playerDefence] расстроился, а в это время наглый [playerKick] пошатнувшись размозжил копчиком губы оппонента.',
        '[playerDefence] осмотрелся, но внезапно [playerKick] робко размозжил коленом левый глаз противника.',
        '[playerDefence] осмотрелся, а [playerKick] вломил дробящий удар плечом, пробив блок, куда обычно не бьют оппонента.',
        '[playerDefence] ковырялся в зубах, как вдруг, неожиданно [playerKick] отчаянно размозжил плечом мышцы пресса оппонента.',
        '[playerDefence] пришел в себя, и в это время [playerKick] провел разбивающий удар кистью руки, пробив блок, в голень противника.',
        '[playerDefence] пошатнулся, а в это время [playerKick] хихикая влепил грубый удар открытой ладонью по бедрам врага.',
    ],
    defence: [
        '[playerKick] потерял момент и храбрый [playerDefence] отпрыгнул от удара открытой ладонью в ключицу.',
        '[playerKick] не контролировал ситуацию, и потому [playerDefence] поставил блок на удар пяткой в правую грудь.',
        '[playerKick] потерял момент и [playerDefence] поставил блок на удар коленом по селезенке.',
        '[playerKick] поскользнулся и задумчивый [playerDefence] поставил блок на тычок головой в бровь.',
        '[playerKick] старался провести удар, но непобедимый [playerDefence] ушел в сторону от удара копчиком прямо в пятку.',
        '[playerKick] обманулся и жестокий [playerDefence] блокировал удар стопой в солнечное сплетение.',
        '[playerKick] не думал о бое, потому расстроенный [playerDefence] отпрыгнул от удара кулаком куда обычно не бьют.',
        '[playerKick] обманулся и жестокий [playerDefence] блокировал удар стопой в солнечное сплетение.'
    ],
    draw: 'Ничья - это тоже победа!'
};

window.onload = () => {
    const game = new Game(scorpionData, subzeroData);
}


