import { createElement, getRandom } from "./utils.js";
import Player from "./player.js";
import { scorpionData, subzeroData, HIT, ATTACK, logs } from "./data.js";

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

window.onload = () => {
    const game = new Game(scorpionData, subzeroData);
}


