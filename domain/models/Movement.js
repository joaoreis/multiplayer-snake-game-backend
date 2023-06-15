import Coordinates from "./Coordinates.js";

/**
 * @class Create a possible snake movement
 */
export default class Movement {
  /**
   * @property direção do movimento
   * @type {string}
   */
  direction;

  /**
   * @property o código numérico do botão apertado
   * @type {number}
   */
  keyCode;

  /**
   * @property as cordenadas do movimento
   * @type {Coordinates}
   */
  move;
  
  /**
   * @param {string} direction
   * @param {number} keyCode
   * @param {Coordinates} move
   */
  constructor(direction, keyCode, move) {
    this.direction = direction;
    this.keyCode = keyCode;
    this.move = move;
  }
}
