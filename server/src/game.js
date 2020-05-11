var _ = require('lodash');
var fullCardList = require('../assets/cards');

class Game {
    /*
    * Potential actions:
    * Create Game
    * Join Game
    * Start Game
    * Start Round
    * Start Turn
    * End Turn
    * Card Success
    * Card Pass
    * Player Disconnect
    */


    constructor(team1Name, team2Name, numCards, host, roomName = this.generateRandomString(4)) {
        console.log(`Game(${team1Name}, ${team2Name}, ${numCards}, ${host})`)
        this.roomName = roomName
        this.host = host
        this.teamNames = [ team1Name, team2Name ]
        this.teamMembers = [ [ host ], [] ]
        this.gameState = 'created'
        this.roundState = 'waiting'
        this.turnState = 'waiting'
            // 0 = round 1, 1 = round 2, 2 = round 3.  Because that's how zero-indexing works.
        this.activeRoundIndex = 0
        this.activePlayerIndex = [ 0, 0 ]
        this.activeTeamIndex = 0
        this.activeCardIndex = -1
            
        this.maxSelectedCards = numCards
        this.cardListSelected = [] // cards selected at the beginning of the game
        this.cardListInPlay = [] // starts with same list as clueListSelected, but call pop() each time clue-giver draws cards
            // 2 teams, 3 rounds, keep the index of each card that the team scores
            // Looks like this:  scoredCardIndex[teamInfo.currentTeamIndex][roundInfo.currentRoundIndex][List of card indexes successfully scored]
        this.scoredCardIndex = [ [ [], [], [], ], [ [], [], [], ] ]
        this.roundNames = ['Round One', 'Round Two', 'Round Three'],
        this.roundDescriptions = [
                'Describe the name using any words, sounds, or gestures except the name itself',
                'Describe the name using only one word, which can be anything except the name itself',
                'Describe the name using just charades. No words. Sound effects are OK'
            ]
        // Calculated values
        this.scores = [ 0, 0 ]
    }

    getData() {
        return {
            roomName: this.roomName,
            host: this.host,
            teamNames: this.teamNames,
            teamMembers: this.teamMembers,
            gameState: this.gameState,
            roundState: this.roundState,
            turnState: this.turnState,
            activeRoundIndex: this.activeRoundIndex,
            activePlayerIndex: this.activePlayerIndex,
            activeTeamIndex: this.activeTeamIndex,
            activeCardIndex: this.activeCardIndex,
            maxSelectedCards: this.maxSelectedCards,
            cardListSelected: this.cardListSelected,
            cardListInPlay: this.cardListInPlay,
            scoredCardIndex: this.scoredCardIndex,
            roundNames: this.roundNames,
            roundDescriptions: this.roundDescriptions
        }
    }

    joinGame(nickname) {
        console.log(`joinGame(${nickname})`)
        var teamIndex = 0
        if (this.teamMembers[0].length > this.teamMembers[1].length) {
            teamIndex = 1
        }
        this.teamMembers[teamIndex].push(nickname)
    }

    startGame() {
        console.log('startGame()')
        // In the real game, players get 8 cards and pick which 5 they want.  Randomly picking for now.
        const randomCards = _.slice(_.shuffle(Array(fullCardList.length - 1).fill().map((_, i) => i)), 0, this.maxSelectedCards)
        this.cardListSelected = randomCards
        this.gameState = 'started'
    }

    startRound() {
        console.log('startRound()')
        this.cardListInPlay = [...this.cardListSelected]
        this.roundState = 'started'
        this.startTurn()
    }

    startTurn() {
        console.log('startTurn()')
        this.turnState = 'started'
        this.drawCard()
    }

    endTurn() {
        console.log('endTurn()')
        this.turnState = 'complete'
        this.nextPlayer()
        this.swapActiveTeam()
        this.moveActiveCardToBottom()
    }

    cardSuccess() {
        console.log('cardSuccess()')
        // Add the current card to the scored card data
        this.scoredCardIndex[this.activeTeamIndex][this.activeRoundIndex].push(this.activeCardIndex)
        this.updateScores()
        const numberOfCardsLeftInPlay = this.cardListInPlay.length
        if (numberOfCardsLeftInPlay > 0) {
            this.drawCard()
        } else {
            this.endRound()
        }
    }

    cardPass() {
        console.log('cardPass()')
        this.cardListInPlay.unshift(this.activeCardIndex)
        this.drawCard()
        console.log('cardPass: ' + this.cardListInPlay)    
    }

