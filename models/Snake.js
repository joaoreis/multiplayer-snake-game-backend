import {movements, SNAKE_STARTING_LENGTH} from "../utils/constants.js";
import Coordenates from "./Coordenates.js";
import Movement from "./Movement.js";

/**
 * @constant defaultSnakeCoordenates posição padrão para o mapa modificar depois
 * @type {Coordenates}
 */

/**
 * Creates a new Snake
 * @class
 */
export default class Snake {
  /**
   * @property vertebraes
   * @type {Array<Coordenates>}
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
   * @param {Coordenates} targetCell
   */
  constructor(targetCell, direction) {
    this.direction = direction
    let directionToGrow = this.direction.move;

    const coordenate = new Coordenates(targetCell.x, targetCell.y);
    this.vertebraes = [];
    this.vertebraes.push(coordenate);
    for (let i = 1; i < SNAKE_STARTING_LENGTH; i++) {
      const coord = coordenate.add(directionToGrow.times(i));
      this.vertebraes.push(coord);
    }
  }
  get tail () {
    return this.vertebraes[this.vertebraes.length - 1];
  }
  get head() {
    return this.vertebraes[0];
  }
  get size() {
    return this.vertebraes.length;
  }
  /**
   * @function newHead Adds new head to the snake and add more points to score
   * @param {Coordenates} param0
   * @param {number} speed
   */
  newHead({ x, y }, speed) {
    const newHeadCell = new Coordenates(x, y);

    this.vertebraes.push(newHeadCell);
    this.score += speed;
  }

  /**
   * @function move
   * @param {Coordenates} foodCoord
   */
  move(foodCoord) {
    this.vertebraes.shift();
    this.vertebraes.push(foodCoord);
  }

  /**
   * @function checkCollision
   * @param {Coordenates} target
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
