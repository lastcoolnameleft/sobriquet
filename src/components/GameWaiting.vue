<template>
    <div>
        <p>Welcome to an online webapp version of Monikers, a dumb party game that respects you intelligence.</p>
        <b>Rules:</b>
        <br>
        
        <p>A person from the starting team has 60 seconds to get their team to guess as many names as possible from the deck by giving clues about the card's identity. There’s no limit to the number of guesses.</p>

        <p>Skipping is allowed and highly encouraged in all rounds.</p>
        
        <p>Teams keep the cards they guessed correctly for scoring. Skipped cards are reshuffled into the deck after each turn.</p>
        
        <p>Teams take turns giving clues. Each player should take a turn giving clues before any teammates repeat.</p>
        
        <p>A round ends when all cards from the deck have been guessed correctly. When that happens, teams add the point values from each card they correctly guessed.</p>
        
        <p>The team with the lowest score begins the next round.</p>

        <p>For any questions, check out the <a href='https://s3.amazonaws.com/www.monikersgame.com/Press+kit/Monikers+PnP.pdf'>complete rules</a>.</p>
        <button v-on:click="startGame">START GAME</button>
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
        startGame() {
            this.eventBus.$emit('start-game')
        },
    }
}
</script>