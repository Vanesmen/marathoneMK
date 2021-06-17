import { scorpionData, subzeroData } from "./data.js";
import { Game } from "./game.js";

window.onload = () => {
    const game = new Game(scorpionData, subzeroData);
}


