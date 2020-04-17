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
        <div class="round-transition">
          <h2 class="round-headline"> {{activeRoundName}}</h2>
          <div class="dashed-line" />
          <p class="round-description">{{activeRoundDescription}}</p>
          <div class="dashed-line" />
          <h3 class="starting-team" style="{ color: '#00B4EF' };">
            {{activeTeamName}} Starts
          </h3>
          <h3 class="starting-team" style="{ color: '#00B4EF' };">
            {{activePlayerName}} Starts
          </h3>
          <button v-show="isActivePlayer(nickname)" v-on:click="clickedStartRound" class="start-round-button" >START ROUND</button>
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
        ...mapActions([ 'startRound' ]),
        // To start the game, shuffle the full deck of cards, pick random ones and then set aside which cards are "Selected"
        // The Selected cards are now "In Play".
        clickedStartRound() {
          this.startRound()
          this.$socket.emit("startRound", this.getState);
        },
    },
    computed: {
      ...mapGetters([
        'team1Score', 'team2Score', 'activeRoundName', 'activeRoundDescription', 'activeTeamName', 'activeTeamMembers', 'activePlayerName', 'getState', 'isActivePlayer',
        'roomName', 'getState'
      ]),
    },
}
</script>


<style scoped>
.round-transition {
  width: 85%;
  margin: 40px auto 25px auto;
  background-color: #FFF;
  background-size: 75%;
  border-radius: 15px;
  padding: 20px 20px 40px 20px;
  -webkit-box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  -moz-box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
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

.round-headline {
  color: #555;
  text-align: center;
  font-size: 2rem;
}

.starting-team {
  color: #00B4EF;
  text-align: center;
  font-size: 1.8rem;
}

.round-description {
  color: #555;
  font-size: 1rem;
  text-align: center;
}

.start-round-button {
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

@media (min-width: 410px) {
  .round-transition {
    width: 80%;
    padding: 20px 30px 40px 30px;
  }

  .start-round-button {
    height: 45px;
  }

  .blue {
    font-size: 1.2rem;
  }
  
  .purple {
    font-size: 1.2rem;
  }
}

@media (min-width: 620px) {

  .round-transition {
    width: 400px;
    padding: 20px 50px 40px;
  }
}
</style>