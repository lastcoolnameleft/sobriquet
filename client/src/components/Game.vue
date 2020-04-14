<template>
    <div>
        <GameWaiting v-show="isGameWaiting" :eventBus="eventBus"></GameWaiting>
        <Lobby v-show="isGameCreated" :eventBus="eventBus" :isHost="isHost"></Lobby>
        <RoundWaiting v-show="isRoundWaiting" :eventBus="eventBus"></RoundWaiting>
        <RoundComplete v-show="isRoundComplete" :eventBus="eventBus"></RoundComplete>
        <GameComplete v-show="isGameComplete" :eventBus="eventBus"></GameComplete>
        <ClueGiver v-show="shouldGameDetailsBeVisible" :eventBus="eventBus"></ClueGiver>
    </div>
</template>

<script>
var fullClueList = require('../clue-list.json');
var eventBus = new Vue()
import Vue from 'vue'
import ClueGiver from './ClueGiver'
import GameWaiting from './GameWaiting'
import RoundWaiting from './RoundWaiting'
import RoundComplete from './RoundComplete'
import GameComplete from './GameComplete'
import Lobby from './Lobby'
import { mapGetters, mapMutations } from 'vuex';

export default {
    components: { ClueGiver, GameWaiting, RoundWaiting, RoundComplete, GameComplete, Lobby },
    sockets: {
        connect: function () {
            console.log('APP:socket connected')
        },
        gameCreated: function(roomName) {
            this.updateRoom({roomName })
        },
        gameData: function(data) {
            console.log('APP:game data')
            console.log(data)
            this.$store.replaceState(data)
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
            eventBus,
            nickname: '',
            fullClueList,
            clueListInPlay: [], // starts with same list as clueListSelected, but call pop() each time clue-giver draws cards
            // 2 teams, 3 rounds, keep the index of each card that the team scores
            // Looks like this:  scoredCardIndex[teamInfo.currentTeamIndex][roundInfo.currentRoundIndex][List of card indexes successfully scored]
            scoredCardIndex: [[ [], [], [], ], [ [], [], [], ]] 
        }
    },
    methods: {
        ...mapMutations([ 'createGame', 'updateRoom' ]),
        // To start the game, shuffle the full deck of cards, pick random ones and then set aside which cards are "Selected"
        // The Selected cards are now "In Play".
        startGame() {
            console.log('startGame()')
            this.$socket.emit('startGame', this.roomName);
        },
        joinGame(roomName, nickname) {
            console.log('joinGame()')
            this.nickname = nickname
            this.$socket.emit('joinGame', roomName, nickname);
        },
        // To restart the game, reset some values and then start the game
        restartGame() {
            console.log('restartGame()')
            this.createGame(this.nickname)
        },
        endGame() {
            console.log('endGame()')
            //this.$store.state.gameState = 'complete'
        },
        // Take the first card from the selected list and show it to the clue-giver
        startRound() {
            console.log('startRound()')
            // Each time the round starts, we start over from the cards selected at the beginning
            //this.gameData.cards.clueListInPlay = [...this.gameData.cards.clueListSelected]
            //this.$store.state.roundState = 'started'
            //this.startTurn()
        },
        endRound() {
            //console.log('endRound()')
            //this.$store.state.roundState = 'complete'
            //this.$store.state.turnState = 'complete'
            //this.gameData.rounds.activeRoundIndex += 1
            //if (this.gameData.rounds.activeRoundIndex > 2) {
////                this.endGame()
            //}
        },

        startTurn() {
            //console.log('startTurn()')
            //this.gameData.state.turn = 'started'
            //this.drawClue()
        },
        // Take the first card off the top of the In Play cards.
        drawClue() {
            //console.log('drawClue()')
            //this.gameData.cards.activeCardIndex = this.gameData.cards.clueListInPlay.pop()
        },
        // Score points for that team (TBD) and draw a new card
        // Add the index of the card to the "scoredCardIndex"
        clueSuccess() {
            //console.log('clueSuccess()')
            /*
            this.gameData.cards.scoredCardIndex[this.gameData.teams.activeTeamIndex][this.gameData.rounds.activeRoundIndex].push(this.gameData.cards.activeCardIndex)
            if (this.gameData.numberOfcardsLeftInPlay() > 0) {
                this.drawClue()
            } else {
                this.endRound()
            }
            */
        },
        // Clue-giver gives up.  Put card on bottom of deck and draw a new one
        // The rules say the card is lost for this round, but keeping logic simple for now and adding to bottom of deck
        cluePass() {
            //console.log('cluePass()')
            /*
            this.gameData.cards.cardListInPlay.unshift(this.gameData.cards.activeCardIndex)
            this.drawClue()
            console.log('cluePass: ' + this.gameData.cards.clueListInPlay)
            */
        },

    },
    computed: {
        ...mapGetters([
            'isGameStarted', 'isGameWaiting', 'isGameWaiting', 'isRoundWaiting', 'isTurnWaiting', 'isRoundComplete', 'isGameComplete', 'isGameCreated', 'shouldGameDetailsBeVisible', 'host'
        ]),
        isHost() {
            return this.$store.state.host == this.nickname
        },
    },

    // These functions mostly route messages from the global event bus to the local functions
    mounted() {
        this.eventBus.$on('set-nickname', nickname => (
            this.nickname = nickname
        )),
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