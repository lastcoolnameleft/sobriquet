var debug = require('debug')('game:socket');
var roomData = {};
var socketData = {};
var fullCardList = require('./assets/cards');
var Game = require('./game.js');

const startRound = function(roomName) {
    var gameData = roomData[roomName]
    gameData.cardListInPlay = [...gameData.cardListSelected]
    gameData.roundState = 'started'
    startTurn(roomName)
}

const startTurn = function(roomName) {
    var gameData = roomData[roomName]
    gameData.turnState = 'started'
    drawCard(roomName)
}

const endTurn = function(roomName) {
    var gameData = roomData[roomName]
    gameData.turnState = 'complete'
    nextPlayer(roomName)
    swapActiveTeam(roomName)
    moveActiveCardToBottom(roomName)
}

const cardSuccess = function(roomName) {
    var gameData = roomData[roomName]
    // Add the current card to the scored card data
    gameData.scoredCardIndex[gameData.activeTeamIndex][gameData.activeRoundIndex].push(gameData.activeCardIndex)
    const numberOfCardsLeftInPlay = gameData.cardListInPlay.length
    if (numberOfCardsLeftInPlay > 0) {
        drawCard(roomName)
    } else {
        endRound(roomName)
    }
}

const cardPass = function(roomName){
    var gameData = roomData[roomName]
    gameData.cardListInPlay.unshift(gameData.activeCardIndex)
    drawCard()
    console.log('cardPass: ' + gameData.cardListInPlay)    
}


const drawCard = function(roomName) {
    var gameData = roomData[roomName]
    gameData.activeCardIndex = gameData.cardListInPlay.pop()
}

const scoreActiveCard = function(roomName) {
    var gameData = roomData[roomName]
    gameData.scoredCardIndex[gameData.activeTeamIndex][gameData.activeRoundIndex].push(gameData.activeCardIndex)
}

const nextPlayer = function(roomName) {
    var gameData = roomData[roomName]
    gameData.activePlayerIndex[gameData.activeTeamIndex]++
    if (gameData.activePlayerIndex[gameData.activeTeamIndex] >= gameData.teamMembers[gameData.activeTeamIndex].length ) {
        gameData.activePlayerIndex[gameData.activeTeamIndex] = 0
    }
}

const swapActiveTeam = function(roomName) {
    console.log('swapActiveTeam()')
    var gameData = roomData[roomName]
    const inactiveTeamIndex = state.activeTeamIndex == 0 ? 1 : 0
    if (gameData.teamMembers[inactiveTeamIndex].length == 0) {
      console.log('Only playing with one person.  Skipping')
      return
    }
    if (gameData.activeTeamIndex == 1) {
      gameData.activeTeamIndex = 0
    } else {
      gameData.activeTeamIndex = 1
    }
}

const moveActiveCardToBottom = function(roomName) {
    var gameData = roomData[roomName]
    gameData.cardListInPlay.unshift(gameData.activeCardIndex)
}

const endRound = function(roomName) {
    var gameData = roomData[roomName]
    gameData.roundState = 'complete'
    gameData.turnState = 'complete'
    gameData.activeRoundIndex += 1
}

var removeTeamMember = function(teamMembers, nickname) {
    console.log('removeTeamMeber::' + nickname)
    var i
    if (teamMembers[0].indexOf(nickname) > -1) {
        teamMembers[0].splice(teamMembers[0].indexOf(nickname), 1)
    } else if (teamMembers[1].find( i => i == nickname)) {
        teamMembers[1].splice(teamMembers[1].indexOf(nickname), 1)
    } else {
        console.log('Unable to find ' + nickname)
    }
    return teamMembers
}

const generateRandomString = function(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const isDuplicateNickname = function(teamMembers, nickname) {
    if (teamMembers[0].find( i => i == nickname) ||
        teamMembers[1].find( i => i == nickname)) {
            return true
    }
    return false
}

///

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
    const teamMembers = roomData[roomName].teamMembers
    removeTeamMember(teamMembers, nickname) 
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
            if (isDuplicateNickname(roomData[roomName].teamMembers, nickname)) {
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
            io.to(game.roomName).emit('gameData', game.getData())
        })

        socket.on('startRound', function() {
            console.log(`startRound()::socket.id=${socket.id}`);
            game = getGameFromSocketId(socket.id)
            game.startRound()
            io.to(game.roomName).emit('gameData', game.getData());
        })

        socket.on('startTurn', function(gameData) {
            console.log(`startTurn()::socket.id=${socket.id}`);
            game = getGameFromSocketId(socket.id)
            game.startTurn()
            io.to(game.roomName).emit('gameData', game.getData());
        })

        socket.on('endTurn', function(gameData) {
            console.log(`endTurn()::socket.id=${socket.id}`);
            game = getGameFromSocketId(socket.id)
            game.endTurn()
            io.to(game.roomName).emit('gameData', game.getData());
        })

        socket.on('cardSuccess', function(gameData) {
            console.log(`cardSuccess()::socket.id=${socket.id}`);
            game = getGameFromSocketId(socket.id)
            game.cardSuccess()
            io.to(game.roomName).emit('gameData', game.getData());
        })

        socket.on('cardPass', function(gameData) {
            console.log(`cardPass()::socket.id=${socket.id}`);
            game = getGameFromSocketId(socket.id)
            game.cardPass()
            io.to(game.roomName).emit('gameData', game.getData());
        })

        socket.on('disconnect', (reason) => {
            console.log('disconnect::' + socket.id + '::' + reason);
            console.log(roomData);
            console.log(socketData);
            playerDisconnect(socket.id)
            const roomName = socketData[socket.id]
            io.to(roomName).emit('gameData', roomData[roomName]);
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