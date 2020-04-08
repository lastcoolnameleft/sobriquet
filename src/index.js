var _ = require('lodash');
var fullClueList = require('./clue-list.json');
import Score from './components/Score'
import ClueGiver from './components/ClueGiver'
import GameWaiting from './components/GameWaiting'
import RoundWaiting from './components/RoundWaiting'
import TurnWaiting from './components/TurnWaiting'
import RoundComplete from './components/RoundComplete'

var eventBus = new Vue()

var app = new Vue({
    components: { Score, ClueGiver, GameWaiting, RoundWaiting, TurnWaiting, RoundComplete },
    template: `
        <div >
            <Score :isGameStarted="isGameStarted" :team1Score="team1Score" :team2Score="team2Score"></Score>
            <GameWaiting v-show="isGameWaiting" :eventBus="eventBus" ></GameWaiting>
            <RoundWaiting v-show="isRoundWaiting" :eventBus="eventBus" :roundIndex="roundIndex"></RoundWaiting>
            <TurnWaiting v-show="isTurnWaiting" :eventBus="eventBus" :roundIndex="roundIndex"></TurnWaiting>
            <RoundComplete v-show="isRoundComplete" :eventBus="eventBus" :roundIndex="roundIndex" ></RoundComplete>


            <div v-show="shouldGameDetailsBeVisible">
                <b>You are the {{persona}}</b></br>
                <b># of Cards left: {{numberOfcardsLeftInPlay + 1}}</b>
                <clue-giver :clue="clue" :eventBus="eventBus" :clueIndex="currentClueIndex" :gameState="gameState" :roundState="roundState"></clue-giver>
            </div>
        </div>
    `,
    el: '#app',
    data: {
        eventBus: eventBus,  // silly, but I need a way to pass this to sub-components
        persona: 'clue-giver',
        currentClueIndex: -1,
        maxSelectedCards: 5,
        fullClueList: fullClueList, // silly, but I need to pull from global variable to local.  I'm sure someone will scream at me for this.
        clueListSelected: [], // cards selected at the beginning of the game
        clueListInPlay: [], // starts with same list as clueListSelected, but call pop() each time clue-giver draws cards
        gameState: 'waiting',
        roundState: 'waiting',
        turnState: 'waiting',
        roundIndex: -1, // -1: Not ready yet.  0 = round 1, 1 = round 2, 2 = round 3.  Because that's how zero-indexing works.
        teamIndex: 0, // zero-indexed, so really Team 0 and Team 1, but we should display it as Team 1 and Team 2
        // 2 teams, 3 rounds, keep the index of each card that the team scores
        // Looks like this:  scoredCardIndex[teamIndex][roundIndex][List of card indexes successfully scored]
        scoredCardIndex: [[ [], [], [], ], [ [], [], [], ]] 
    },
    methods: {
        // If we have 13 cards and want 5, Create an array of 0-12, shuffle it and then take the first 5 elements
        pickRandomCards(noToPick, noOfCards) {
            //console.log('pickRandomCards()')
            return _.slice(_.shuffle(Array(noOfCards).fill().map((_, i) => i)), 0, noToPick)
        },
        // To start the game, shuffle the full deck of cards, pick random ones and then set aside which cards are "Selected"
        // The Selected cards are now "In Play".
        startGame() {
            //console.log('startGame()')

            // In the real game, players get 8 cards and pick which 5 they want.  Randomly picking for now.
            this.clueListSelected = this.pickRandomCards(this.maxSelectedCards, fullClueList.length - 1)
            this.gameState = 'started'
            //console.log('Game Started: ' + this.clueListInPlay)
        },
        // Take the first card from the selected list and show it to the clue-giver
        startRound() {
            //console.log('startRound()')
            // Each time the round starts, we start over from the cards selected at the beginning
            this.clueListInPlay = [...this.clueListSelected]
            this.roundState = 'started'
            this.turnState = 'waiting'
            this.roundIndex += 1
        },
        startTurn() {
            //console.log('startTurn()')
            this.turnState = 'started'
            this.drawClue()
        },
        // Take the first card off the top of the In Play cards.
        drawClue() {
            //console.log('drawClue()')
            this.currentClueIndex = this.clueListInPlay.pop()
        },
        // Score points for that team (TBD) and draw a new card
        // Add the index of the card to the "scoredCardIndex"
        clueSuccess() {
            //console.log('clueSuccess()')
            this.scoredCardIndex[this.teamIndex][this.roundIndex].push(this.currentClueIndex)
            if (this.numberOfcardsLeftInPlay > 0) {
                this.drawClue()
            } else {
                this.roundState = 'complete'
                this.turnState = 'complete'
            }
        },
        // Clue-giver gives up.  Put card on bottom of deck and draw a new one
        // The rules say the card is lost for this round, but keeping logic simple for now and adding to bottom of deck
        cluePass() {
            //console.log('cluePass()')
            this.clueListInPlay.unshift(this.currentClueIndex)
            this.drawClue()
            console.log('cluePass: ' + this.clueListInPlay)
        },

    },
    computed: {
        clue() {
            return this.currentClueIndex >= 0 ? this.fullClueList[this.currentClueIndex] : {}
        },
        numberOfcardsLeftInPlay() {
            return this.clueListInPlay.length
        },
        isGameStarted() {
            return this.gameState === 'started'
        },
        isGameWaiting() {
            return this.gameState === 'waiting'
        },
        isRoundWaiting() {
            return this.gameState === 'started' && this.roundState === 'waiting'
        },
        isTurnWaiting() {
            return this.gameState === 'started' && this.roundState === 'started' && this.turnState === 'waiting'
        },
        isRoundComplete() {
            return this.gameState === 'started' && this.roundState === 'complete'
        },
        shouldGameDetailsBeVisible() {
            return this.gameState === 'started' && this.roundState === 'started' && this.turnState === 'started'
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
        eventBus.$on('start-game', () => (
            this.startGame()
        )),
        eventBus.$on('start-round', () => (
            this.startRound()
        )),
        eventBus.$on('start-turn', () => (
            this.startTurn()
        )),
        eventBus.$on('clue-giver-success', clueIndex => (
            this.clueSuccess()
        )),
        eventBus.$on('clue-giver-pass', clueIndex => (
            this.cluePass()
        ))
    }

})