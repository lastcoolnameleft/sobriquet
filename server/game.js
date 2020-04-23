var _ = require('lodash');
var debug = require('debug')('game:socket');
var roomData = {};
var socketData = {};

const addTeamMember = function(teamMembers, nickname) {
  var teamIndex = 0
  if (teamMembers[0].length > teamMembers[1].length) {
    teamIndex = 1
  }
  teamMembers[teamIndex].push(nickname)
  return teamIndex
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

const isRoomValid = function(roomName) {
    if (roomData[roomName]) {
        return true
    }
    return false
}

var game = function(io) {
    io.on('connection', (socket) => {

        console.log('connection::' + socket.id)

        socket.on('createGame', function(gameData, nickname) {
            console.log('createGame::' + socket.id);
            console.log(gameData);
            var roomName = generateRandomString(4)
            gameData.roomName = roomName
            roomData[roomName] = gameData;
            socketData[socket.id] = { roomName, nickname };
            socket.join(roomName);
            //console.log(roomData[roomName]);
            io.to(roomName).emit('gameCreated', roomName);
            //io.to(roomName).emit('gameData', roomData[roomName]);
        })

        socket.on('joinGame', function(roomName, nickname) {
            console.log('joinGame::' + socket.id);
            console.log(roomData[roomName]);
            if (!isRoomValid(roomName)) {
                console.log('INVALID ROOM NAME:' + roomName)
                io.to(roomName).emit('invalid-room');
                return
            }
            if (isDuplicateNickname(roomData[roomName].teamMembers, nickname)) {
                console.log('DUPLICATE NICKNAME:' + nickname)
                io.to(roomName).emit('duplciate-nickname');
                return
            }
            addTeamMember(roomData[roomName].teamMembers, nickname)
            socketData[socket.id] = { roomName, nickname };
            socket.join(roomName);
            console.log(roomData[roomName]);
            io.to(roomName).emit('gameData', roomData[roomName]);
        })

        socket.on('startGame', function(gameData) {
            console.log('startGame::' + socket.id);
            console.log(gameData);
            roomData[gameData.roomName] = gameData;
            io.to(gameData.roomName).emit('gameData', gameData);
        })
        socket.on('startRound', function(gameData) {
            console.log('startRound::' + socket.id);
            console.log(gameData);
            roomData[gameData.roomName] = gameData;
            io.to(gameData.roomName).emit('gameData', gameData);
        })
        socket.on('startTurn', function(gameData) {
            console.log('startTurn::' + socket.id);
            console.log(gameData);
            roomData[gameData.roomName] = gameData;
            io.to(gameData.roomName).emit('gameData', gameData);
        })
        socket.on('updateScore', function(gameData) {
            console.log('updateScore::' + socket.id);
            console.log(gameData);
            roomData[gameData.roomName] = gameData;
            io.to(gameData.roomName).emit('gameData', gameData);
        })
        socket.on('disconnect', (reason) => {
            console.log('disconnect::' + socket.id + '::' + reason);
            console.log(roomData);
            console.log(socketData);
            if (!socketData[socket.id]) {
                console.log('Unable to find socketData.  Zombie connection.')
                return
            }
            const nickname = socketData[socket.id].nickname
            const roomName = socketData[socket.id].roomName
            const teamMembers = roomData[roomName].teamMembers
            removeTeamMember(teamMembers, nickname) 
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

module.exports = game;