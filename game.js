import { createElement, getRandom } from "./utils.js";
import Player from "./player.js";
import { HIT, ATTACK, LOGS } from "./data.js";

export class Game {
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

    generateLogs(type, { name: name1 }, { name: name2, hp: hp2 }, damage) {
        let currentTime = new Date();
        let currentHour = currentTime.getHours();
        let currentMinutes = currentTime.getMinutes().toString().length < 2 ? `0${currentTime.getMinutes()}` : currentTime.getMinutes();
        currentTime = `${currentHour}:${currentMinutes}`;

        let text;
        switch (type) {
            case "start":
                text = `${LOGS[type].replace("[player1]", name1).replace("[player2]", name2).replace("[time]", currentTime)}`;
                break;
            case "end":
                text = `${LOGS[type][getRandom(LOGS[type].length)].replace("[playerWins]", name1).replace("[playerLose]", name2)}`
                break;
            case "hit":
                text = `${currentTime} - ${LOGS[type][getRandom(LOGS[type].length)].replace("[playerKick]", name1).replace("[playerDefence]", name2)} -${damage} [${hp2}/100]`;
                break;
            case "defence":
                text = `${currentTime} - ${LOGS[type][getRandom(LOGS[type].length)].replace("[playerKick]", name1).replace("[playerDefence]", name2)}`;
                break;
            case "draw":
                text = `${LOGS[type]}`
                break;
            default:
                break;
        };

        const el = `<p>${text}</p>`;
        this.$chat.insertAdjacentHTML('afterbegin', el);
    }

    formFightAction() {
        this.$formFight.addEventListener("submit", (e) => {
            e.preventDefault();
            const { hit: hitEnemy, defence: defenceEnemy, value: valueEnemy } = this.enemyAttack();
            const { hit: hitPlayer, defence: defencePlayer, value: valuePlayer } = this.playerAttack();


            if (hitPlayer !== defenceEnemy) {
                this.player2.changeHP(valuePlayer);
                this.player2.renderHP();
                this.generateLogs("hit", this.player1, this.player2, valuePlayer);
            } else {
                this.generateLogs("defence", this.player1, this.player2);
            }

            if (hitEnemy !== defencePlayer) {
                this.player1.changeHP(valueEnemy);
                this.player1.renderHP();
                this.generateLogs("hit", this.player2, this.player1, valueEnemy);
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