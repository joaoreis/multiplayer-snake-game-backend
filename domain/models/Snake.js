import { movements } from "../utils/constants.js";
import Coordinates from "./Coordinates.js";
import Movement from "./Movement.js";

/**
 * @constant defaultSnakeCoordinates posição padrão para o mapa modificar depois
 * @type {Coordinates}
 */
const defaultSnakeCoordinates = new Coordinates(0, 0);

/**
 * Creates a new Snake
 * @class
 */
export default class Snake {
  /**
   * @property vertebraes
   * @type {Array<Coordinates>}
   */
  vertebraes;

  /**
   * @property direction
   * @type {Movement}
   */
  direction;

  /**
   * @type {number}
   */
  score = 0;

  /**
   * @constructor
   * @param {Coordinates} mapMiddleCell
   */
  constructor(mapMiddleCell = defaultSnakeCoordinates) {
    this.vertebraes = [];
    this.vertebraes.unshift(new Coordinates(mapMiddleCell.x, mapMiddleCell.y));
    const randomDirectionIndex = Math.floor(Math.random() * 4);
    this.direction = movements[randomDirectionIndex];
  }
  get tail() {
    return this.vertebraes[0];
  }
  get size() {
    return this.vertebraes.length;
  }
  /**
   * @function amountCellsInSnake
   * @param {Coordinates|null} targetCell
   * @returns {number}
   */
  amountCellsInSnake(targetCell = null) {
    let cell = targetCell ?? this.tail;
    return this.vertebraes.filter(({ x, y }) => x === cell.x && y === cell.y)
      .length;
  }

  /**
   * @function newHead Adds new head to the snake and add more points to score
   * @param {Coordinates} param0
   * @param {number} speed
   */
  newHead({ x, y }, speed) {
    const newHeadCell = new Coordinates(x, y);

    this.vertebraes.unshift(newHeadCell);
    this.score += speed;
  }

  /**
   * @function lostTail
   * @param {Coordinates} foodCoord
   */
  lostTail(foodCoord) {
    this.vertebraes.unshift(foodCoord);
    this.vertebraes.pop();
  }

  /**
   * @method getSnakeState
   * @returns {any}
   */
  getSnakeState() {
    return {
      vertebraes: this.vertebraes,
      direction: this.direction,
      score: this.score
    }
  }
};