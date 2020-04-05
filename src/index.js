var _ = require('lodash');
var fullClueList = require('./clue-list.json');

var eventBus = new Vue()

Vue.component('clue-giver', {
    props: {
        clueIndex: {
            type: Number,
            required: true
        }
    },
    computed: {
        clue() {
            return this.clueIndex >= 0 ? fullClueList[this.clueIndex] : { name: '', description: ''}
        } 
    },
    template: `
        <div>
            <p>
                <b>Your clue is {{clue.name}}</b>
                {{clue.description}}
            </p>
            <button v-on:click="clueGiverSuccess">Success!</button> 
            <button>Pass</button> 
        </div>
    `,
    methods: {
        clueGiverSuccess() {
            eventBus.$emit('clue-giver-success', this.clueIndex)
        }
    }
})

var app = new Vue({
    template: `
        <div>
            <div>
                <button v-on:click="startGame">START GAME</button>
            </div>

            <div>
                <button v-on:click="startRound">START ROUND</button>
            </div>

            <b>You are the {{persona}}</b>
            <clue-giver :clueIndex="currentClueIndex"></clue-giver>
        </div>
    `,
    el: '#app',
    data: {
        persona: 'clue-giver',
        currentClueIndex: -1,
        maxSelectedCards: 5,
        clueListSelected: null,
        clueListInPlay: null,
    },
    methods: {
        pickRandomCards(noToPick, noOfCards) {
            console.log('pickRandomCards()')
            return _.slice(_.shuffle(Array(noOfCards).fill().map((_, i) => i)), 0, noToPick)
        },
        startGame() {
            console.log('startGame()')
           this.clueListSelected = this.pickRandomCards(this.maxSelectedCards, fullClueList.length - 1)
           console.log('Game Started: ' + this.clueListSelected)
        },
        startRound() {
            console.log('startRound()')
           this.currentClueIndex = this.drawClue()
        },
        drawClue() {
            console.log('drawClue()')
            return this.clueListSelected.pop()
        },
        clueSuccess() {

        },
        cluePass() {
        },


    },
    mounted() {
        eventBus.$on('clue-giver-success', clueIndex => (
            console.log('Successfully guessed:' + fullClueList[clueIndex].name)
            //this.reviews.push(productReview)
        ))
    }

})