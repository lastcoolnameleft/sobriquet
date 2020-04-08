<template>
    <div>
        <p><b>Round {{roundIndex + 1}} complete.</b></p>

        <div v-show="roundIndex == 0">
            <p>Rules for the next round:</p>
            <p><b>ROUND 2:</b> Use only one word, which can be anything except the name itself. You can repeat that word as many times as you like, but no sounds or gestures.</p>
            <button v-on:click="startRound">START ROUND</button>
        </div>
        <div v-show="roundIndex == 1">
            <p>Rules for the next round:</p>
            <p><b>ROUND 3:</b> Just charades. No words. Sound effects are OK.</p>
            <button v-on:click="startRound">START ROUND</button>
        </div>
        <div v-show="roundIndex == 2">
            <p>GAME OVER</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        eventBus: {
            type: Object,
            required: true
        },
        roundIndex: {
            type: Number,
            required: true
        },
    },
    methods: {
        // To start the game, shuffle the full deck of cards, pick random ones and then set aside which cards are "Selected"
        // The Selected cards are now "In Play".
        startRound() {
            this.eventBus.$emit('start-round')
        },
    }
}
</script>