import {
  PIECE_OBJECT,
  PieceOffset,
  PiecesOffsets,
  PiecesWrapper
} from "./types&declarations";
import { randomValue } from "./utils";

export const OFFSETS: PiecesOffsets = {
  JLSTZ: [
    [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0]
    ],
    [
      [0, 0],
      [1, 0],
      [0, 0],
      [-1, 0]
    ],
    [
      [0, 0],
      [1, -1],
      [0, 0],
      [-1, -1]
    ],
    [
      [0, 0],
      [0, 2],
      [0, 0],
      [0, 2]
    ],
    [
      [0, 0],
      [1, 2],
      [0, 0],
      [-1, 2]
    ]
  ],
  I: [
    [
      [0, 0],
      [-1, 0],
      [-1, 1],
      [0, 1]
    ],
    [
      [-1, 0],
      [0, 0],
      [1, 1],
      [0, 1]
    ],
    [
      [2, 0],
      [0, 0],
      [-2, 1],
      [0, 1]
    ],
    [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1]
    ],
    [
      [2, 0],
      [0, -2],
      [-2, 0],
      [0, 2]
    ]
  ],
  O: [
    [
      [0, 0],
      [0, -1],
      [-1, -1],
      [-1, 0]
    ]
  ]
};

export const PIECES: PiecesWrapper = {
  JLSTZ: {
    pieceCords: [
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
      ]
    ],
    kind: "pieceCollection"
  },
  O: {
    pieceCords: [
      [0, 1, 1],
      [0, 1, 1],
      [0, 0, 0]
    ],
    kind: "piece"
  },
  I: {
    pieceCords: [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    kind: "piece"
  }
};

export function initiatePiece(): PIECE_OBJECT {
  const chosenPieceLetter = randomValue(Object.keys(PieceOffset));
  const pieceOffsets = OFFSETS[chosenPieceLetter];
  let chosenPiece = PIECES[chosenPieceLetter];

  if (chosenPiece.kind === "pieceCollection") {
    return [randomValue(chosenPiece.pieceCords), pieceOffsets];
  }
  return [chosenPiece.pieceCords, pieceOffsets];
}
