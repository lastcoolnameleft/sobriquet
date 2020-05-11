declare function require(path: string): any;

var debug = require('debug')('game:socket');
var roomData = {};
var socketData = {};
var fullCardList = require('../assets/cards');
var Game = require('./game');

const isRoomValid = function(roomName) {
    if (roomData[roomName]) {
        return true
    }
    return false
}

const getGameFromSocketId = function(socketId) {
    return roomData[socketData[socketId].roomName]
}

const getNicknameFromSocketId = function(socketId) {
    return socketData[socketId] ? socketData[socketId].nickname : ''
}

const addSocketToGame = function(socket, roomName, nickname) {
    console.log(`addSocketToGame(${socket.id}, ${roomName}, ${nickname})`)
    socketData[socket.id] = { roomName, nickname };
    socket.join(roomName);
}

const createFakeGame = function() {
    console.log('creating fake game')
    roomData['FAKE'] = new Game('Team 1', 'team 2', 5, 'blarg', 'FAKE')
}
//createFakeGame()

export function handler(io) {
    io.on('connection', (socket) => {
        console.log('connection::' + socket.id)


        socket.on('createGame', function(team1Name, team2Name, numCards, nickname) {
            console.log(`createGame(${team1Name}, ${team2Name}, ${numCards}, ${nickname})::socket.id=${socket.id})`)
            const game = new Game(team1Name, team2Name, numCards, nickname)
            const roomName = game.roomName
            
            roomData[roomName] = game;
            addSocketToGame(socket, roomName, nickname)
            console.log(game)
            io.to(roomName).emit('gameData', game.getData());
        })

        socket.on('joinGame', function(roomName, nickname) {
            console.log(`joinGame(${roomName}, ${nickname})::socket.id=${socket.id}`);
            const game = roomData[roomName]
            console.log(game);
            if (!isRoomValid(roomName)) {
                console.log(`Invalid room name (${roomName}).  Unable to join`)
                io.emit('clientError', `Unable to find room ${roomName}`);
                return
            }
            if (game.isDuplicateNickname(nickname)) {
                console.log('DUPLICATE NICKNAME:' + nickname)
                io.emit('clientError', `Duplicate nickname ${nickname}`);
                return
            }
            game.joinGame(nickname)
            addSocketToGame(socket, roomName, nickname)
            console.log(game)
            io.to(roomName).emit('gameData', game.getData());
        })

        socket.on('startGame', function() {
            console.log(`startGame()::socket.id=${socket.id}::nickname=${socketData[socket.id].nickname}`);
            const game = getGameFromSocketId(socket.id)
            game.startGame()
            console.log(game)
            io.to(game.roomName).emit('gameData', game.getData())
        })

        socket.on('startRound', function() {
            console.log(`startRound()::socket.id=${socket.id}::nickname=${socketData[socket.id].nickname}`);
            const game = getGameFromSocketId(socket.id)
            game.startRound()
            console.log(game)
            io.to(game.roomName).emit('gameData', game.getData());
        })

        socket.on('startTurn', function(gameData) {
            console.log(`startTurn()::socket.id=${socket.id}::nickname=${socketData[socket.id].nickname}`);
            const game = getGameFromSocketId(socket.id)
            game.startTurn()
            console.log(game)
            io.to(game.roomName).emit('gameData', game.getData());
        })

        socket.on('endTurn', function(gameData) {
            console.log(`endTurn()::socket.id=${socket.id}::nickname=${socketData[socket.id].nickname}`);
            const game = getGameFromSocketId(socket.id)
            game.endTurn()
            console.log(game)
            io.to(game.roomName).emit('gameData', game.getData());
        })

        socket.on('cardSuccess', function(gameData) {
            console.log(`cardSuccess()::socket.id=${socket.id}`);
            const game = getGameFromSocketId(socket.id)
            game.cardSuccess()
            console.log(game)
            io.to(game.roomName).emit('gameData', game.getData());
        })

        socket.on('cardPass', function(gameData) {
            console.log(`cardPass()::socket.id=${socket.id}::nickname=${socketData[socket.id].nickname}`);
            const game = getGameFromSocketId(socket.id)
            game.cardPass()
            console.log(game)
            io.to(game.roomName).emit('gameData', game.getData());
        })

        socket.on('disconnect', (reason) => {
            console.log(`disconnect(${reason})::socket.id=${socket.id}::nickname=${getNicknameFromSocketId(socket.id)}`);

            if (!socketData[socket.id]) {
                console.log('Unable to find socketData.  Zombie connection.')
                return
            }
            
            const game = getGameFromSocketId(socket.id)
            const nickname = socketData[socket.id].nickname
            game.removeTeamMember(nickname) 
            delete socketData[socket.id]
            console.log(game);
            console.log(socketData);
            io.to(game.roomName).emit('gameData', game.getData())
        });

        socket.on('error', (reason) => {
            console.log('error::' + socket.id + '::' + reason);
        });

        socket.on('disconnecting', (reason) => {
            console.log('disconnecting::' + socket.id + '::' + reason);
        });
        socket.on('reconnect', (roomName, nickname) => {
            console.log('reconnect::' + socket.id + '::' + roomName + '::' + nickname);
        });
        socket.on('rejoinGame', (roomName, nickname) => {
            console.log('rejoinGame::' + socket.id + '::' + roomName + '::' + nickname);
            const game = roomData[roomName]

            if (!isRoomValid(roomName)) {
                console.log(`Invalid room name (${roomName}).  Zombie game`)
                io.emit('clientError', `Unable to find room ${roomName}`);
                return
            }

            game.joinGame(nickname)
            addSocketToGame(socket, roomName, nickname)
            console.log(game)
            io.to(roomName).emit('gameData', game.getData());
        });
        socket.on('reconnecting', (reason) => {
            console.log('reconnecting::' + socket.id + '::' + reason);
        });
    })
}