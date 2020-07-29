import { Component, OnInit, HostListener } from '@angular/core';
import { Tile } from '../models/tile.model';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}

@Component({
  selector: 'tfe-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  gameLoaded = false;
  boardDimensions = 4;
  board: number[][];
  numbers = Array(4).fill(0).map((x, i) => i);
  lastAdded: Tile;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {

    if (event.key === 'ArrowRight') {
      this.moveRight();
    }

    if (event.key === 'ArrowLeft') {
      this.moveLeft();
    }

    if (event.key === 'ArrowUp') {
      this.moveUp();
    }

    if (event.key === 'ArrowDown') {
      this.moveDown();
    }
  }

  constructor() {
    this.newGame();

    this.gameLoaded = true;
  }

  ngOnInit(): void {
  }

  getBoardValue(x: number, y: number) {
    const val = this.board[x][y];
    return val ? val.toString() : '&nbsp;';
  }

  newGame() {
    this.createBoard();
    this.addRandom();
  }

  addRandom() {
    const nulls: Tile[] = [];
    let rand = 0;

    // Get all the null coordinates
    for (let y = 0; y < this.boardDimensions; y++) {
      for (let x = 0; x < this.boardDimensions; x++) {
        if (this.board[x][y] === null) {
          nulls.push({ x, y });
        }
      }
    }

    if (nulls.length > 0) {
      const len = nulls.length;
      rand = Math.floor(Math.random() * (len - 0) + 0);

      const tile = nulls[rand];
      const rand01 = Math.random();
      this.board[tile.x][tile.y] = rand01 >= 0.5 ? 4 : 2;

      this.lastAdded = tile;
    } else {
      // Game Over
      console.log('game over!!!!');
    }
  }

  createBoard() {
    this.board = [];
    for (let x = 0; x < this.boardDimensions; x++) {
      this.board[x] = [];
      for (let y = 0; y < this.boardDimensions; y++) {
        this.board[x][y] = null;
      }
    }
  }

  findNextNonNull(start: Tile, searchDirection: 'left' | 'right' | 'down' | 'up'): Tile {
    if (searchDirection === 'right') {
      if (start.x <= this.boardDimensions - 1) {
        for (let x = start.x; x < this.boardDimensions; x++) {
          if (this.board[x][start.y] != null) {
            return { x, y: start.y };
          }
        }
      }
    } else if (searchDirection === 'left') {
        if (start.x <= this.boardDimensions - 1) {
          for (let x = start.x; x >= 0; x--) {
            if (this.board[x][start.y] != null) {
              return { x, y: start.y };
            }
          }
        }
      } else if (searchDirection === 'down') {
        if (start.y > 0) {
          for (let y = start.y; y < this.boardDimensions; y++) {
            if (this.board[start.x][y] != null) {
              return { x: start.x, y };
            }
          }
        }
      } else if (searchDirection === 'up') {
        if (start.y <= this.boardDimensions - 1) {
          for (let y = start.y; y >= 0; y--) {
            if (this.board[start.x][y] != null) {
              return { x: start.x, y };
            }
          }
        }
      }

    return null;
  }

  swapOrAdd(src: Tile, dest: Tile) {
    if (this.board[dest.x][dest.y] === this.board[src.x][src.y]) {
      this.board[dest.x][dest.y] += this.board[src.x][src.y];
      this.board[src.x][src.y] = null;
      return true;
    } else if (this.board[dest.x][dest.y] === null) {
      this.board[dest.x][dest.y] = this.board[src.x][src.y];
      this.board[src.x][src.y] = null;
      return true;
    }
  }

  moveLeft() {
    let madeMove = false;
    for (let y = 0; y < this.boardDimensions; y++) {
      for (let x = 0; x < this.boardDimensions; x++) {
        let tile = this.findNextNonNull({x: x + 1, y}, 'right');
        while (tile !== null) {
          const lastMadeMove = this.swapOrAdd(tile, {x, y});
          madeMove = madeMove || lastMadeMove;
          tile = lastMadeMove ? this.findNextNonNull({x: x + 1, y}, 'right') : null;
        }
      }
    }

    if (madeMove) {
      this.addRandom();
    }
  }

  moveRight() {
    let madeMove = false;
    for (let y = 0; y < this.boardDimensions; y++) {
      for (let x = this.boardDimensions - 1; x > 0; x--) {
        let tile = this.findNextNonNull({x: x - 1, y}, 'left');
        while (tile !== null) {
          const lastMadeMove = this.swapOrAdd(tile, {x, y});
          madeMove = madeMove || lastMadeMove;
          tile = lastMadeMove ? this.findNextNonNull({x: x - 1, y}, 'left') : null;
        }
      }
    }

    if (madeMove) {
      this.addRandom();
    }
  }

  moveUp() {
    let madeMove = false;
    for (let x = 0; x < this.boardDimensions; x++) {
      for (let y = 0; y < this.boardDimensions; y++) {
        const tile = this.findNextNonNull({x, y: y + 1}, 'down');
        if (tile !== null) {
          if (this.board[x][y] === this.board[x][tile.y]) {
            this.board[x][y] += this.board[x][tile.y];
            this.board[x][tile.y] = null;
            madeMove = true;
          } else if (this.board[x][y] === null) {
            this.board[x][y] = this.board[x][tile.y];
            this.board[x][tile.y] = null;
            madeMove = true;
          }
        }
      }
    }

    if (madeMove) {
      this.addRandom();
    }
  }

  moveDown() {
    let madeMove = false;
    for (let x = 0; x < this.boardDimensions; x++) {
      for (let y = this.boardDimensions; y > 0; y--) {
        const tile = this.findNextNonNull({x, y: y - 1}, 'up');
        if (tile !== null) {
          if (this.board[x][y] === this.board[x][tile.y]) {
            this.board[x][y] += this.board[x][tile.y];
            this.board[x][tile.y] = null;
            madeMove = true;
          } else if (this.board[x][y] === null) {
            this.board[x][y] = this.board[x][tile.y];
            this.board[x][tile.y] = null;
            madeMove = true;
          }
        }
      }
    }

    if (madeMove) {
      this.addRandom();
    }
  }
}
