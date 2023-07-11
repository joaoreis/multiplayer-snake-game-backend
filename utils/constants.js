import Coordinates from "../models/Coordinates.js";
import Movement from "../models/Movement.js";

const ON_KEYPRESS_TIMEOUT = 0
const GAME_INTERVAL_MS = 70
const SNAKE_STARTING_LENGTH = 3

/**z
 * @constant
 * @type {{RUNNING: number, NOT_STARTED: number, FINISHED: number}}
 */
const gamePossibleStates = {
  NOT_STARTED: 0,
  RUNNING: 1,
  FINISHED: 2,
}

/**
 * @constant
 * @type {Array<Movement>}
 */
const movements = [];

let newMovement = new Movement('left', 37, new Coordinates(-1, 0));
movements.push(newMovement);
newMovement = new Movement('top', 38, new Coordinates(0, -1));
movements.push(newMovement);
newMovement = new Movement('right', 39, new Coordinates(1, 0));
movements.push(newMovement);
newMovement = new Movement('down', 40, new Coordinates(0, 1));
movements.push(newMovement);

export { 
  movements,
  gamePossibleStates,
  ON_KEYPRESS_TIMEOUT,
  GAME_INTERVAL_MS,
  SNAKE_STARTING_LENGTH
};
