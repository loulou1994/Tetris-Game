import { gridCord } from "./types&declarations";
import { canvas } from "./types&declarations";
import { newBoard } from "./utils";

//tetris board dimensions
export const TILE_SIZE = 30;
export const GRID_COLUMNS = canvas.width / TILE_SIZE;
export const GRID_ROWS = canvas.height / TILE_SIZE;

export class Board {
  map: gridCord[][];
  tileSize: number;
  score = 0;
  blankSpace = 4;

  constructor(tileSize: number) {
    this.map = newBoard();
    this.tileSize = tileSize;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // draw map bg color
    ctx.fillStyle = "#bca0dc";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    //white space separator between tiles
    ctx.fillStyle = "#fff";
    for (let i = 0; i <= this.map[0].length; ++i) {
      const x =
        i * this.tileSize - this.blankSpace >= 0
          ? i * this.tileSize - this.blankSpace
          : 0;
      ctx.fillRect(x, 0, this.blankSpace, ctx.canvas.height);
    }
    for (let j = 0; j <= this.map.length; ++j) {
      const y =
        j * this.tileSize - this.blankSpace >= 0
          ? j * this.tileSize - this.blankSpace
          : 0;
      ctx.fillRect(0, y, ctx.canvas.width, this.blankSpace);
    }

    this.map.forEach((row) => {
      row.forEach((column) => {
        if (column.filled) {
          ctx.fillStyle = column.squareColor;
          ctx.fillRect(
            column.x * this.tileSize,
            column.y * this.tileSize,
            this.tileSize,
            this.tileSize
          );
        }
      });
    });
  }

  removeBoardRow() {
    for (let i = 0; i < this.map.length; ++i) {
      let isFilled = true;
      for (let j: number = 0; j < this.map[i].length; ++j) {
        if (!this.map[i][j].filled) {
          isFilled = false;
        }
      }
      if (isFilled) {
        this.score += 2;
        for (let k = i; k > 0; --k) {
          for (let l = 0; l < this.map[k].length; ++l) {
            this.map[k][l].filled = this.map[k - 1][l].filled;
            this.map[k][l].squareColor = this.map[k - 1][l].squareColor;
          }
        }
        for (let i = 0; i < GRID_COLUMNS; ++i) {
          this.map[0][i] = {
            x: i,
            y: GRID_ROWS - 1,
            filled: false,
            squareColor: "transparent"
          };
        }
      }
    }
  }
}
