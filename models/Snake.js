// noinspection SpellCheckingInspection

import {SNAKE_STARTING_LENGTH} from "../utils/constants.js";
import Coordinates from "./Coordinates.js";

/**
 * @constant defaultSnakeCoordinates posição padrão para o mapa modificar depois
 * @type {Coordinates}
 */

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
   * @param {Coordinates} targetCell
   * @param direction
   */
  constructor(targetCell, direction) {
    this.direction = direction
    let directionToGrow = this.direction.move;

    const coordinate = new Coordinates(targetCell.x, targetCell.y);
    this.vertebraes = [];
    this.vertebraes.push(coordinate);
    for (let i = 1; i < SNAKE_STARTING_LENGTH; i++) {
      const coord = coordinate.add(directionToGrow.times(i));
      this.vertebraes.push(coord);
    }
  }
  get head () {
    return this.vertebraes[this.vertebraes.length - 1];
  }
  get size() {
    return this.vertebraes.length;
  }
  /**
   * @function newHead Adds new head to the snake and add more points to score
   * @param {Coordinates} param0
   * @param {number} speed
   */
  newHead({ x, y }, speed) {
    const newHeadCell = new Coordinates(x, y);

    this.vertebraes.push(newHeadCell);
    this.score += speed;
  }

  /**
   * @function move
   * @param {Coordinates} foodCoord
   */
  move(foodCoord) {
    this.vertebraes.shift();
    this.vertebraes.push(foodCoord);
  }

  /**
   * @function checkCollision
   * @param {Coordinates} target
   * @returns {boolean}
   */
  checkCollision (target) {
    return this.vertebraes.slice(0, this.size -1)
      .some(vertebrae => vertebrae.x === target.x && vertebrae.y === target.y);
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
