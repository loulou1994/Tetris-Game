import { Game } from ".";
import { GRID_COLUMNS, GRID_ROWS } from "./tetrisBoard";
import {Hexcode, gridCord} from "./types&declarations"

export function randomValue<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
// dispalay game over text
function displayGameover(ctx: CanvasRenderingContext2D){
  ctx.fillStyle = "#00000080"
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.font =  "32px Arial Sans-serif"
  ctx.textAlign = 'center'
  ctx.fillStyle = "#000"
  ctx.fillText("Game Over!", ctx.canvas.width / 2+2, ctx.canvas.height / 2+2)
  ctx.fillStyle = "#fff"
  ctx.fillText("Game Over!", ctx.canvas.width / 2, ctx.canvas.height / 2)
}
// animate the tetris game using requesAnimationFrame func
export function createAnimation(currentGame: Game) {
  let elapsedGameTime = 0;
  function animate(timeStamp: number) {
    const timeElapsed = timeStamp - elapsedGameTime;
    elapsedGameTime = timeStamp;
    currentGame.update(timeElapsed);
    if (!currentGame.gameOver) {
      currentGame.draw();
      currentGame.animationToken = requestAnimationFrame(animate);
    }else displayGameover(currentGame.ctx)
  }
  animate(0);
}
//true modulo operation that works for positive & negative integers
export function mod(x: number, m: number): number {
  return ((x % m) + m) % m;
}
// generate random string of hex-color code
export function genHexColorCode(hexcode: Hexcode, len=6, str=""): `#${string}`{
  if (len < 1) return `#${str}`
  const nextHexcode = randomValue(hexcode);
  if (str.indexOf(nextHexcode) === -1){
    str += nextHexcode
    return genHexColorCode(hexcode, --len, str)
  }
  return genHexColorCode(hexcode, len, str)
}

export function newBoard():gridCord[][] {
  let board: gridCord[][] = []
  for (let i = 0; i < GRID_ROWS; ++i) {
    board[i] = [];
    for (let j = 0; j < GRID_COLUMNS; ++j) {
      board[i][j] = {
        x: j,
        y: i,
        filled: false,
        squareColor: "transparent"
      };
    }
  }
  return board
}