<template>
      <div class="background-monikers">
        <div class="flex">
          <h5 class="scores blue">
            Team #1 : {{team1Score}}
          </h5>
          <h5 class="scores purple">
            Team #2 : {{team2Score}}
          </h5>
        </div>
        <div class="team-transition">
          <h2 class="current-team-headline" style="{ color: '#00B4EF' };">
            It's {{activePlayerName}} turn
          </h2>
          <p class="remaining-cards">
            {{numberOfCardsLeftInPlay}} Cards Remaining
          </p>
          <div class="dashed-line-next" />
          <button class="start-turn-button" v-show="isActivePlayer(nickname)" v-on:click="clickedStartTurn">
            START
          </button>
        </div>
      </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    props: {
        eventBus: {
            type: Object,
            required: true
        },
        nickname: {
            type: String,
            required: true
        },
    },
    methods: {
      ...mapActions([ 'startTurn' ]),
        clickedStartTurn() {
            this.startTurn()
        },
    },
    computed: {
      ...mapGetters([
        'team1Score', 'team2Score', 'activePlayerName', 'isActivePlayer', 'numberOfCardsLeftInPlay'
      ]),
    },
}
</script>
<style scoped>
.background-monikers {
  background-image: url('../assets/seamlessbg-03.svg');
  background-repeat: repeat;
  width: 100%;
  background-size: 75%;
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.team-transition {
  width: 85%;
  margin: 25px auto;
  background-color: #FFF;
  border-radius: 15px;
  padding: 20px 20px 40px 20px;
  -webkit-box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  -moz-box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
}

.start-turn-button {
  width: 100%;
  height: 40px;
  color: #FFF;
  background-color: rgba(76, 189, 159, 1);
  border: 1px solid #FFF;
  border-radius: 5px;
  font-size: 1rem;
  margin-top: 0;
  -webkit-box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  -moz-box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
}

.current-team-headline {
  color: #00B4EF;
  text-align: center;
  font-size: 2rem;
}

.remaining-cards {
  color: #555;
  font-size: 1.2rem;
  text-align: center;
}

.dashed-line-next {
  border-bottom: 2px dotted #999;
  width: 40%;
  margin: 30px auto;
}

@media (min-width: 360px) {
  .current-team-headline {
    font-size: 2.2rem;
  }

  .start-turn-button {
    height: 45px;
  }
  
}

@media (min-width: 620px) {

  .team-transition {
    width: 400px;
    padding: 20px 50px 40px;
  }
}

.flex {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between; 
  background-color: #FFF;
  border-bottom:3px solid #00B4EF;
}

.scores {
  display: inline-block;
  margin: 15px auto 15px auto;
  
}

.blue {
  color: #00B4EF;
  font-size: 1.1rem;
  font-weight: 600;

}

.purple {
  color: #866AAD;
  font-size: 1.1rem;
  font-weight: 600;
}

.background-monikers {
  background-image: url('../assets/seamlessbg-03.svg');
  background-repeat: repeat;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

</style>