var _ = require('lodash');
var debug = require('debug')('game:socket');
var fullClueList = require('./public/clue-list.json');
var roomData = {};
// io.on('connection', function (socket) {

var createNewGameData = function(roomName, createGameData, nickname) {
  return {
    roomName,
    host: nickname,
    teamData: {
        names: [createGameData.team1Name, createGameData.team2Name],
        // zero-indexed, so really Team 0 and Team 1, but we should display it as Team 1 and Team 2
        members: [ [nickname], [] ],
    },
    state: {
      game: 'created',
      round: 'waiting',
      turn: 'waiting',
      activeTeamIndex: 0,
      activePlayerIndex: 0,
      activeRoundIndex: 0,
    },
    cards: {
      activeCardIndex: -1,
      maxSelectedCards: 5,
      cardListSelected: [], // cards selected at the beginning of the game
      cardListInPlay: [], // starts with same list as clueListSelected, but call pop() each time clue-giver draws cards
      // 2 teams, 3 rounds, keep the index of each card that the team scores
      // Looks like this:  scoredCardIndex[teamInfo.currentTeamIndex][roundInfo.currentRoundIndex][List of card indexes successfully scored]
      scoredCardIndex: [[ [], [], [], ], [ [], [], [], ]] 
    }
  }
};

var addTeamMember = function(roomName, nickname) {
  if (roomData[roomName].teamData.members[0].length > roomData[roomName].teamData.members[1].length) {
    roomData[roomName].teamData.members[1].push(nickname)
  } else {
    roomData[roomName].teamData.members[0].push(nickname)
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

        socket.on('createGame', function(createGameData, nickname) {
            console.log('createGame');
            console.log(createGameData);
            var roomName = generateRandomString(5)
            var gameData = createNewGameData(roomName, createGameData, nickname)
            roomData[roomName] = gameData;
            socket.join(roomName);
            console.log(roomData[roomName]);
            io.to(roomName).emit('gameData', roomData[roomName]);
        })

        socket.on('joinGame', function(roomName, nickname) {
            console.log('joinGame');
            addTeamMember(roomName, nickname)
            socket.join(roomName);
            console.log(roomData[roomName]);
            io.to(roomName).emit('gameData', roomData[roomName]);
        })

        socket.on('startGame', function(roomName) {
            console.log('startGame');

            // In the real game, players get 8 cards and pick which 5 they want.  Randomly picking for now.
            roomData[roomName].cardData.cardListSelected = pickRandomCards(roomData[roomName].cardData.maxSelectedCards, fullClueList.length - 1)
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