<template>
      <div class="wrapper">
        <img class="logo" src="../assets/Monikers_logo_lockup-02.svg" alt="Monikers logo" />
        <h2 class="game-setup-headline">Welcome to the Lobby</h2>
        <h2 class="game-setup-headline">Tell your friends to join with the code: <b>{{ $store.state.roomName}}</b></h2>
        <h3 class="label-name">{{ team1Name }} Members:</h3>
          <ul id="team1-members">
            <li v-for="member in team1Members" :key="member">
              {{ member}}
            </li>
          </ul>
        <h3 class="label-name">{{ team2Name }} Members:</h3>
          <ul id="team2-members">
            <li v-for="member in team2Members" :key="member">
              {{ member}}
            </li>
          </ul>
       <button v-show="isHost" v-on:click="clickedStartGame" class="start-button" >START GAME</button>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'Lobby',
    props: {
        eventBus: {
            type: Object,
            required: true
        },
        isHost: {
            type: Boolean,
            required: true
        },
    },
    computed: {
      ...mapGetters([
          'roomName', 'team1Members', 'team2Members', 'team1Name', 'team2Name', 'getState'
      ]),
    },
    methods: {
        // To start the game, shuffle the full deck of cards, pick random ones and then set aside which cards are "Selected"
        // The Selected cards are now "In Play".
        clickedStartGame() {
          //this.startGame()
          this.$socket.emit("startGame", this.roomName)
        },
    }
}
</script>

<style scoped>
.label-name {
  color: #fff;
  margin: 10px auto 5px auto;
  font-weight: 400;
  font-size: 1rem;
}

.wrapper {
  width: 75%;
  margin: auto;
  padding: 30px 0;
}

.input-field {
  width: 100%;
  margin: auto;
  height: 40px;
  font-size: 1rem;
  color: #555;
  border-radius: 5px;
  border: 1px solid #FFF;
  background-color: #fff;
}

input::placeholder {
  font-size: 1rem;
  text-indent: 10px;
}

input {
  outline: none;
  -webkit-appearance: none;
  text-indent: 10px;
}

.start-button {
  width: 100%;
  height: 40px;
  color: #FFF;
  background-color: rgba(76, 189, 159, 1);
  border: 1px solid #FFF;
  border-radius: 5px;
  font-size: 1rem;
  margin-top: 30px;
  -webkit-box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  -moz-box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  
}

.back-button {
  width: 100%;
  height: 40px;
  color: #FFF;
  background-color: rgba(134, 106, 173, 1);
  border: 1px solid #FFF;
  border-radius: 5px;
  font-size: 1rem;
  margin-top: 10px;
  -webkit-box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  -moz-box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  
}

.logo {
  width: 80%;
  margin: 0 auto 20px auto;
  display: block;
}

.game-setup-headline {
  color: #FFF;
  text-align: center;
  margin: 20px;
}

@media (min-width: 360px) {
  .logo {
    margin: 30px auto 30px auto;
  }

  .label-name {
    margin: 20px auto 5px auto;
  }

  .start-button {
    margin-top: 40px;    
  }
}

@media (min-width: 414px) {
  .logo {
    margin: 40px auto 40px auto;
  }

  .input-field {
    height: 45px;
  }
  
  .start-button {
    height: 45px;
  }
  
  .back-button {
    height: 45px;
  }
}

@media (min-width: 620px) {
  .wrapper {
    width: 400px;
    margin: auto;
    padding: 30px 0;
  }


}
</style>