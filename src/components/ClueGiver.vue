<template>
    <div>
        <p><b>You are the Clue Giver</b></p>
        <p><b># of Cards left: {{numberOfcardsLeftInPlay + 1}}</b></p>
        <clue v-show="isRoundStarted" :clue="clue"></clue>
        <button v-on:click="clueGiverSuccess">Success!</button> 
        <button v-on:click="clueGiverPass">Pass</button> 
    </div>
</template>

<script>
import Clue from './Clue'

export default {
    components: { Clue },
    props: {
        clue: {
            type: Object,
            required: true
        },
        numberOfcardsLeftInPlay: {
            type: Number,
            required: true
        },
        gameState: {
            type: String,
            required: true
        },
        roundState: {
            type: String,
            required: true
        },
        eventBus: {
            type: Object,
            required: true
        },
    },
    computed: {
        isGameStarted() {
            return this.gameState === 'started'
        },
        isRoundStarted() {
            console.log('roundStarted()')
            return this.roundState === 'started'
        },
    },
    methods: {
        clueGiverSuccess() {
            this.eventBus.$emit('clue-giver-success', this.clueIndex)
        },
        clueGiverPass() {
            this.eventBus.$emit('clue-giver-pass', this.clueIndex)
        }
    }
    
}
</script>