<template>
      <div class="background-monikers">
        <div class="team-transition">
          <h2 class="current-team-headline" style="{ color: '#00B4EF' };">
            It's {{activePlayer}}'s turn
          </h2>
          <p class="remaining-cards">
            XXX Cards Remaining
          </p>
          <div class="dashed-line-next" />
          <button class="start-turn-button" v-on:click="clickedStartTurn">
            START
          </button>
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
    },
    methods: {
        clickedStartTurn() {
            this.eventBus.$emit('start-turn')
        },
    }
}
</script>