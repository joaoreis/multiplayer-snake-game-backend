// @ts-nocheck

import express from "express";
import {db} from "./dataBase/index.js";
import http from "http";
import {Server} from "socket.io";
import {GAME_INTERVAL_MS, movements, ON_KEYPRESS_TIMEOUT} from "./utils/constants.js"
import Queue from "./utils/Queue.js";

const app = express();
const PORT = process.env.PORT || 5000

app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }

});
const clientRooms = {};

/**
 * @type {Map<string, Array<string>>}
 */
const roomsList = new Map();
let ping = 0;

const socketToUserMap = new Map();

io.on('connection', (socket) => {

    const movementQueue = new Queue();

    socket.on('newLobby', newLobby);

    socket.on('joinLobby', joinLobby);

    socket.on('move', move);

    socket.on('startSoloGame', startSoloGame);

    socket.on('disconnect', handleDisconnect);

    function newLobby(arg) {
        const {userId} = arg;
        socketToUserMap.set(socket.id, userId);
        let lobbyId = 0
        let roomName = `sala${lobbyId}`
        while (roomsList.get(roomName)) {
            roomName = `sala${++lobbyId}`
        }

        try {
            db.createNewLobby(userId, roomName);
        } catch (error) {
            socket.emit('invalidUser');
            return;
        }

        clientRooms[userId] = roomName;
        roomsList.set(roomName, [userId]);

        socket.join(roomName);
        socket.number = 1;

        socket.emit('joinedLobby', {lobbyId: roomName});
    }

    function joinLobby(arg) {
        const {lobbyId, userId} = arg;
        socketToUserMap.set(socket.id, userId);
        if (!lobbyId) {
            socket.emit('invalidLobbyId');

            return;
        }

        try {
            const gameIsRunning = db.getLobbyById(lobbyId).isRunning;

            if (gameIsRunning) {
                socket.emit('gameAlreadyStarted');

                return;
            }
        } catch (error) {
            socket.emit('invalidLobbyId');

            return;
        }

        const room = io.sockets.adapter.rooms.get(lobbyId);

        if (!room) return;

        let countUsers = null;
        if (room) {
            countUsers = room.size;
        }

        if (countUsers === 0) {
            socket.emit('Error');
            return;
        } else if (countUsers > 1) {
            socket.emit('tooManyPlayers');
            return;
        }

        try {
            db.addUserToLobby(userId, lobbyId);
            roomsList.get(lobbyId).push(userId);
        } catch (error) {
            socket.emit('invalidUser');

            return;
        }

        clientRooms[userId] = lobbyId;

        socket.join(lobbyId);
        socket.number = 2;

        startGameInterval(lobbyId);

        socket.emit('joinedLobby', {lobbyId});
    }

    function move(arg) {
        const {userId, userMovement} = arg;
        const room = clientRooms[userId];

        if (!room) return;

        let lobby = null;

        try {
            lobby = db.getLobbyById(room);
        } catch (error) {
            socket.emit('invalidLobbyId')
            return;
        }
        const movementQueue = lobby.usersMovementQueue.get(userId).queue;
        const lastMovement = movementQueue.peek()
        if (!userMovement === lastMovement || movementQueue.isEmpty) {
            movementQueue.enqueue(userMovement)
        }
    }


    function startSoloGame(arg) {
        const {userId} = arg;
        const lobbyId = clientRooms[userId];
        if (!lobbyId) return;
        startGameInterval(lobbyId)
    }


    const startGameInterval = (lobbyId) => {
        const currentLobby = db.getLobbyById(lobbyId);
        currentLobby.startLobby();

        const intervalId = setInterval(() => {
            if (currentLobby.isFinished) {
                const mapState = currentLobby.getMapState();
                emitGameOver(lobbyId, mapState);
                const users = currentLobby.users;
                users.forEach(user => delete clientRooms[user.id]);
                db.removeLobbyById(lobbyId);
                clearInterval(intervalId);
            }

            if (currentLobby.isRunning) {
                currentLobby.gameNewLoop();
                const mapState = currentLobby.getMapState();
                emitGameState(lobbyId, mapState);
            }
        }, GAME_INTERVAL_MS);
    };

    const emitGameState = (lobbyId, mapState) => {
        io.sockets.in(lobbyId)
            .emit('mapState', mapState);
    }

    const emitGameOver = (lobbyId, mapState) => {
        io.sockets.in(lobbyId)
            .emit('gameFinished', mapState);
        io.sockets.socketsLeave(lobbyId);
        io.sockets.in(lobbyId).disconnectSockets(false);
        roomsList.delete(lobbyId);
    }

    function handleDisconnect() {
        const disconnectedId = socketToUserMap.get(socket.id);
        const lobbyId = clientRooms[disconnectedId];
        let currentLobby;
        try {
            currentLobby = db.getLobbyById(lobbyId);
        } catch (error) {
            // Lobby not found -> User refreshed the page without creating / joining a room, nothing to do
            return;
        }

        if (currentLobby.isRunning) {
            // User refreshed the page while in game -> forcing the game to end, deleting the user and the lobby
            currentLobby.forceEnd()
        } else {
            if (!currentLobby.isFinished) {
                // User refreshed the page while in the lobby -> we need to clear the lobby and the user
                io.sockets.socketsLeave(lobbyId);
                io.sockets.in(lobbyId).disconnectSockets(false);
                roomsList.delete(lobbyId);

                const users = currentLobby.users;
                users.forEach(user => delete clientRooms[user.id]);
                db.removeLobbyById(lobbyId);
            }
        }
    }
})

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
