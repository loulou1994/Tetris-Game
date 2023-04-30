import { gridCord, CLOCK_MATRICES } from "./types&declarations";
import { GRID_COLUMNS, GRID_ROWS } from "./tetrisBoard";

export class Tile {
  x: number;
  y: number;
  board: gridCord[][];

  moveToRight(x: number = 1) {
    this.x += x;
  }
  moveToleft(x: number = -1) {
    this.x += x;
  }
  moveToBottom(y: number = 1) {
    this.y += y;
  }
  moveToTop(y: number = 1) {
    this.y -= y;
  }
  moveRight(x: number) {
    return this.x + x < GRID_COLUMNS;
  }
  moveLeft(x: number) {
    return this.x + x >= 0;
  }
  moveDown(y: number) {
    return this.y + y < GRID_ROWS;
  }
  moveUp(y: number) {
    return this.y + y >= 0;
  }
  isTopMostPos() {
    return this.y < 0;
  }

  checkBottomTile(y: number) {
    return (
      this.isTopMostPos() ||
      (this.moveDown(y) && !this.board[this.y + y][this.x].filled)
    );
  }
  checkTopTile(y: number) {
    return this.moveUp(-y) && !this.board[this.y - y][this.x].filled;
  }
  checkRightTile(x: number) {
    return (
      (this.isTopMostPos() && this.moveRight(x)) ||
      (this.moveRight(x) && !this.board[this.y][this.x + x].filled)
    );
  }
  checkLeftTile(x: number) {
    return (
      (this.isTopMostPos() && this.moveLeft(x)) ||
      (this.moveLeft(x) && !this.board[this.y][this.x + x].filled)
    );
  }

  checkBottomRightTile(x: number, y: number) {
    return (
      this.isTopMostPos() ||
      (this.moveDown(-y) &&
        this.moveRight(x) &&
        !this.board[this.y - y][this.x + x].filled)
    );
  }
  checkBottomLeftTile(x: number, y: number) {
    return (
      this.isTopMostPos() ||
      (this.moveDown(-y) &&
        this.moveLeft(x) &&
        !this.board[this.y - y][this.x + x].filled)
    );
  }
  checkTopRightTile(x: number, y: number) {
    return (
      this.moveUp(-y) &&
      this.moveRight(x) &&
      !this.board[this.y - y][this.x + x].filled
    );
  }
  checkTopLeftTile(x: number, y: number) {
    return (
      this.moveUp(-y) &&
      this.moveLeft(x) &&
      !this.board[this.y - y][this.x + x].filled
    );
  }
  checkPureRot() {
    return (
      this.moveRight(0) &&
      this.moveLeft(0) &&
      this.moveDown(0) &&
      this.moveUp(0) &&
      !this.board[this.y][this.x].filled
    );
  }

  draw(ctx: CanvasRenderingContext2D, sizeOfTile: number): void {
    ctx.fillRect(
      this.x * sizeOfTile,
      this.y * sizeOfTile,
      sizeOfTile,
      sizeOfTile
    );
  }
  rotateTile(centerTile: Tile, isClockwise: boolean): void {
    const RELATIVE_POSITION = {
      x: this.x - centerTile.x,
      y: this.y - centerTile.y
    };

    const rotMatrix = {
      x1: isClockwise
        ? CLOCK_MATRICES.CLOCKWISE.x1
        : CLOCK_MATRICES.COUNTER_CLOCKWISE.x1,
      x2: isClockwise
        ? CLOCK_MATRICES.CLOCKWISE.x2
        : CLOCK_MATRICES.COUNTER_CLOCKWISE.x2,
      y1: isClockwise
        ? CLOCK_MATRICES.CLOCKWISE.y1
        : CLOCK_MATRICES.COUNTER_CLOCKWISE.y1,
      y2: isClockwise
        ? CLOCK_MATRICES.CLOCKWISE.y2
        : CLOCK_MATRICES.COUNTER_CLOCKWISE.y2
    };

    const rotationCord = {
      x:
        rotMatrix.x1 * RELATIVE_POSITION.x + rotMatrix.x2 * RELATIVE_POSITION.y,
      y: rotMatrix.y1 * RELATIVE_POSITION.x + rotMatrix.y2 * RELATIVE_POSITION.y
    };

    this.x = rotationCord.x + centerTile.x;
    this.y = rotationCord.y + centerTile.y;
  }
  constructor(x: number, y: number, board: gridCord[][]) {
    this.x = x;
    this.y = y;
    this.board = board;
  }
}
