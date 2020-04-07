<template>
    <div>
        <div v-show="isRoundStarted">
            <p>
                Your clue is: <b>{{clue.name}}</b>
            </p>
            <p>
                Description: {{clue.description}}
            </p>
            <p>
                Points: {{clue.points}}
            </p>
            <p>
                Category: {{clue.category}}
            </p>
            <button v-on:click="clueGiverSuccess">Success!</button> 
            <button v-on:click="clueGiverPass">Pass</button> 
        </div>
    </div>
</template>

<script>
export default {
    props: {
        clueIndex: {
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
        fullClueList: {
            type: Array,
            required: true
        },
        eventBus: {
            type: Object,
            required: true
        },
    },
    computed: {
        clue() {
            console.log('clue()')
            return this.clueIndex >= 0 ? this.fullClueList[this.clueIndex] : { name: '', description: ''}
        },
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