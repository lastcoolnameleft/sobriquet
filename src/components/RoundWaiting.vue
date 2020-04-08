<template>
    <div>
        <p>Monikers has 3 rounds. Each has a restriction on how players are allowed to give clues:</p>
        <p><b>ROUND 1:</b> You can use any words, sounds, or gestures except the name itself, including the clue text on the card. If you say any part of the name, you have to skip that card this turn.</p>
        <p><b>ROUND 2:</b> Use only one word, which can be anything except the name itself. You can repeat that word as many times as you like, but no sounds or gestures.</p>
        <p><b>ROUND 3:</b> Just charades. No words. Sound effects are OK.</p>
        <button v-on:click="startRound">START ROUND</button>
    </div>
</template>

<script>
export default {
    props: {
        eventBus: {
            type: Object,
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