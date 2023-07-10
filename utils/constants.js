import Coordenates from "../models/Coordenates.js";
import Movement from "../models/Movement.js";

const ON_KEYPRESS_TIMEOUT = 0
const GAME_INTERVAL_MS = 70
const GAME_SPEED_FACTOR = 9
const SNAKE_STARTING_LENGTH = 3

/**z
 * @constant
 * @type {gamePossibleStates}
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

let newMovement = new Movement('left', 37, new Coordenates(-1, 0));
movements.push(newMovement);
newMovement = new Movement('top', 38, new Coordenates(0, -1));
movements.push(newMovement);
newMovement = new Movement('right', 39, new Coordenates(1, 0));
movements.push(newMovement);
newMovement = new Movement('down', 40, new Coordenates(0, 1));
movements.push(newMovement);

export { 
  movements,
  gamePossibleStates,
  ON_KEYPRESS_TIMEOUT,
  GAME_INTERVAL_MS,
  GAME_SPEED_FACTOR,
  SNAKE_STARTING_LENGTH
};