    drawCard() {
        console.log('drawCard()')
        this.activeCardIndex = this.cardListInPlay.pop()
    }

    scoreActiveCard() {
        console.log('scoreActiveCard()')
        this.scoredCardIndex[this.activeTeamIndex][this.activeRoundIndex].push(this.activeCardIndex)
    }

    nextPlayer() {
        console.log('nextPlayer()')
        this.activePlayerIndex[this.activeTeamIndex]++
        if (this.activePlayerIndex[this.activeTeamIndex] >= this.teamMembers[this.activeTeamIndex].length ) {
            this.activePlayerIndex[this.activeTeamIndex] = 0
        }
    }

    swapActiveTeam() {
        console.log('swapActiveTeam()')
        const inactiveTeamIndex = this.activeTeamIndex == 0 ? 1 : 0
        if (this.teamMembers[inactiveTeamIndex].length == 0) {
            console.log('Only playing with one person.  Skipping')
            return
        }
        if (this.activeTeamIndex == 1) {
            this.activeTeamIndex = 0
        } else {
            this.activeTeamIndex = 1
        }
    }

    moveActiveCardToBottom() {
        console.log('moveActiveCardToBottom()')
        this.cardListInPlay.unshift(this.activeCardIndex)
    }

    endRound() {
        console.log('endRound()')

        this.nextPlayer()
        this.roundState = 'complete'
        this.turnState = 'complete'
        this.activeRoundIndex += 1 
        this.setActiveTeamAfterRound()
        if (this.activeRoundIndex > 2) {
          this.endGame()
        }
    }

    endGame() {
        console.log('endGame()')
        this.gameState = 'complete'
    }

    updateScores() {
        const team1round1 =  _.reduce(this.scoredCardIndex[0][0], function(sum, n) { return sum + fullCardList[n].pointValue }, 0)
        const team1round2 =  _.reduce(this.scoredCardIndex[0][1], function(sum, n) { return sum + fullCardList[n].pointValue }, 0)
        const team1round3 =  _.reduce(this.scoredCardIndex[0][2], function(sum, n) { return sum + fullCardList[n].pointValue }, 0)
        const team1Score = team1round1 + team1round2 + team1round3

        const team2round1 =  _.reduce(this.scoredCardIndex[1][0], function(sum, n) { return sum + fullCardList[n].pointValue }, 0)
        const team2round2 =  _.reduce(this.scoredCardIndex[1][1], function(sum, n) { return sum + fullCardList[n].pointValue }, 0)
        const team2round3 =  _.reduce(this.scoredCardIndex[1][2], function(sum, n) { return sum + fullCardList[n].pointValue }, 0)
        const team2Score = team2round1 + team2round2 + team2round3

        this.scores[ team1Score, team2Score ]
    }

    setActiveTeamAfterRound() {
        console.log('setActiveTeamAfterRound()')
        const inactiveTeamIndex = this.activeTeamIndex == 0 ? 1 : 0
        if (this.teamMembers[inactiveTeamIndex].length == 0) {
          console.log('Only playing with one person.  Skipping')
          return
        }

        if (this.scores[0] > this.scores[1]) {
          this.activeTeamIndex = 1
        }
        else if (this.scores[1] > this.scores[0]) {
          this.activeTeamIndex = 0
        }
        else if (this.scores[0] == this.scores[1]) {
          this.activeTeamIndex = inactiveTeamIndex
        }
    }


    removeTeamMember(nickname) {
        console.log(`removeTeamMeber(${nickname})`)
        var foundTeamIndex = -1
        if (this.teamMembers[0].indexOf(nickname) > -1) {
            foundTeamIndex = 0
        } else if (this.teamMembers[1].indexOf(nickname) > -1) {
            foundTeamIndex = 1
        } else {
            console.log('Unable to find ' + nickname)
        }

        if (foundTeamIndex >= 0) {
            // Found them in team 1
            this.teamMembers[foundTeamIndex].splice(this.teamMembers[foundTeamIndex].indexOf(nickname), 1)

            // If we removed the last player, start at beginning
            if (this.activePlayerIndex[foundTeamIndex] >= this.teamMembers[foundTeamIndex].length ) {
                console.log('Removed last player for team 1.  resetting active player index')
                this.activePlayerIndex[foundTeamIndex] = 0
            } 
        }
    }

    generateRandomString(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    isDuplicateNickname(nickname) {
        if (this.teamMembers[0].find( i => i == nickname ) ||
            this.teamMembers[1].find( i => i == nickname )) {
                return true
        }
        return false
    }
}

module.exports = Game