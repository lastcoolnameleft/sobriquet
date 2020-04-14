var _ = require('lodash');
var debug = require('debug')('game:socket');
var fullClueList = require('./public/clue-list.json');
var roomData = {};
// io.on('connection', function (socket) {


var addTeamMember = function(teamMembers, nickname) {
  if (teamMembers[0].length > teamMembers[1].length) {
    teamMembers[1].push(nickname)
  } else {
    teamMembers[0].push(nickname)
  }
}

// If we have 13 cards and want 5, Create an array of 0-12, shuffle it and then take the first 5 elements
var pickRandomCards = function(noToPick, noOfCards) {
    //console.log('pickRandomCards()')
    return _.slice(_.shuffle(Array(noOfCards).fill().map((_, i) => i)), 0, noToPick)
}

var game = function(io) {
    io.on('connection', (socket) => {

        console.log('connection!!')

        socket.on('createGame', function(gameData) {
            console.log('createGame');
            console.log(gameData);
            var roomName = generateRandomString(5)
            //var gameData = createNewGameData(roomName, createGameData, nickname)
            roomData[roomName] = gameData;
            socket.join(roomName);
            //console.log(roomData[roomName]);
            io.to(roomName).emit('gameCreated', roomName);
            //io.to(roomName).emit('gameData', roomData[roomName]);
        })

        socket.on('joinGame', function(roomName, nickname) {
            console.log('joinGame');
            console.log(roomData[roomName]);
            addTeamMember(roomData[roomName].teamMembers, nickname)
            socket.join(roomName);
            console.log(roomData[roomName]);
            io.to(roomName).emit('gameData', roomData[roomName]);
        })

        socket.on('startGame', function(roomName) {
            console.log('startGame');

            // In the real game, players get 8 cards and pick which 5 they want.  Randomly picking for now.
            roomData[roomName].cards.cardListSelected = pickRandomCards(roomData[roomName].cards.maxSelectedCards, fullClueList.length - 1)
            roomData[roomName].state.game = 'started'

            console.log(roomData[roomName]);
            io.to(roomName).emit('gameData', roomData[roomName]);
        })


    })
}

generateRandomString = function(len) {
    return Math.random().toString(36).substr(2, len).toUpperCase();
}
module.exports = game;