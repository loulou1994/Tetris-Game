import {
  cvsContext,
  subCanvasCtx,
  canvas,
  PIECE_OBJECT,
  setOfHexvalues,
  scoreEl,
  resetBtn
} from "./types&declarations";
import { Board, TILE_SIZE } from "./tetrisBoard";
import { Piece } from "./currentPiece";
import { Input } from "./inputHandler";
import { createAnimation, genHexColorCode, newBoard } from "./utils";
import { initiatePiece } from "./piecesController";

export class Game {
  ctx: CanvasRenderingContext2D;
  subCvsCtx: CanvasRenderingContext2D;
  board: Board;
  piece: Piece;
  nextPiece: PIECE_OBJECT;
  inputClass: Input;
  playerinput: string[] = [];
  gameSpeedPerMiliSec: number;
  gameTimeInterval: number;
  miliSecPerFrames: number;
  frameTimeInterval: number;
  scoreElement = scoreEl;
  gameOver: boolean;
  animationToken = 0;

  update(timePassed: number): void {
    this.gameTimeInterval += timePassed;
    this.frameTimeInterval += timePassed;

    if (this.gameTimeInterval >= this.gameSpeedPerMiliSec) {
      //rotating clockwise or counter-clockwise based on the key pressed
      if (this.playerinput.includes("s")) this.piece.rotatePiece(true, true);
      if (this.playerinput.includes("x")) this.piece.rotatePiece(false, true);

      // keep the piece dropping or fix it on floor
      const pieceIsMoving = this.piece.checkBottom();
      if (pieceIsMoving) {
        this.piece.tetrominoes.forEach((row) => {
          row.forEach((column) => {
            if (column) {
              column.moveToBottom();
            }
          });
        });
      } else {
        this.piece.dropPiece(pieceIsMoving);
        this.board.removeBoardRow();
        this.scoreElement.textContent = this.board.score.toString();
        this.piece = new Piece(
          ...this.nextPiece,
          this.board.map,
          0,
          genHexColorCode(setOfHexvalues)
        );
        this.nextPiece = initiatePiece();
      }
      this.gameOver = this.piece.checkGameover();
      this.gameTimeInterval = 0;
    }
    if (this.frameTimeInterval >= this.miliSecPerFrames) {
      if (this.playerinput.includes("ArrowRight") && this.piece.checkRight()) {
        this.piece.tetrominoes.forEach((row) => {
          row.forEach((column) => {
            if (column) column.moveToRight();
          });
        });
      }
      if (this.playerinput.includes("ArrowLeft") && this.piece.checkLeft()) {
        this.piece.tetrominoes.forEach((row) => {
          row.forEach((column) => {
            if (column) column.moveToleft();
          });
        });
      }
      if (this.playerinput.includes("ArrowDown") && this.piece.checkBottom()) {
        this.piece.tetrominoes.forEach((row) => {
          row.forEach((column) => {
            if (column) column.moveToBottom();
          });
        });
      }
      this.frameTimeInterval = 0;
    }
  }

  draw(): void {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    //draw fixed squares on board
    this.board.draw(this.ctx);
    //draw current piece
    this.piece.tetrominoes.forEach((row) => {
      row.forEach((column) => {
        if (column) {
          this.ctx.fillStyle = this.piece.color;
          column.draw(this.ctx, this.board.tileSize);
        }
      });
    });
    this.drawNextPiece();
  }

  drawNextPiece() {
    this.subCvsCtx.clearRect(
      0,
      0,
      subCanvasCtx.canvas.width,
      subCanvasCtx.canvas.height
    );
    this.subCvsCtx.fillStyle = "#ef709b";
    this.subCvsCtx.fillRect(
      0,
      0,
      this.subCvsCtx.canvas.width,
      this.subCvsCtx.canvas.height
    );
    this.subCvsCtx.fillStyle = "#000";
    this.nextPiece[0].forEach((row, rowIndex) => {
      row.forEach((column, colIndex) => {
        if (column) {
          this.subCvsCtx.fillRect(
            20 * (colIndex + 1),
            20 * (rowIndex + 1),
            20,
            20
          );
        }
      });
    });
  }
  constructor(
    ctx: CanvasRenderingContext2D,
    subCvsCtx: CanvasRenderingContext2D,
    board: Board,
    tileSize: number
  ) {
    this.ctx = ctx;
    this.subCvsCtx = subCvsCtx;
    this.board = board;
    this.piece = new Piece(
      ...initiatePiece(),
      this.board.map,
      0,
      genHexColorCode(setOfHexvalues)
    );
    this.nextPiece = initiatePiece();
    this.inputClass = new Input(this);
    this.gameSpeedPerMiliSec = 1000 / 5;
    this.miliSecPerFrames = 2000 / 16.67;
    this.gameTimeInterval = 0;
    this.frameTimeInterval = 0;
    this.gameOver = false;
  }
}
let newGame = new Game(
  cvsContext,
  subCanvasCtx,
  new Board(TILE_SIZE),
  TILE_SIZE
);
createAnimation(newGame);

resetBtn.addEventListener("click", () => {
  cancelAnimationFrame(newGame.animationToken);
  scoreEl.textContent = "0";
  newGame = new Game(cvsContext, subCanvasCtx, new Board(TILE_SIZE), TILE_SIZE);
  createAnimation(newGame);
});
