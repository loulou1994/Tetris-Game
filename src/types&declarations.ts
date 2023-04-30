import { Tile } from "./tile";

// board coordinates type definition
export type gridCord = {
  x: number;
  y: number;
  filled: boolean;
  squareColor: string
};
//a single piece
type Piece = {
  kind: 'piece',
  pieceCords: Array<number[]>
}
//set of pieces
type PieceCollection = {
  kind: 'pieceCollection',
  pieceCords: Array<number[][]>
}
//wrapper containing all the pieces
export type PiecesWrapper = {
  [piece_name: string]: PieceCollection | Piece
}
//possible offset cases of each tetris
export type PiecesOffsets = {
  [piece_name: string]: Array<number[][]>
}
//tetris piece's letter to extract the relevant piece's set of offsets
export enum PieceOffset {
  JLSTZ = "JLSTZ",
  I = "I",
  O = "O"
}
export const CLOCK_MATRICES = {
  CLOCKWISE: {x1: 0, x2: -1, y1: 1, y2: 0},
  COUNTER_CLOCKWISE: {x1: 0, x2: 1, y1: -1, y2: 0}
}
// a piece column has either a tile or is empty
export type PieceColumn = Tile | 0;
// Tetro piece holding a 3x3 dimension of tiles
type PieceRow = [PieceColumn, PieceColumn, PieceColumn]
export type PieceOfTiles = [PieceRow, [PieceColumn, Tile, PieceColumn], PieceRow];
//tetromino object properties definition
export type PIECE_OBJECT = [
  PIECE: number[][],
  OFFSETS: number[][][]
];
export const canvas = document.getElementById("canvas") as HTMLCanvasElement;
export const subCanvas = document.getElementById("subCanvas") as HTMLCanvasElement
export const cvsContext = canvas.getContext("2d") as CanvasRenderingContext2D;
export const subCanvasCtx = subCanvas.getContext("2d") as CanvasRenderingContext2D;
export const scoreEl = document.getElementById("score") as HTMLSpanElement
export const resetBtn = document.getElementById("reset") as HTMLButtonElement

// generate 6-digit hexcode color value for each piece
type HexValues = "0"|"1"|"2"| "3"| "4"| "5"| "6"| "7"| "8"| "9"|"10"| "A"| "B"|"C"| "D"| "E"|"F"
export type Hexcode = HexValues[]
export const setOfHexvalues: Hexcode = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"]