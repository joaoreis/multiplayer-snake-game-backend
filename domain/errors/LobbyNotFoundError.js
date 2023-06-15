import CustomError from "./CustomError.js";

/**
 * @class LobbyNotFoundError
 */
export default class LobbyNotFoundError extends CustomError {
  /**
   * @constructor
   * @param {string} message
   */
  constructor(message= "Sala não encontrada") {
    super(message);
    this.type = 'LobbyNotFoundError';
  }
}