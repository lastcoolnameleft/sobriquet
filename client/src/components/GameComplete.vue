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
        <div class="finish-transition">
          <h2 class="win-headline">{{winner}}</h2>
          <div class="dashed-line"></div>
        </div>
        <div class="animation-one"></div>
        <div class="animation-two"></div>
      </div>
</template>

<script>
export default {
    props: {
        eventBus: {
            type: Object,
            required: true
        },
        team1Score: {
            type: Number,
            required: true
        },
        team2Score: {
            type: Number,
            required: true
        },
        teamInfo: {
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
    },
    computed: {
        winner() {
            if (this.team1Score > this.team2Score) {
              return this.teamInfo.names[0] + " WINS!"
            } else if (this.team2Score > this.team1Score) {
              return this.teamInfo.names[1] + " WINS!"
            } else {
              return "IT'S A TIE!"
            }
        }
    }
}
</script>

<style scoped>
.background-monikers {
  background-image: url('../assets/seamlessbg-03.svg');
  background-repeat: repeat;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.animation-two {
  background-image: url('../assets/monikers_furry_one-01.svg');
  background-repeat: no-repeat;
  background-size: 100%;
  height: 600px;
  position: absolute;
  bottom: -600px;
  width: 100%;
  animation: person 10s infinite;
}

.animation-one {
  background-image: url('../assets/furry-one-noBG-02.svg');
  background-repeat: no-repeat;
  background-size: 100%;
  height: 600px;
  width: 100%;
  position: absolute;
  bottom: -600px;
  animation: furry 10s infinite;
}

.win-headline {
  text-align: center;
  font-size: 4rem;
  margin: 0;
}

.win-headline-two {
  text-align: center;
  font-size: 2.5rem;
  margin: 0;
  color: #555;
}

.start-newgame-button {
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

.finish-transition {
  width: 85%;
  margin: 40px auto 25px auto;
  background-color: #FFF;
  background-size: 75%;
  border-radius: 15px;
  padding: 40px 20px 40px 20px;
  -webkit-box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  -moz-box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
}

@keyframes furry {
  0%   {
    bottom: -600px;
  }
  25%  {
    bottom: -350px;
  }

  50%  {
    bottom: -600px;
  }
  100% {
    bottom: -600px;
  }
}

@keyframes person {
  0%   {
    bottom: -600px;
  }
 

  50%  {
    bottom: -600px;
  }
  75%  {
    bottom: -350px;
  }
  100% {
    bottom: -600px;
  }
}

@media (min-width: 410px) {
  .finish-transition {
    width: 80%;
    padding: 40px 30px 40px 30px;
  }

  .start-newgame-button {
    height: 45px;
  }
}

@media (min-width: 620px) {

  .finish-transition {
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


</style>