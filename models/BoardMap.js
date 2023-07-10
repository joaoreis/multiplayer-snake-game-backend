import SnakeNotFoundError from "../errors/SnakeNotFoundError.js";
import { movements, gamePossibleStates } from "../utils/constants.js";
import Coordenates from "./Coordenates.js";
import Snake from "./Snake.js";
import { ON_KEYPRESS_TIMEOUT } from "../utils/constants.js"
import { GAME_SPEED_FACTOR } from "../utils/constants.js"
import Movement from "./Movement.js";
import Queue from "../utils/Queue.js";

/**
 * Creates a new BoardMap
 * @class
 */
export default class BoardMap {
  /**
   * @property boardSize
   * @type {Coordenates}
   */
  boardSize;

  /**
   * @property targetCells
   * @type {Array<Coordenates>}
   */
  targetCells = [];

  /**
   * @property users
   * @type {Map<string,Snake>}
   */
  snakes = new Map();

  /**
   * @property gameState
   * @type {gamePossibleStates}
   */
  gameState;

  /**
   * @property speed
   * @type {number}
   */
  speed;

  /**
   * @type {Map<string, number>}
   */
  scores = new Map();

  /**
   * @type {Map<string, boolean>}
   */
  movementLock = new Map();

  loopIteration = 1;

  /**
   * @type {string}
   */
  gameLoser = '';

  /**
   * @constructor
   * @param {number} boardSize
   * @param {number} speed
   */
  constructor(boardSize = 0, speed) {
    this.boardSize = new Coordenates(boardSize, boardSize);
    this.gameState = gamePossibleStates.NOT_STARTED;
    this.speed = speed;
  }


  /**
   * @function
   * Create a new Snake and push to the Snake's Map
   * @param {string} userId
   */
  newSnake(userId) {
    let startingPoint;
    let direction;
    if (this.snakes.size === 0) {
      // player 1 starts on top left corner moving down
      startingPoint = new Coordenates(5, 5);
      direction = movements[3]
    } else {
      // player 2 starts on bottom right corner moving up
      startingPoint = new Coordenates(35, 35)
      direction = movements[1]
    }

    this.snakes.set(userId, new Snake(startingPoint, direction));
    this.scores.set(userId, 0);
    this.movementLock.set(userId, false);
  }

  /**
   * @function
   * Generates a new Target in the BoardMap and push to the Target's Array
   */
  generateRandomTargetCell() {
    if (this.targetCells.length === this.snakes.size)
      return;

    let targetCell = this.getRandomCell();
    while (!this.isTargetCellValid(targetCell)) {
      targetCell = this.getRandomCell();
    }
    this.targetCells.push(targetCell);
  }

  /**
   * @function
   * @returns {Coordenates} Returns a random Coordenates inside the BoardMap
   */
  getRandomCell() {
    return new Coordenates(
      Math.floor(Math.random() * this.boardSize.x),
      Math.floor(Math.random() * this.boardSize.y)
    );
  }

  /**
   * @function
   * @param {Coordenates} param0
   * @param {Snake} snake
   * @returns {Coordenates | undefined} Returns if this snake's movement is towards a Target
   */
  isTargetNewHead({ x, y }) {
    let cell = this.targetCells.find(
      cell =>
        x === cell.x &&
        y === cell.y
    );

    return this.targetCells.indexOf(cell);
  }

  /**
   * @function
   * @param {Coordenates} param0
   * @returns {boolean} Returns if this snake's movement is inside or not of the BoardMap
   */
  isCellOutOfBoard({ x, y }) {
    return x < 0 || y < 0 || x >= this.boardSize.x || y >= this.boardSize.y;
  }

  /**
   * @function
   * Start the game
   * Create new Snakes
   * Start the movement
   * @param {Array<string>} playersIds
   */
  startGame(playersIds) {
    this.gameState = gamePossibleStates.RUNNING;
    this.targetCells = [];

    if(!this.snakes.size) {
      playersIds.map(userId => {
        this.newSnake(userId);
      });
    }
  }

