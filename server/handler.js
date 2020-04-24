var debug = require('debug')('game:socket');
var roomData = {};
var socketData = {};
var fullCardList = require('./assets/cards');
var Game = require('./game.js');

const isRoomValid = function(roomName) {
    if (roomData[roomName]) {
        return true
    }
    return false
}

const playerDisconnect = function(socketId) {
    if (!socketData[socketId]) {
        console.log('Unable to find socketData.  Zombie connection.')
        return
    }
    const nickname = socketData[socketId].nickname
    const roomName = socketData[socketId].roomName
    roomData[roomName].removeTeamMember(nickname) 
}

const getGameFromSocketId = function(socketId) {
    return roomData[socketData[socketId].roomName]
}

var handler = function(io) {
    io.on('connection', (socket) => {
        console.log('connection::' + socket.id)

        socket.on('createGame', function(team1Name, team2Name, numCards, nickname) {
            console.log(`createGame(${team1Name}, ${team2Name}, ${numCards}, ${nickname})::socket.id=${socket.id})`)
            const game = new Game(team1Name, team2Name, numCards, nickname)
            const roomName = game.roomName
            console.log(game);
            roomData[roomName] = game;
            socketData[socket.id] = { roomName, nickname };
            socket.join(roomName);
            console.log(game)
            io.to(roomName).emit('gameData', game.getData());
        })

        socket.on('joinGame', function(roomName, nickname) {
            console.log(`joinGame(${roomName}, ${nickname})::socket.id=${socket.id}`);
            game = roomData[roomName]
            console.log(game);
            if (!isRoomValid(roomName)) {
                console.log('INVALID ROOM NAME:' + roomName)
                io.to(roomName).emit('invalid-room');
                
            }
            if (game.isDuplicateNickname(nickname)) {
                console.log('DUPLICATE NICKNAME:' + nickname)
                io.to(roomName).emit('duplciate-nickname');
                return
            }
            game.joinGame(nickname)
            socketData[socket.id] = { roomName, nickname }
            socket.join(roomName)
            console.log(game)
            io.to(roomName).emit('gameData', game.getData());
        })

        socket.on('startGame', function() {
            console.log(`startGame()::socket.id=${socket.id}`);
            game = getGameFromSocketId(socket.id)
            game.startGame()
            console.log(game)
            io.to(game.roomName).emit('gameData', game.getData())
        })

        socket.on('startRound', function() {
            console.log(`startRound()::socket.id=${socket.id}`);
            game = getGameFromSocketId(socket.id)
            game.startRound()
            console.log(game)
            io.to(game.roomName).emit('gameData', game.getData());
        })

        socket.on('startTurn', function(gameData) {
            console.log(`startTurn()::socket.id=${socket.id}`);
            game = getGameFromSocketId(socket.id)
            game.startTurn()
            console.log(game)
            io.to(game.roomName).emit('gameData', game.getData());
        })

        socket.on('endTurn', function(gameData) {
            console.log(`endTurn()::socket.id=${socket.id}`);
            game = getGameFromSocketId(socket.id)
            game.endTurn()
            console.log(game)
            io.to(game.roomName).emit('gameData', game.getData());
        })

        socket.on('cardSuccess', function(gameData) {
            console.log(`cardSuccess()::socket.id=${socket.id}`);
            game = getGameFromSocketId(socket.id)
            game.cardSuccess()
            console.log(game)
            io.to(game.roomName).emit('gameData', game.getData());
        })

        socket.on('cardPass', function(gameData) {
            console.log(`cardPass()::socket.id=${socket.id}`);
            game = getGameFromSocketId(socket.id)
            game.cardPass()
            console.log(game)
            io.to(game.roomName).emit('gameData', game.getData());
        })

        socket.on('disconnect', (reason) => {
            console.log('disconnect::' + socket.id + '::' + reason);

            if (!socketData[socket.id]) {
                console.log('Unable to find socketData.  Zombie connection.')
                return
            }
            
            game = getGameFromSocketId(socket.id)
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
    })
}

module.exports = handler;