import { Game } from "./index";

export class Input {
  constructor(game: Game) {
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowLeft":
        case "ArrowDown":
        case "x":
        case "s":
          if (!game.playerinput.includes(e.key)) game.playerinput.push(e.key);
          break;
        default:
          return;
      }
    });
    window.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowLeft":
        case "ArrowDown":
        case "x":
        case "s":
          if (game.playerinput.includes(e.key))
            game.playerinput.splice(game.playerinput.indexOf(e.key), 1);
          break;
        default:
          return;
      }
    });
  }
}