  /**
   * @function Snake's movement function
   * @param {Snake} snake
   */
  async move(userId) {
    if (this.gameState !== gamePossibleStates.RUNNING) {
      return;
    }

    const snake = this.snakes.get(userId)

    this.generateRandomTargetCell();

    const newHeadCell = new Coordenates(
      snake.tail.x + snake.direction.move.x,
      snake.tail.y + snake.direction.move.y
    );

    if (
      this.isCellOutOfBoard(newHeadCell) ||
      this.isTargetInvalid(userId)
    ) {
      this.gameLoser = userId;
      this.stop();
      return;
    }

      // if ((this.loopIteration) % GAME_SPEED_FACTOR === 0) {
      //     this.loopIteration = 0;
      // } else {
      //     this.loopIteration++;
      //     return;
      // }

    const index = this.isTargetNewHead(newHeadCell);
    if (index >= 0) {
      snake.newHead(newHeadCell, this.speed);
      this.targetCells.splice(index, 1);
      const score = this.scores.get(userId) + 10;
      this.scores.set(userId, score);
    } else {
      snake.move(newHeadCell);
    }

  }

  /**
   * @function
   * @param {string} userId
   * @param {string} movement
   */
  onKeyPress(userId, movement) {
    if (this.movementLock.get(userId)) return;
    if (this.gameState !== gamePossibleStates.RUNNING) return;
    if (!this.snakes.get(userId)) {
      throw new SnakeNotFoundError(`Snake with userId ${userId} not found.`);
    }
    this.movementLock.set(userId, true);

    let newDirection = movements.find(_movement => _movement.direction === movement);
    if(!newDirection) return; // won't happen by design
    this.processMovement(userId, newDirection)


  }

  processMovement(userId, newDirection)  {
    const movement = newDirection
    // @ts-ignore
    if (Math.abs(movement.keyCode - this.snakes.get(userId).direction.keyCode) !== 2) {
      // console.log(Math.abs(newDirection.keyCode - this.snakes.get(userId).direction.keyCode));
      // @ts-ignore
      this.snakes.get(userId).direction = movement;
    } else {
      this.movementLock.set(userId, false)
    }
    setTimeout(() => {
      this.movementLock.set(userId, false);
    }, ON_KEYPRESS_TIMEOUT);
  }

  /**
   * @function
   * Stop's Game function
   * Clear and reset BoardMap info
   */
  stop() {
    this.gameState = gamePossibleStates.FINISHED;
    this.snakes = new Map();
    this.targetCells = [];
  }

  getState() {
    const snakesKeys = Array.from( this.snakes.keys() );
    const scoresKeys = Array.from( this.scores.keys() );
    const snakes = new Map();
    const scores = new Map();

    for (const element of snakesKeys) {
      const snake = this.snakes.get(element);

      if(!snake) {
        throw new Error();
      }

      snakes.set(element, snake.getSnakeState())
    }

    for (const element of scoresKeys) {
      const score = this.scores.get(element);

      if(score === null || score === undefined) {
        throw new Error();
      }

      scores.set(element, score);
    }

    return {
      snakes,
      targetCells: this.targetCells,
      scores,
      gameLoser: this.gameLoser
    }
  }

  isTargetInvalid(userId) {
    const player = this.snakes.get(userId);
    let isInvalid = false;

    this.snakes.forEach( snake => {
      if (isInvalid) {
        return;
      }
      // Se o jogador colidiu consigo mesmo
      else if(player === snake) {
        isInvalid = snake.checkCollision(snake.tail);
      }
      // Se o jogador colidiu com o outro jogador
      else {
        isInvalid = snake.checkCollision(player.tail);
      }
    });

    return isInvalid;
  }

  isTargetCellValid(targetCell) {
    let validTarget = false;

    for (let [_, snake] of this.snakes) {
      validTarget = !snake.checkCollision(targetCell);
    }

    return validTarget;
  }
};
