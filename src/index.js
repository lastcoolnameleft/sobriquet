var _ = require('lodash');
var fullClueList = require('./clue-list.json');

var eventBus = new Vue()

Vue.component('clue-giver', {
    props: {
        clue: {
            type: Object,
            required: true
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
            eventBus.$emit('clue-giver-success', this.clue)
        }
    }
})

var app = new Vue({
    template: `
        <div>
            <div>
                <button v-on:click="startRound">START ROUND</button>
            </div>

            <b>You are the {{persona}}</b>
            <clue-giver :clue="currentClue"></clue-giver>
        </div>
    `,
    el: '#app',
    data: {
        persona: 'clue-giver',
        currentClue: {},
        clueList: [...fullClueList],
    },
    methods: {
        startRound() {
           this.currentClue = this.pickAndRemoveRandomClue() 
        },
        pickAndRemoveRandomClue() {
            clue = this.clueList.splice(_.random(this.clueList.length - 1), 1)[0]
            console.log('New Clue = ' + clue.name)
            return clue
        }

    },
    mounted() {
        eventBus.$on('clue-giver-success', clue => (
            console.log('Successfully guessed:' + clue.name)
            //this.reviews.push(productReview)
        ))
    }

})