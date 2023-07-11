/**
 * Creates a new Coordinates
 * @class
 */
export default class Coordinates {

    /**
     * @constructor
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    add (another) {
      return new Coordinates(
        this.x + another.x,
        this.y + another.y);
    }

    times (multiplier) {
      return new Coordinates(
        this.x * multiplier,
        this.y * multiplier);
    }
};
