import {GRID_COLUMNS } from "./tetrisBoard";
import { Tile } from "./tile";
import {
  PieceOfTiles,
  gridCord,
  PIECE_OBJECT,
} from "./types&declarations";
import { mod } from "./utils";

export class Piece {
  currentPiece: number[][];
  offsets: number[][][];
  tetrominoes: PieceOfTiles;
  centerPiece: Tile;
  rotationIndex: number;
  board: gridCord[][];
  color: `#${string}`

  constructor(
    currentPiece: number[][],
    offsets: number[][][],
    board: gridCord[][],
    rotationIndex: number,
    color: `#${string}`
  ) {
    this.board = board;
    this.currentPiece = currentPiece;
    this.offsets = offsets;
    this.tetrominoes = this.initMinos();
    this.centerPiece = this.tetrominoes[1][1];
    this.rotationIndex = rotationIndex;
    this.color = color
  }

  initMinos(): PieceOfTiles {
    return this.currentPiece.map((row, rowIndex) => {
      return row.map((column, colIndex) => {
        if (column) {
          return new Tile(
            Math.floor(GRID_COLUMNS / 2) + colIndex - 1,
            rowIndex - 3,
            this.board
          );
        }
        return 0;
      });
    }) as PieceOfTiles;
  }

  checkBottom(): boolean {
    let isMovable = true;
    for (let i = 0; i < this.tetrominoes.length; ++i) {
      for (let j = 0; j < this.tetrominoes[i].length; ++j) {
        if (this.tetrominoes[i][j] === 0) continue;
        if (!(this.tetrominoes[i][j] as Tile).checkBottomTile(1)) {
          isMovable = false;
          break;
        }
      }
    }
    return isMovable;
  }

  checkRight(): boolean {
    for (let i = 0; i < this.tetrominoes.length; ++i) {
      for (let j = 0; j < this.tetrominoes[i].length; ++j) {
        if (this.tetrominoes[i][j] === 0) continue;
        if (!(this.tetrominoes[i][j] as Tile).checkRightTile(1)) {
          return false;
        }
      }
    }
    return true;
  }

  checkLeft(): boolean {
    for (let i = 0; i < this.tetrominoes.length; ++i) {
      for (let j = 0; j < this.tetrominoes[i].length; ++j) {
        if (this.tetrominoes[i][j] === 0) continue;
        if (!(this.tetrominoes[i][j] as Tile).checkLeftTile(-1)) {
          return false;
        }
      }
    }
    return true;
  }

  checkGameover(): boolean {
    const boardTop = this.board[0]
    for(let i=0; i < boardTop.length; ++i){
      if (boardTop[i].filled){
        return true
      }
    }
    return false
  }

  dropPiece(isMoveable: boolean) {
    if (!isMoveable){
      for(let i=0; i < this.tetrominoes.length; ++i){
        for(let j=0; j < this.tetrominoes[i].length; ++j){
          if (this.tetrominoes[i][j] === 0) continue;
          const {x, y} = (this.tetrominoes[i][j] as Tile)
          if (y >= 0) {
            this.board[y][x].filled = true
            this.board[y][x].squareColor = this.color          
          }
        }
      }
    }
  }

  playNextPiece(nextPiece: PIECE_OBJECT): void {
    this.currentPiece = nextPiece[0];
    this.offsets = nextPiece[1];
    this.tetrominoes = this.initMinos();
    this.centerPiece = this.tetrominoes[1][1];
    this.rotationIndex = 0;
  }

  rotatePiece(isClockWise: boolean, willOffset: boolean): void {
    const oldRotIndex = this.rotationIndex;
    this.rotationIndex += isClockWise ? 1 : -1;
    this.rotationIndex = mod(this.rotationIndex, 4);
    this.tetrominoes.forEach((row) => {
      row.forEach((column) => {
        if (column && column !== this.centerPiece) {
          column.rotateTile(this.centerPiece, isClockWise);
        }
      });
    });
    if (!willOffset) {
      return;
    }
    const canOffset = this.shouldOffset(oldRotIndex, this.rotationIndex);

    if (!canOffset) {
      this.rotatePiece(!isClockWise, false);
      return;
    }
  }

  shouldOffset(origIndex: number, newindex: number): boolean {
    let shouldMove = false;
    let endOffset: number[] = [];
    for (let testIndex = 0; testIndex < this.offsets.length; ++testIndex) {
      const offsetVal1 = this.offsets[testIndex][origIndex];
      const offsetVal2 = this.offsets[testIndex][newindex];
      endOffset[0] = offsetVal1[0] - offsetVal2[0];
      endOffset[1] = offsetVal1[1] - offsetVal2[1];
      if (this.canOffset(endOffset)) {
        shouldMove = true;
        break;
      }
    }
    if (shouldMove) this.offsetMove(endOffset);
    return shouldMove;
  }

  canOffset(offsetCord: number[]): boolean {
    return this.tetrominoes.every((row) => {
      return row.every((column) => {
        if (column) {
          if (
            offsetCord[0] === 0 &&
            offsetCord[1] === 0 &&
            column.checkPureRot()
          )
            return true;

          if (
            offsetCord[0] > 0 &&
            offsetCord[1] > 0 &&
            column.checkTopRightTile(offsetCord[0], offsetCord[1])
          )
            return true;
          if (
            offsetCord[0] < 0 &&
            offsetCord[1] < 0 &&
            column.checkBottomLeftTile(offsetCord[0], offsetCord[1])
          )
            return true;
          if (
            offsetCord[0] === 0 &&
            offsetCord[1] < 0 &&
            column.moveLeft(0) &&
            column.moveRight(0) &&
            column.checkBottomTile(-offsetCord[1])
          )
            return true;
          if (
            offsetCord[1] === 0 &&
            offsetCord[0] < 0 &&
            column.moveUp(0) &&
            column.moveDown(0) &&
            column.checkLeftTile(offsetCord[0])
          )
            return true;

          if (
            offsetCord[0] > 0 &&
            offsetCord[1] === 0 &&
            column.moveUp(0) &&
            column.moveDown(0) &&
            column.checkRightTile(offsetCord[0])
          )
            return true;

          if (
            offsetCord[0] === 0 &&
            offsetCord[1] > 0 &&
            column.moveRight(0) &&
            column.moveLeft(0) &&
            column.checkTopTile(offsetCord[1])
          )
            return true;

          return false;
        }
        return true;
      });
    });
  }

  offsetMove(offsetCord: number[]) {
    this.tetrominoes.forEach((row) => {
      row.forEach((column) => {
        if (column) {
          const [x, y] = [...offsetCord];
          if (x < 0) column.moveToleft(x);
          else if (x >= 0) column.moveToRight(x);
          if (y < 0) column.moveToBottom(-y);
          else if (y >= 0) column.moveToTop(y);
        }
      });
    });
  }
}