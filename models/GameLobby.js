import BoardMap from "./BoardMap.js";
import {GAME_INTERVAL_MS, gamePossibleStates, ON_KEYPRESS_TIMEOUT} from "../utils/constants.js";
import Queue from "../utils/Queue.js";

export default class GameLobby {
    /**
     * @property
     * @type {Array<User>}
     */
    users = [];
    /**
     * @property map
     * @type {BoardMap}
     */
    gameBoard;

    /**
     * @property lobby id
     * @type {string}
     */
    id;

    // {userId: (Queue, lastMovementTs)}
    usersMovementQueue = new Map();

    /**
     * @constructor GameLobby constructor
     * @param {number | undefined} boardSize
     * @param {number} speed
     * @param {string} id
     */
    constructor(boardSize, speed, id) {
        this.gameBoard = new BoardMap(boardSize, speed);
        this.id = id;
    }

    /**
     * @method addUser Adds user to game lobby
     * @param {User} user
     */
    addUser(user) {
        this.users.push(user);
        this.gameBoard.newSnake(user.id);
    }

  /**
   * @method getMapState
   * @returns {{scores: {[p: string]: any}, gameLoser: string, snakes: {[p: string]: any}, targetCells: Array<Coordinates>}}
   */
  getMapState() {
    const { snakes, targetCells, scores, gameLoser } = this.gameBoard.getState();
    
      return {
        snakes: { ...Object.fromEntries(snakes) },
        targetCells,
        scores: { ...Object.fromEntries(scores) },
        gameLoser
    }
  }
    /**
     * @method startLobby Starts game calling gameBoard's method
     */
    startLobby() {
        this.gameBoard.startGame(this.users.map(user => user.id));
        this.users.forEach(user => {
            this.usersMovementQueue.set(user.id, {
                "queue": new Queue(),
                "lastMovement": Date.now(),
            });
            this.runMovement(this.id, user.id);
        });
    }


    runMovement(lobby, userId) {
        setInterval(() => {
            const userMovementData = this.usersMovementQueue.get(userId)
            const diff = Date.now() - userMovementData.lastMovement
            if (diff > GAME_INTERVAL_MS) {
                userMovementData.lastMovement = Date.now()
                const movement = userMovementData.queue.dequeue();

                // @ts-ignore
                if (movement) {
                    this.userMove(userId, movement);
                }
            }
        }, ON_KEYPRESS_TIMEOUT)
    }

    /**
     * @method userMove
     * @param {string} userId
     * @param {string} movement
     */
    userMove(userId, movement) {
        this.gameBoard.onKeyPress(userId, movement);
    }

    gameNewLoop() {
        this.users.forEach(
            user => this.gameBoard.move(user.id)
        );
    }

    forceEnd() {
        this.gameBoard.stop()
    }

    /**
     * @getter isRunning
     * @returns {boolean}
     */
    get isRunning() {
        return this.gameBoard.gameState === gamePossibleStates.RUNNING;
    }

    /**
     * @getter isFinished
     * @returns {boolean}
     */
    get isFinished() {
        return this.gameBoard.gameState === gamePossibleStates.FINISHED;
    }
}
