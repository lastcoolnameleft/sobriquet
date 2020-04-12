<template>
    <div>
        <GameWaiting v-show="isGameWaiting" :eventBus="eventBus"></GameWaiting>
        <Lobby v-show="isGameCreated" :eventBus="eventBus" :gameData="gameData" :isHost="isHost"></Lobby>
        <RoundWaiting v-show="isRoundWaiting" :eventBus="eventBus" :gameData="GameData" :roundInfo="roundInfo" :team1Score="team1Score" :team2Score="team2Score"></RoundWaiting>
        <RoundComplete v-show="isRoundComplete" :eventBus="eventBus" :gameData="GameData" :roundInfo="roundInfo" :team1Score="team1Score" :team2Score="team2Score"></RoundComplete>
        <GameComplete v-show="isGameComplete" :eventBus="eventBus" :gameData="GameData" :roundInfo="roundInfo" :team1Score="team1Score" :team2Score="team2Score" ></GameComplete>
        <ClueGiver v-show="shouldGameDetailsBeVisible" :gameData="GameData" :numberOfcardsLeftInPlay="numberOfcardsLeftInPlay" :roundInfo="roundInfo" :clue="clue" :eventBus="eventBus" :clueIndex="activeCardIndex" ></ClueGiver>
    </div>
</template>

<script>
var fullClueList = require('../clue-list.json');
var eventBus = new Vue()
var _ = require('lodash');
import Vue from 'vue'
import ClueGiver from './ClueGiver'
import GameWaiting from './GameWaiting'
import RoundWaiting from './RoundWaiting'
import RoundComplete from './RoundComplete'
import GameComplete from './GameComplete'
import Lobby from './Lobby'

var gameData = {
    roomName: '',
    teamData: {
        names: ['', ''],
        // zero-indexed, so really Team 0 and Team 1, but we should display it as Team 1 and Team 2
        members: [ [], [] ],
        currentTeamIndex: 0,
    },
    state: {
      game: 'waiting',
      round: 'waiting',
      turn: 'waiting',
    }
}

