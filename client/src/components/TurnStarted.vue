<template>
        <div class="background-image">
          <div class="play">
            <div class="game-info-container">
              <h5 class="scores blue">
                Team #1 : {{team1Score}}
              </h5>
              <h5 class="scores purple">
                Team #2 : {{team2Score}}
              </h5>
            </div>
            <div class="timer" v-bind:style="{ 'animation-duration': timerLengthCss }" ></div>
            <div v-if="isRoundStarted && isActivePlayer">
              <clue></clue>
              <div class="buttons-container">
                <button
                  class="pass-button ripple-pass"
                  v-on:click="clickedPass" >
                  Pass
                </button>
                <button
                  class="got-it-button ripple-got-it"
                  v-on:click="clickedSuccess" >
                  Success!
                </button>
              </div>
            </div>
            <div v-else-if="isActiveTeam">
              <div class="round-transition">
                <h3 class="active-team">
                    <div>It's your team's turn!</div>
                </h3>
                <h3 class="active-team">
                    <div>UNMUTE YOUR MIC AND GUESS!</div>
                </h3>
              </div>
            </div>
            <div v-else>
              <div class="round-transition">
                <h3 class="inactive-team">
                    <div>It's NOT your team's turn!</div>
                </h3>
                <h3 class="inactive-team">
                    <div>Sssshhhh.... MUTE YOUR MIC!</div>
                </h3>
              </div>
            </div>
          </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Clue from './Clue'

export default {
    components: { Clue },
    props: {
        eventBus: {
            type: Object,
            required: true
        },
    },
    data() {
      return {
        timer: null,
        timerLength: process.env.VUE_APP_TIMER_LENGTH,
      }
    },
    computed: {
      ...mapGetters([
        'isRoundStarted', 'isActivePlayer', 'team1Score', 'team2Score', 'isActiveTeam',
        'numberOfCardsLeftInPlay'
      ]),
      timerLengthCss() { return this.timerLength + 's' },
      timerLengthJs() { return this.timerLength * 1000 },
    },
    methods: {
        // Score points for that team (TBD) and draw a new card
        // Add the index of the card to the "scoredCardIndex"
        clickedSuccess() {
          console.log('clickedSuccess()')
          this.$socket.emit('cardSuccess');
          if (this.numberOfCardsLeftInPlay == 0) {
            clearTimeout(this.timer)
          }
        },
        clickedPass() {
          this.$socket.emit('cardPass');
        },
    },
    created: function() {
      if (this.isActivePlayer) {
        this.timer = setTimeout(function() {
          console.log('TIMER COMPLETE')
          this.$socket.emit('endTurn');
        }.bind(this), this.timerLengthJs)
        console.log('TIMER CREATED')
      }
    },
    beforeDestroy () {
      if (this.isActivePlayer) {
        clearTimeout(this.timer)
      }
    }
    
}
</script>

<style scoped>
.background-image {
  background-image: url('../assets/seamlessbg-03.svg');
  background-repeat: repeat;
  background-size: 75%;
}

.play {
  width: 100%;
  height: 100vh;
  
}

.game-info-container {
  background-color: #FFF;
  width: 100%;
  display: flex;
  align-content: space-between;
  justify-content: space-between;
  margin: auto;
  padding: 0 20px;
}

.current-team {
  color: #00B4EF;
  margin: 10px 0 10px 0;
}

.current-round {
  color: #00B4EF;
  margin: 10px 0 10px 0;

}

.card-title {
  text-align: center;
  color: #555;
  margin: 0 auto 20px auto;
  font-size: 1.5rem;
  line-height: 1.6rem;
}

.points {
  text-align: center;
  color: #FFF;
  font-size: 1.4rem;
}

.description {
  color: #555;
  font-size: 0.9rem;
  line-height: 1.2rem;

}

.category {
  text-align: center;
  font-size: 1rem;
  margin: 10px auto;

}

