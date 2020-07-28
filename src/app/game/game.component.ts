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

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {

    if (event.key === 'ArrowRight') {
      this.moveRight();
    }

    if (event.key === 'ArrowLeft') {
      console.log('left!');
      this.moveLeft();
    }

    if (event.key === 'ArrowUp') {
      console.log('up!');
    }

    if (event.key === 'ArrowDown') {
      console.log('down!');
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
      this.board[tile.x][tile.y] = 2;
      // this.board[3][0] = 2;

      console.log(tile);
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

  findNextNonNull(start: Tile, searchDirection: 'left' | 'right'): Tile {
    if (searchDirection === 'right') {
      if (start.x <= this.boardDimensions - 1) {
        for (let x = start.x; x < this.boardDimensions; x++) {
          if (this.board[x][start.y] != null) {
            return { x, y: start.y };
          }
        }
      }
    }

    return null;
  }

  moveLeft() {
    for (let y = 0; y < this.boardDimensions; y++) {
      for (let x = 0; x < this.boardDimensions; x++) {
        // If this is null, and the one to the right is not, slide to the left
          if (x < this.boardDimensions - 1) {
            const tile = this.findNextNonNull({x: x + 1, y}, 'right');
            if (tile !== null) {
              if (this.board[x][y] === this.board[tile.x][y]) {
                this.board[x][y] += this.board[tile.x][y];
                this.board[tile.x][y] = null;
              } else if (this.board[x][y] === null) {
                this.board[x][y] = this.board[tile.x][y];
                this.board[tile.x][y] = null;
              }
            }
          }
        /*} else {
          // It has a value. See if the value to the right is the same. Add if so
          if (x < this.boardDimensions - 1) {
            if (this.board[x][y] === this.board[x + 1][y]) {
              this.board[x][y] += this.board[x + 1][y];
              this.board[x + 1][y] = null;
            }
          }
        }*/
      }
    }

    this.addRandom();
  }

  moveRight() {

  }
}
