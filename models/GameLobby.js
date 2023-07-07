import BoardMap from "./BoardMap.js";
import Coordenates from "./Coordenates.js";
import User from "./User.js";
import Snake from "./Snake.js";
import {GAME_INTERVAL_MS, ON_KEYPRESS_TIMEOUT} from "../utils/constants.js";
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

    // {userId: (QUeue, lastMovimentTs)}
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
     * @method removeUser Removes user from user's Array by userId
     * @param {string} userId
     */
    removeUser(userId) {
        for (let i = 0; i < this.users.length; i++)
            if (this.users[i].id === userId)
                this.users.splice(i, 1);
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

    /**
     * @method getMapState
     * @returns {{snakes: Array<Snake>, targetCells: Array<Coordenates>}}
     */
    getMapState() {
        const {snakes, targetCells, scores} = this.gameBoard.getState();

        return {
            snakes: {...Object.fromEntries(snakes)},
            targetCells,
            scores: {...Object.fromEntries(scores)}
        }
    }

    gameNewLoop() {
        this.users.forEach(
            user => this.gameBoard.move(user.id)
        );
    }

    /**
     * @getter isRunning
     * @returns {boolean}
     */
    get isRunning() {
        return this.gameBoard.gameState === 1;
    }

    /**
     * @getter isFinished
     * @returns {boolean}
     */
    get isFinished() {
        return this.gameBoard.gameState === 2;
    }
}
