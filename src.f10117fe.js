// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/types&declarations.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setOfHexvalues = exports.resetBtn = exports.scoreEl = exports.subCanvasCtx = exports.cvsContext = exports.subCanvas = exports.canvas = exports.CLOCK_MATRICES = exports.PieceOffset = void 0;
//tetris piece's letter to extract the relevant piece's set of offsets
var PieceOffset;
(function (PieceOffset) {
  PieceOffset["JLSTZ"] = "JLSTZ";
  PieceOffset["I"] = "I";
  PieceOffset["O"] = "O";
})(PieceOffset = exports.PieceOffset || (exports.PieceOffset = {}));
exports.CLOCK_MATRICES = {
  CLOCKWISE: {
    x1: 0,
    x2: -1,
    y1: 1,
    y2: 0
  },
  COUNTER_CLOCKWISE: {
    x1: 0,
    x2: 1,
    y1: -1,
    y2: 0
  }
};
exports.canvas = document.getElementById("canvas");
exports.subCanvas = document.getElementById("subCanvas");
exports.cvsContext = exports.canvas.getContext("2d");
exports.subCanvasCtx = exports.subCanvas.getContext("2d");
exports.scoreEl = document.getElementById("score");
exports.resetBtn = document.getElementById("reset");
exports.setOfHexvalues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
},{}],"src/utils.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newBoard = exports.genHexColorCode = exports.mod = exports.createAnimation = exports.randomValue = void 0;
var tetrisBoard_1 = require("./tetrisBoard");
function randomValue(array) {
  return array[Math.floor(Math.random() * array.length)];
}
exports.randomValue = randomValue;
// dispalay game over text
function displayGameover(ctx) {
  ctx.fillStyle = "#00000080";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.font = "32px Arial Sans-serif";
  ctx.textAlign = 'center';
  ctx.fillStyle = "#000";
  ctx.fillText("Game Over!", ctx.canvas.width / 2 + 2, ctx.canvas.height / 2 + 2);
  ctx.fillStyle = "#fff";
  ctx.fillText("Game Over!", ctx.canvas.width / 2, ctx.canvas.height / 2);
}
// animate the tetris game using requesAnimationFrame func
function createAnimation(currentGame) {
  var elapsedGameTime = 0;
  function animate(timeStamp) {
    var timeElapsed = timeStamp - elapsedGameTime;
    elapsedGameTime = timeStamp;
    currentGame.update(timeElapsed);
    if (!currentGame.gameOver) {
      currentGame.draw();
      currentGame.animationToken = requestAnimationFrame(animate);
    } else displayGameover(currentGame.ctx);
  }
  animate(0);
}
exports.createAnimation = createAnimation;
//true modulo operation that works for positive & negative integers
function mod(x, m) {
  return (x % m + m) % m;
}
exports.mod = mod;
// generate random string of hex-color code
function genHexColorCode(hexcode, len, str) {
  if (len === void 0) {
    len = 6;
  }
  if (str === void 0) {
    str = "";
  }
  if (len < 1) return "#" + str;
  var nextHexcode = randomValue(hexcode);
  if (str.indexOf(nextHexcode) === -1) {
    str += nextHexcode;
    return genHexColorCode(hexcode, --len, str);
  }
  return genHexColorCode(hexcode, len, str);
}
exports.genHexColorCode = genHexColorCode;
function newBoard() {
  var board = [];
  for (var i = 0; i < tetrisBoard_1.GRID_ROWS; ++i) {
    board[i] = [];
    for (var j = 0; j < tetrisBoard_1.GRID_COLUMNS; ++j) {
      board[i][j] = {
        x: j,
        y: i,
        filled: false,
        squareColor: "transparent"
      };
    }
  }
  return board;
}
exports.newBoard = newBoard;
},{"./tetrisBoard":"src/tetrisBoard.ts"}],"src/tetrisBoard.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Board = exports.GRID_ROWS = exports.GRID_COLUMNS = exports.TILE_SIZE = void 0;
var types_declarations_1 = require("./types&declarations");
var utils_1 = require("./utils");
//tetris board dimensions
exports.TILE_SIZE = 30;
exports.GRID_COLUMNS = types_declarations_1.canvas.width / exports.TILE_SIZE;
exports.GRID_ROWS = types_declarations_1.canvas.height / exports.TILE_SIZE;
var Board = /** @class */function () {
  function Board(tileSize) {
    this.score = 0;
    this.blankSpace = 4;
    this.map = (0, utils_1.newBoard)();
    this.tileSize = tileSize;
  }
  Board.prototype.draw = function (ctx) {
    var _this = this;
    // draw map bg color
    ctx.fillStyle = "#bca0dc";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //white space separator between tiles
    ctx.fillStyle = "#fff";
    for (var i = 0; i <= this.map[0].length; ++i) {
      var x = i * this.tileSize - this.blankSpace >= 0 ? i * this.tileSize - this.blankSpace : 0;
      ctx.fillRect(x, 0, this.blankSpace, ctx.canvas.height);
    }
    for (var j = 0; j <= this.map.length; ++j) {
      var y = j * this.tileSize - this.blankSpace >= 0 ? j * this.tileSize - this.blankSpace : 0;
      ctx.fillRect(0, y, ctx.canvas.width, this.blankSpace);
    }
    this.map.forEach(function (row) {
      row.forEach(function (column) {
        if (column.filled) {
          ctx.fillStyle = column.squareColor;
          ctx.fillRect(column.x * _this.tileSize, column.y * _this.tileSize, _this.tileSize, _this.tileSize);
        }
      });
    });
  };
  Board.prototype.removeBoardRow = function () {
    for (var i = 0; i < this.map.length; ++i) {
      var isFilled = true;
      for (var j = 0; j < this.map[i].length; ++j) {
        if (!this.map[i][j].filled) {
          isFilled = false;
        }
      }
      if (isFilled) {
        this.score += 2;
        for (var k = i; k > 0; --k) {
          for (var l = 0; l < this.map[k].length; ++l) {
            this.map[k][l].filled = this.map[k - 1][l].filled;
            this.map[k][l].squareColor = this.map[k - 1][l].squareColor;
          }
        }
        for (var i_1 = 0; i_1 < exports.GRID_COLUMNS; ++i_1) {
          this.map[0][i_1] = {
            x: i_1,
            y: exports.GRID_ROWS - 1,
            filled: false,
            squareColor: "transparent"
          };
        }
      }
    }
  };
  return Board;
}();
exports.Board = Board;
},{"./types&declarations":"src/types&declarations.ts","./utils":"src/utils.ts"}],"src/tile.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tile = void 0;
var types_declarations_1 = require("./types&declarations");
var tetrisBoard_1 = require("./tetrisBoard");
var Tile = /** @class */function () {
  function Tile(x, y, board) {
    this.x = x;
    this.y = y;
    this.board = board;
  }
  Tile.prototype.moveToRight = function (x) {
    if (x === void 0) {
      x = 1;
    }
    this.x += x;
  };
  Tile.prototype.moveToleft = function (x) {
    if (x === void 0) {
      x = -1;
    }
    this.x += x;
  };
  Tile.prototype.moveToBottom = function (y) {
    if (y === void 0) {
      y = 1;
    }
    this.y += y;
  };
  Tile.prototype.moveToTop = function (y) {
    if (y === void 0) {
      y = 1;
    }
    this.y -= y;
  };
  Tile.prototype.moveRight = function (x) {
    return this.x + x < tetrisBoard_1.GRID_COLUMNS;
  };
  Tile.prototype.moveLeft = function (x) {
    return this.x + x >= 0;
  };
  Tile.prototype.moveDown = function (y) {
    return this.y + y < tetrisBoard_1.GRID_ROWS;
  };
  Tile.prototype.moveUp = function (y) {
    return this.y + y >= 0;
  };
  Tile.prototype.isTopMostPos = function () {
    return this.y < 0;
  };
  Tile.prototype.checkBottomTile = function (y) {
    return this.isTopMostPos() || this.moveDown(y) && !this.board[this.y + y][this.x].filled;
  };
  Tile.prototype.checkTopTile = function (y) {
    return this.moveUp(-y) && !this.board[this.y - y][this.x].filled;
  };
  Tile.prototype.checkRightTile = function (x) {
    return this.isTopMostPos() && this.moveRight(x) || this.moveRight(x) && !this.board[this.y][this.x + x].filled;
  };
  Tile.prototype.checkLeftTile = function (x) {
    return this.isTopMostPos() && this.moveLeft(x) || this.moveLeft(x) && !this.board[this.y][this.x + x].filled;
  };
  Tile.prototype.checkBottomRightTile = function (x, y) {
    return this.isTopMostPos() || this.moveDown(-y) && this.moveRight(x) && !this.board[this.y - y][this.x + x].filled;
  };
  Tile.prototype.checkBottomLeftTile = function (x, y) {
    return this.isTopMostPos() || this.moveDown(-y) && this.moveLeft(x) && !this.board[this.y - y][this.x + x].filled;
  };
  Tile.prototype.checkTopRightTile = function (x, y) {
    return this.moveUp(-y) && this.moveRight(x) && !this.board[this.y - y][this.x + x].filled;
  };
  Tile.prototype.checkTopLeftTile = function (x, y) {
    return this.moveUp(-y) && this.moveLeft(x) && !this.board[this.y - y][this.x + x].filled;
  };
  Tile.prototype.checkPureRot = function () {
    return this.moveRight(0) && this.moveLeft(0) && this.moveDown(0) && this.moveUp(0) && !this.board[this.y][this.x].filled;
  };
  Tile.prototype.draw = function (ctx, sizeOfTile) {
    ctx.fillRect(this.x * sizeOfTile, this.y * sizeOfTile, sizeOfTile, sizeOfTile);
  };
  Tile.prototype.rotateTile = function (centerTile, isClockwise) {
    var RELATIVE_POSITION = {
      x: this.x - centerTile.x,
      y: this.y - centerTile.y
    };
    var rotMatrix = {
      x1: isClockwise ? types_declarations_1.CLOCK_MATRICES.CLOCKWISE.x1 : types_declarations_1.CLOCK_MATRICES.COUNTER_CLOCKWISE.x1,
      x2: isClockwise ? types_declarations_1.CLOCK_MATRICES.CLOCKWISE.x2 : types_declarations_1.CLOCK_MATRICES.COUNTER_CLOCKWISE.x2,
      y1: isClockwise ? types_declarations_1.CLOCK_MATRICES.CLOCKWISE.y1 : types_declarations_1.CLOCK_MATRICES.COUNTER_CLOCKWISE.y1,
      y2: isClockwise ? types_declarations_1.CLOCK_MATRICES.CLOCKWISE.y2 : types_declarations_1.CLOCK_MATRICES.COUNTER_CLOCKWISE.y2
    };
    var rotationCord = {
      x: rotMatrix.x1 * RELATIVE_POSITION.x + rotMatrix.x2 * RELATIVE_POSITION.y,
      y: rotMatrix.y1 * RELATIVE_POSITION.x + rotMatrix.y2 * RELATIVE_POSITION.y
    };
    this.x = rotationCord.x + centerTile.x;
    this.y = rotationCord.y + centerTile.y;
  };
  return Tile;
}();
exports.Tile = Tile;
},{"./types&declarations":"src/types&declarations.ts","./tetrisBoard":"src/tetrisBoard.ts"}],"src/currentPiece.ts":[function(require,module,exports) {
"use strict";

var __spreadArray = this && this.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Piece = void 0;
var tetrisBoard_1 = require("./tetrisBoard");
var tile_1 = require("./tile");
var utils_1 = require("./utils");
var Piece = /** @class */function () {
  function Piece(currentPiece, offsets, board, rotationIndex, color) {
    this.board = board;
    this.currentPiece = currentPiece;
    this.offsets = offsets;
    this.tetrominoes = this.initMinos();
    this.centerPiece = this.tetrominoes[1][1];
    this.rotationIndex = rotationIndex;
    this.color = color;
  }
  Piece.prototype.initMinos = function () {
    var _this = this;
    return this.currentPiece.map(function (row, rowIndex) {
      return row.map(function (column, colIndex) {
        if (column) {
          return new tile_1.Tile(Math.floor(tetrisBoard_1.GRID_COLUMNS / 2) + colIndex - 1, rowIndex - 3, _this.board);
        }
        return 0;
      });
    });
  };
  Piece.prototype.checkBottom = function () {
    var isMovable = true;
    for (var i = 0; i < this.tetrominoes.length; ++i) {
      for (var j = 0; j < this.tetrominoes[i].length; ++j) {
        if (this.tetrominoes[i][j] === 0) continue;
        if (!this.tetrominoes[i][j].checkBottomTile(1)) {
          isMovable = false;
          break;
        }
      }
    }
    return isMovable;
  };
  Piece.prototype.checkRight = function () {
    for (var i = 0; i < this.tetrominoes.length; ++i) {
      for (var j = 0; j < this.tetrominoes[i].length; ++j) {
        if (this.tetrominoes[i][j] === 0) continue;
        if (!this.tetrominoes[i][j].checkRightTile(1)) {
          return false;
        }
      }
    }
    return true;
  };
  Piece.prototype.checkLeft = function () {
    for (var i = 0; i < this.tetrominoes.length; ++i) {
      for (var j = 0; j < this.tetrominoes[i].length; ++j) {
        if (this.tetrominoes[i][j] === 0) continue;
        if (!this.tetrominoes[i][j].checkLeftTile(-1)) {
          return false;
        }
      }
    }
    return true;
  };
  Piece.prototype.checkGameover = function () {
    var boardTop = this.board[0];
    for (var i = 0; i < boardTop.length; ++i) {
      if (boardTop[i].filled) {
        return true;
      }
    }
    return false;
  };
  Piece.prototype.dropPiece = function (isMoveable) {
    if (!isMoveable) {
      for (var i = 0; i < this.tetrominoes.length; ++i) {
        for (var j = 0; j < this.tetrominoes[i].length; ++j) {
          if (this.tetrominoes[i][j] === 0) continue;
          var _a = this.tetrominoes[i][j],
            x = _a.x,
            y = _a.y;
          if (y >= 0) {
            this.board[y][x].filled = true;
            this.board[y][x].squareColor = this.color;
          }
        }
      }
    }
  };
  Piece.prototype.playNextPiece = function (nextPiece) {
    this.currentPiece = nextPiece[0];
    this.offsets = nextPiece[1];
    this.tetrominoes = this.initMinos();
    this.centerPiece = this.tetrominoes[1][1];
    this.rotationIndex = 0;
  };
  Piece.prototype.rotatePiece = function (isClockWise, willOffset) {
    var _this = this;
    var oldRotIndex = this.rotationIndex;
    this.rotationIndex += isClockWise ? 1 : -1;
    this.rotationIndex = (0, utils_1.mod)(this.rotationIndex, 4);
    this.tetrominoes.forEach(function (row) {
      row.forEach(function (column) {
        if (column && column !== _this.centerPiece) {
          column.rotateTile(_this.centerPiece, isClockWise);
        }
      });
    });
    if (!willOffset) {
      return;
    }
    var canOffset = this.shouldOffset(oldRotIndex, this.rotationIndex);
    if (!canOffset) {
      this.rotatePiece(!isClockWise, false);
      return;
    }
  };
  Piece.prototype.shouldOffset = function (origIndex, newindex) {
    var shouldMove = false;
    var endOffset = [];
    for (var testIndex = 0; testIndex < this.offsets.length; ++testIndex) {
      var offsetVal1 = this.offsets[testIndex][origIndex];
      var offsetVal2 = this.offsets[testIndex][newindex];
      endOffset[0] = offsetVal1[0] - offsetVal2[0];
      endOffset[1] = offsetVal1[1] - offsetVal2[1];
      if (this.canOffset(endOffset)) {
        shouldMove = true;
        break;
      }
    }
    if (shouldMove) this.offsetMove(endOffset);
    return shouldMove;
  };
  Piece.prototype.canOffset = function (offsetCord) {
    return this.tetrominoes.every(function (row) {
      return row.every(function (column) {
        if (column) {
          if (offsetCord[0] === 0 && offsetCord[1] === 0 && column.checkPureRot()) return true;
          if (offsetCord[0] > 0 && offsetCord[1] > 0 && column.checkTopRightTile(offsetCord[0], offsetCord[1])) return true;
          if (offsetCord[0] < 0 && offsetCord[1] < 0 && column.checkBottomLeftTile(offsetCord[0], offsetCord[1])) return true;
          if (offsetCord[0] === 0 && offsetCord[1] < 0 && column.moveLeft(0) && column.moveRight(0) && column.checkBottomTile(-offsetCord[1])) return true;
          if (offsetCord[1] === 0 && offsetCord[0] < 0 && column.moveUp(0) && column.moveDown(0) && column.checkLeftTile(offsetCord[0])) return true;
          if (offsetCord[0] > 0 && offsetCord[1] === 0 && column.moveUp(0) && column.moveDown(0) && column.checkRightTile(offsetCord[0])) return true;
          if (offsetCord[0] === 0 && offsetCord[1] > 0 && column.moveRight(0) && column.moveLeft(0) && column.checkTopTile(offsetCord[1])) return true;
          return false;
        }
        return true;
      });
    });
  };
  Piece.prototype.offsetMove = function (offsetCord) {
    this.tetrominoes.forEach(function (row) {
      row.forEach(function (column) {
        if (column) {
          var _a = __spreadArray([], offsetCord, true),
            x = _a[0],
            y = _a[1];
          if (x < 0) column.moveToleft(x);else if (x >= 0) column.moveToRight(x);
          if (y < 0) column.moveToBottom(-y);else if (y >= 0) column.moveToTop(y);
        }
      });
    });
  };
  return Piece;
}();
exports.Piece = Piece;
},{"./tetrisBoard":"src/tetrisBoard.ts","./tile":"src/tile.ts","./utils":"src/utils.ts"}],"src/inputHandler.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Input = void 0;
var Input = /** @class */function () {
  function Input(game) {
    window.addEventListener("keydown", function (e) {
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
    window.addEventListener("keyup", function (e) {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowLeft":
        case "ArrowDown":
        case "x":
        case "s":
          if (game.playerinput.includes(e.key)) game.playerinput.splice(game.playerinput.indexOf(e.key), 1);
          break;
        default:
          return;
      }
    });
  }
  return Input;
}();
exports.Input = Input;
},{}],"src/piecesController.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initiatePiece = exports.PIECES = exports.OFFSETS = void 0;
var types_declarations_1 = require("./types&declarations");
var utils_1 = require("./utils");
exports.OFFSETS = {
  JLSTZ: [[[0, 0], [0, 0], [0, 0], [0, 0]], [[0, 0], [1, 0], [0, 0], [-1, 0]], [[0, 0], [1, -1], [0, 0], [-1, -1]], [[0, 0], [0, 2], [0, 0], [0, 2]], [[0, 0], [1, 2], [0, 0], [-1, 2]]],
  I: [[[0, 0], [-1, 0], [-1, 1], [0, 1]], [[-1, 0], [0, 0], [1, 1], [0, 1]], [[2, 0], [0, 0], [-2, 1], [0, 1]], [[-1, 0], [0, 1], [1, 0], [0, -1]], [[2, 0], [0, -2], [-2, 0], [0, 2]]],
  O: [[[0, 0], [0, -1], [-1, -1], [-1, 0]]]
};
exports.PIECES = {
  JLSTZ: {
    pieceCords: [[[1, 0, 0], [1, 1, 1], [0, 0, 0]], [[0, 0, 1], [1, 1, 1], [0, 0, 0]], [[0, 1, 1], [1, 1, 0], [0, 0, 0]], [[0, 1, 0], [1, 1, 1], [0, 0, 0]], [[1, 1, 0], [0, 1, 1], [0, 0, 0]]],
    kind: "pieceCollection"
  },
  O: {
    pieceCords: [[0, 1, 1], [0, 1, 1], [0, 0, 0]],
    kind: "piece"
  },
  I: {
    pieceCords: [[0, 0, 0], [1, 1, 1], [0, 0, 0]],
    kind: "piece"
  }
};
function initiatePiece() {
  var chosenPieceLetter = (0, utils_1.randomValue)(Object.keys(types_declarations_1.PieceOffset));
  var pieceOffsets = exports.OFFSETS[chosenPieceLetter];
  var chosenPiece = exports.PIECES[chosenPieceLetter];
  if (chosenPiece.kind === "pieceCollection") {
    return [(0, utils_1.randomValue)(chosenPiece.pieceCords), pieceOffsets];
  }
  return [chosenPiece.pieceCords, pieceOffsets];
}
exports.initiatePiece = initiatePiece;
},{"./types&declarations":"src/types&declarations.ts","./utils":"src/utils.ts"}],"src/index.ts":[function(require,module,exports) {
"use strict";

var __spreadArray = this && this.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Game = void 0;
var types_declarations_1 = require("./types&declarations");
var tetrisBoard_1 = require("./tetrisBoard");
var currentPiece_1 = require("./currentPiece");
var inputHandler_1 = require("./inputHandler");
var utils_1 = require("./utils");
var piecesController_1 = require("./piecesController");
var Game = /** @class */function () {
  function Game(ctx, subCvsCtx, board, tileSize) {
    this.playerinput = [];
    this.scoreElement = types_declarations_1.scoreEl;
    this.animationToken = 0;
    this.ctx = ctx;
    this.subCvsCtx = subCvsCtx;
    this.board = board;
    this.piece = new (currentPiece_1.Piece.bind.apply(currentPiece_1.Piece, __spreadArray(__spreadArray([void 0], (0, piecesController_1.initiatePiece)(), false), [this.board.map, 0, (0, utils_1.genHexColorCode)(types_declarations_1.setOfHexvalues)], false)))();
    this.nextPiece = (0, piecesController_1.initiatePiece)();
    this.inputClass = new inputHandler_1.Input(this);
    this.gameSpeedPerMiliSec = 1000 / 5;
    this.miliSecPerFrames = 2000 / 16.67;
    this.gameTimeInterval = 0;
    this.frameTimeInterval = 0;
    this.gameOver = false;
  }
  Game.prototype.update = function (timePassed) {
    this.gameTimeInterval += timePassed;
    this.frameTimeInterval += timePassed;
    if (this.gameTimeInterval >= this.gameSpeedPerMiliSec) {
      //rotating clockwise or counter-clockwise based on the key pressed
      if (this.playerinput.includes("s")) this.piece.rotatePiece(true, true);
      if (this.playerinput.includes("x")) this.piece.rotatePiece(false, true);
      // keep the piece dropping or fix it on floor
      var pieceIsMoving = this.piece.checkBottom();
      if (pieceIsMoving) {
        this.piece.tetrominoes.forEach(function (row) {
          row.forEach(function (column) {
            if (column) {
              column.moveToBottom();
            }
          });
        });
      } else {
        this.piece.dropPiece(pieceIsMoving);
        this.board.removeBoardRow();
        this.scoreElement.textContent = this.board.score.toString();
        this.piece = new (currentPiece_1.Piece.bind.apply(currentPiece_1.Piece, __spreadArray(__spreadArray([void 0], this.nextPiece, false), [this.board.map, 0, (0, utils_1.genHexColorCode)(types_declarations_1.setOfHexvalues)], false)))();
        this.nextPiece = (0, piecesController_1.initiatePiece)();
      }
      this.gameOver = this.piece.checkGameover();
      this.gameTimeInterval = 0;
    }
    if (this.frameTimeInterval >= this.miliSecPerFrames) {
      if (this.playerinput.includes("ArrowRight") && this.piece.checkRight()) {
        this.piece.tetrominoes.forEach(function (row) {
          row.forEach(function (column) {
            if (column) column.moveToRight();
          });
        });
      }
      if (this.playerinput.includes("ArrowLeft") && this.piece.checkLeft()) {
        this.piece.tetrominoes.forEach(function (row) {
          row.forEach(function (column) {
            if (column) column.moveToleft();
          });
        });
      }
      if (this.playerinput.includes("ArrowDown") && this.piece.checkBottom()) {
        this.piece.tetrominoes.forEach(function (row) {
          row.forEach(function (column) {
            if (column) column.moveToBottom();
          });
        });
      }
      this.frameTimeInterval = 0;
    }
  };
  Game.prototype.draw = function () {
    var _this = this;
    this.ctx.clearRect(0, 0, types_declarations_1.canvas.width, types_declarations_1.canvas.height);
    //draw fixed squares on board
    this.board.draw(this.ctx);
    //draw current piece
    this.piece.tetrominoes.forEach(function (row) {
      row.forEach(function (column) {
        if (column) {
          _this.ctx.fillStyle = _this.piece.color;
          column.draw(_this.ctx, _this.board.tileSize);
        }
      });
    });
    this.drawNextPiece();
  };
  Game.prototype.drawNextPiece = function () {
    var _this = this;
    this.subCvsCtx.clearRect(0, 0, types_declarations_1.subCanvasCtx.canvas.width, types_declarations_1.subCanvasCtx.canvas.height);
    this.subCvsCtx.fillStyle = "#ef709b";
    this.subCvsCtx.fillRect(0, 0, this.subCvsCtx.canvas.width, this.subCvsCtx.canvas.height);
    this.subCvsCtx.fillStyle = "#000";
    this.nextPiece[0].forEach(function (row, rowIndex) {
      row.forEach(function (column, colIndex) {
        if (column) {
          _this.subCvsCtx.fillRect(20 * (colIndex + 1), 20 * (rowIndex + 1), 20, 20);
        }
      });
    });
  };
  return Game;
}();
exports.Game = Game;
var newGame = new Game(types_declarations_1.cvsContext, types_declarations_1.subCanvasCtx, new tetrisBoard_1.Board(tetrisBoard_1.TILE_SIZE), tetrisBoard_1.TILE_SIZE);
(0, utils_1.createAnimation)(newGame);
types_declarations_1.resetBtn.addEventListener("click", function () {
  cancelAnimationFrame(newGame.animationToken);
  types_declarations_1.scoreEl.textContent = "0";
  newGame = new Game(types_declarations_1.cvsContext, types_declarations_1.subCanvasCtx, new tetrisBoard_1.Board(tetrisBoard_1.TILE_SIZE), tetrisBoard_1.TILE_SIZE);
  (0, utils_1.createAnimation)(newGame);
});
},{"./types&declarations":"src/types&declarations.ts","./tetrisBoard":"src/tetrisBoard.ts","./currentPiece":"src/currentPiece.ts","./inputHandler":"src/inputHandler.ts","./utils":"src/utils.ts","./piecesController":"src/piecesController.ts"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "39223" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.ts"], null)
//# sourceMappingURL=/src.f10117fe.js.map