.card-container {
  position: relative;
  background-color: #FFF;
  width: 85%;
  height: 410px;
  margin: 20px auto;
  padding: 30px 25px 0 25px;
  border-radius: 15px;
  -webkit-box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  -moz-box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
}

.ripple-pass {
  background-position: center;
  transition: background 0.8s;
}

.ripple-pass:hover {
  background: rgba(239, 83, 63, 1) radial-gradient(circle, transparent 1%, 
  rgba(239, 83, 63, 1) 1%) center/15000%;
}

.ripple-pass:active {
  background-color: rgba(239, 83, 63, 0.75);
  background-size: 100%;
  transition: background 0s;
}

.ripple-got-it {
  background-position: center;
  transition: background 0.8s;
}

.ripple-got-it:hover {
  background: rgba(76, 189, 159, 1) radial-gradient(circle, transparent 1%, 
  rgba(76, 189, 159, 1) 1%) center/15000%;
}

.ripple-got-it:active {
  background-color: rgba(239, 83, 63, 0.75);
  background-size: 100%;
  transition: background 0s;
}

.pass-button {
  width: 48%;
  height: 40px;
  color: #FFF;
  background-color: rgba(239, 83, 63, 1);
  border: 1px solid #FFF;
  border-radius: 5px;
  font-size: 1rem;
  margin-top: 0;
  -webkit-box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  -moz-box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
}

.got-it-button {
  width: 48%;
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

.dashed-line {
  border-bottom: 2px dotted #999;
  width: 40%;
  margin: 20px auto;
}

.circle {
  text-align: center;
  width: 50px;
  height: 50px;
  margin: auto;
  display:flex;
  align-items: center;
  justify-content: center;
  height:45px;
  width:90px;
  border-radius: 90px 90px 0 0;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

}

.buttons-container {
  display: flex;
  align-content: space-between;
  justify-content: space-between;
  width: 85%;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 25px;
  margin: auto;

}

.timer {
  height: 10px;
  width: 100%;
  margin: auto;
  background-color: rgba(76, 189, 159, 1);
  animation-name: countdown;
  animation-duration: 60s;
}

@keyframes countdown {
  0%   {
    background-color: rgba(76, 189, 159, 1);
    width: 100%;
  }
  50%  {
    background-color: rgb(240, 221, 49);
    width: 50%;
  }
  100% {
    background-color: rgba(239, 83, 63, 1);
    width: 0%;
  }
}

@media (min-width: 375px) {
  .card-container {
    height: 71%;
    margin: 30px auto;
    padding: 30px 30px 0 30px;
  }

  .description {
    color: #555;
    font-size: 1.1rem;
    line-height: 1.6rem;
  }

  .dashed-line {
    margin: 30px auto;
  }

  .buttons-container {
    bottom: 5%;
  }
  
  .category {
    font-size: 1.1rem;
  }

}

@media (min-width: 411px) {
  
.pass-button {
  height: 45px;
}

.got-it-button {
  height: 45px;
}

.current-team {
  margin: 15px 0 15px 0;
}

.current-round {
  margin: 15px 0 15px 0;

}

}

@media (min-width: 620px) {
.play {
  width: 400px;
  margin: auto;
}

.buttons-container {
  width: 340px;
}

.card-container {
  width: 340px;
  height: 500px;
  margin: 20px auto;
  padding: 30px 25px 0 25px;
}

.buttons-container {
  display: flex;
  align-content: space-between;
  justify-content: space-between;
  width: 85%;
  position: static;
  margin: auto;

}
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

.round-headline {
  color: #555;
  text-align: center;
  font-size: 2rem;
}

.active-team {
  color: #00B4EF;
  text-align: center;
  font-size: 1.8rem;
}

.inactive-team {
  color: rgb(239, 0, 0);
  text-align: center;
  font-size: 1.8rem;
}

.round-description {
  color: #555;
  font-size: 1rem;
  text-align: center;
}
</style>