export default {
    components: { ClueGiver, GameWaiting, RoundWaiting, RoundComplete, GameComplete, Lobby },
    sockets: {
        connect: function () {
            console.log('APP:socket connected')
        },
        gameData: function(data) {
            console.log('APP:game data')
            console.log(data)
            this.gameData = data
        },
        customEmit: function () {
            console.log('APP:this method was fired by the socket server. eg: io.emit("customEmit", data)')
        },
        reconnect: function () {
            console.log('APP:socket RECONNECTED')
        },

    },
    data() {
        return {
            gameData,
            eventBus,
            nickname: '',
            fullClueList,
            teamInfo: {
                names: ['Team 1', 'Team 2'],
                // zero-indexed, so really Team 0 and Team 1, but we should display it as Team 1 and Team 2
                members: [ [], [] ],
                currentTeamIndex: 0,
            },
            // Static player data.
            roundInfo: {
                names: ['Round One', 'Round Two', 'Round Three'],
                descriptions: [
                    'Describe the name using any words, sounds, or gestures except the name itself',
                    'Describe the name using only one word, which can be anything except the name itself',
                    'Describe the name using just charades. No words. Sound effects are OK'
                ],
                // 0 = round 1, 1 = round 2, 2 = round 3.  Because that's how zero-indexing works.
                currentRoundIndex: 0,
            },
            persona: 'clue-giver',
            maxSelectedCards: 5,
            clueListSelected: [], // cards selected at the beginning of the game
            clueListInPlay: [], // starts with same list as clueListSelected, but call pop() each time clue-giver draws cards
            // 2 teams, 3 rounds, keep the index of each card that the team scores
            // Looks like this:  scoredCardIndex[teamInfo.currentTeamIndex][roundInfo.currentRoundIndex][List of card indexes successfully scored]
            scoredCardIndex: [[ [], [], [], ], [ [], [], [], ]] 
        }
    },
    methods: {
        createGame(createGameData, nickname) {
            console.log('createGame()')
            this.nickname = nickname
            this.$socket.emit("createGame", createGameData, nickname);
            this.gameData.state.game = 'created'
        },
        // If we have 13 cards and want 5, Create an array of 0-12, shuffle it and then take the first 5 elements
        pickRandomCards(noToPick, noOfCards) {
            //console.log('pickRandomCards()')
            return _.slice(_.shuffle(Array(noOfCards).fill().map((_, i) => i)), 0, noToPick)
        },
        // To start the game, shuffle the full deck of cards, pick random ones and then set aside which cards are "Selected"
        // The Selected cards are now "In Play".
        startGame() {
            //console.log('startGame()')
            this.$socket.emit('startGame', this.roomName);
        },
        joinGame(roomName, nickname) {
            this.nickname = nickname
            this.$socket.emit('joinGame', roomName, nickname);
        },
        // To restart the game, reset some values and then start the game
        restartGame() {
            console.log('restartGame()')
        },
        endGame() {
            console.log('endGame()')
            this.gameData.state.game = 'complete'
        },
        // Take the first card from the selected list and show it to the clue-giver
        startRound() {
            //console.log('startRound()')
            // Each time the round starts, we start over from the cards selected at the beginning
            this.clueListInPlay = [...this.clueListSelected]
            this.gameData.state.round = 'started'
            this.startTurn()
        },
        endRound() {
            console.log('endRound()')
            this.gameData.state.round = 'complete'
            this.gameData.state.turn = 'complete'
            this.roundInfo.currentRoundIndex += 1
            if (this.roundInfo.currentRoundIndex > 2) {
                this.endGame()
            }
        },

        startTurn() {
            //console.log('startTurn()')
            this.gameData.state.turn = 'started'
            this.drawClue()
        },
        // Take the first card off the top of the In Play cards.
        drawClue() {
            //console.log('drawClue()')
            this.activeCardIndex = this.clueListInPlay.pop()
        },
        // Score points for that team (TBD) and draw a new card
        // Add the index of the card to the "scoredCardIndex"
        clueSuccess() {
            //console.log('clueSuccess()')
            this.scoredCardIndex[this.activeTeamIndex][this.activeRoundIndex].push(this.activeCardIndex)
            if (this.numberOfcardsLeftInPlay > 0) {
                this.drawClue()
            } else {
                this.endRound()
            }
        },
        // Clue-giver gives up.  Put card on bottom of deck and draw a new one
        // The rules say the card is lost for this round, but keeping logic simple for now and adding to bottom of deck
        cluePass() {
            //console.log('cluePass()')
            this.clueListInPlay.unshift(this.activeCardIndex)
            this.drawClue()
            console.log('cluePass: ' + this.clueListInPlay)
        },

    },
    computed: {
        activeCardIndex() {
            return this.gameData.cards.activeCardIndex
        },
        activeTeamIndex() {
            return this.gameData.state.activeTeamIndex
        },
        activeRoundIndex() {
            return this.gameData.state.activeRoundIndex
        },
        roomName() {
            return this.gameData.roomName
        },
        isHost() {
            return this.gameData.host == this.nickname
        },
        clue() {
            return this.activeCardIndex >= 0 ? this.fullClueList[this.activeCardIndex] : {}
        },
        numberOfcardsLeftInPlay() {
            return this.clueListInPlay.length
        },
        isGameStarted() {
            return this.gameData.state.game === 'started'
        },
        isGameWaiting() {
            return this.gameData.state.game === 'waiting'
        },
        isRoundWaiting() {
            return this.gameData.state.game === 'started' && this.gameData.state.round === 'waiting'
        },
        isTurnWaiting() {
            return this.gameData.state.game === 'started' && this.gameData.state.round === 'started' && this.gameData.state.turn === 'waiting'
        },
        isRoundComplete() {
            return this.gameData.state.game === 'started' && this.gameData.state.round === 'complete'
        },
        isGameComplete() {
            return this.gameData.state.game === 'complete'
        },
        isGameCreated() {
            return this.gameData.state.game === 'created'
        },
        shouldGameDetailsBeVisible() {
            return this.gameData.state.game === 'started' && this.gameData.state.round === 'started' && this.gameData.state.turn === 'started'
        },

        // To calculate the score, sum all of the points for each card scored for a single round.  And then add up all 3 rounds
        team1Score() {
            var team1round1 =  _.reduce(this.scoredCardIndex[0][0], function(sum, n) { return sum + fullClueList[n].points }, 0)
            var team1round2 =  _.reduce(this.scoredCardIndex[0][1], function(sum, n) { return sum + fullClueList[n].points }, 0)
            var team1round3 =  _.reduce(this.scoredCardIndex[0][2], function(sum, n) { return sum + fullClueList[n].points }, 0)
            return team1round1 + team1round2 + team1round3
        },
        team2Score() {
            var team2round1 =  _.reduce(this.scoredCardIndex[1][0], function(sum, n) { return sum + fullClueList[n].points }, 0)
            var team2round2 =  _.reduce(this.scoredCardIndex[1][1], function(sum, n) { return sum + fullClueList[n].points }, 0)
            var team2round3 =  _.reduce(this.scoredCardIndex[1][2], function(sum, n) { return sum + fullClueList[n].points }, 0)
            return team2round1 + team2round2 + team2round3
        },
    },

    // These functions mostly route messages from the global event bus to the local functions
    mounted() {
        this.eventBus.$on('create-game', (createGameData, nickname) => {
            this.createGame(createGameData, nickname)
        }),
        this.eventBus.$on('join-game', (roomName, nickname) => (
            this.joinGame(roomName, nickname)
        )),
        this.eventBus.$on('start-game', () => (
            this.startGame()
        )),
        this.eventBus.$on('set-name', () => (
            this.startGame()
        )),
        this.eventBus.$on('restart-game', () => (
            this.restartGame()
        )),
        this.eventBus.$on('start-round', () => (
            this.startRound()
        )),
        this.eventBus.$on('start-turn', () => (
            this.startTurn()
        )),
        this.eventBus.$on('clue-giver-success', () => (
            this.clueSuccess()
        )),
        this.eventBus.$on('clue-giver-pass', () => (
            this.cluePass()
        ))
    }
}
</script>