var _ = require('lodash');
var fullClueList = require('./clue-list.json');

var eventBus = new Vue()

Vue.component('clue-giver', {
    props: {
        clueIndex: {
            type: Number,
            required: true
        },
        state: {
            type: String,
            required: true
        },
    },
    computed: {
        clue() {
            console.log('clue()')
            return this.clueIndex >= 0 ? fullClueList[this.clueIndex] : { name: '', description: ''}
        },
        gameStarted() {
            return this.state === 'game-started' || this.state === 'round-started'
        },
        roundStarted() {
            console.log('roundStarted()')
            console.log(this.state)
            console.log(this.state === 'round-started')
            return this.state === 'round-started'
        },
    },
    template: `
        <div>
            <div v-show="roundStarted">
                <p>
                    <b>Your clue is {{clue.name}} ({{clueIndex}})</b>
                    {{clue.description}}
                </p>
                <button v-on:click="clueGiverSuccess">Success!</button> 
                <button v-on:click="clueGiverPass">Pass</button> 
            </div>
        </div>
    `,
    methods: {
        clueGiverSuccess() {
            eventBus.$emit('clue-giver-success', this.clueIndex)
        },
        clueGiverPass() {
            eventBus.$emit('clue-giver-pass', this.clueIndex)
        }
    }
})

var app = new Vue({
    template: `
        <div>
            <div v-show="shouldStartGameBeVisible">
                <button v-on:click="startGame">START GAME</button>
            </div>

            <div v-show="shouldStartRoundBeVisible">
                <button v-on:click="startRound">START ROUND</button>
            </div>

            <div v-show="shouldGameDetailsBeVisible">
                <b>You are the {{persona}}</b></br>
                <b>Cards left: {{clueListInPlay}}</b></br>
                <b># of Cards left: {{numberOfcardsLeftInPlay}}</b>
                <clue-giver :clueIndex="currentClueIndex" :state="state"></clue-giver>
            </div>
        </div>
    `,
    el: '#app',
    data: {
        persona: 'clue-giver',
        currentClueIndex: -1,
        maxSelectedCards: 5,
        fullClueList: fullClueList,
        clueListSelected: [],
        clueListInPlay: [],
        state: 'waiting-for-game-to-start',
    },
    methods: {
        // If we have 13 cards and want 5, Create an array of 0-12, shuffle it and then take the first 5 elements
        pickRandomCards(noToPick, noOfCards) {
            console.log('pickRandomCards()')
            return _.slice(_.shuffle(Array(noOfCards).fill().map((_, i) => i)), 0, noToPick)
        },
        // To start the game, shuffle the full deck of cards, pick random ones and then set aside which cards are "Selected"
        // The Selected cards are now "In Play".
        startGame() {
            console.log('startGame()')
            this.clueListSelected = this.pickRandomCards(this.maxSelectedCards, fullClueList.length - 1)
            this.clueListInPlay = [...this.clueListSelected]
            this.state = 'game-started'
            console.log('Game Started: ' + this.clueListInPlay)
        },
        // Take the first card from the selected list and show it to the clue-giver
        startRound() {
            console.log('startRound()')
            this.state = 'round-started'
            this.drawClue()
        },
        // Take the first card off the top of the In Play cards.
        drawClue() {
            console.log('drawClue()')
            this.currentClueIndex = this.clueListInPlay.pop()
        },
        // Score points for that team (TBD) and draw a new card
        clueSuccess() {
            console.log('clueSuccess()')
            this.drawClue()
        },
        // Clue-giver gives up.  Put card on bottom of deck and draw a new one
        cluePass() {
            console.log('cluePass()')
            this.clueListInPlay.unshift(this.currentClueIndex)
            this.drawClue()
            console.log('cluePass: ' + this.clueListInPlay)
        },

    },
    computed: {
        numberOfcardsLeftInPlay() {
            return this.clueListSelected.length
        },
        shouldStartGameBeVisible() {
            return this.state === 'waiting-for-game-to-start'
        },
        shouldStartRoundBeVisible() {
            return this.state === 'game-start' || this.state === 'game-started'
        },
        shouldGameDetailsBeVisible() {
            return this.state === 'game-start' || this.state === 'round-started' || this.state === 'game-started'
        },
    },
    mounted() {
        eventBus.$on('clue-giver-success', clueIndex => (
            this.clueSuccess()
        )),
        eventBus.$on('clue-giver-pass', clueIndex => (
            this.cluePass()
        ))
    }

})