<template>
      <div class="wrapper">
        <img class="logo" src="../assets/Monikers_logo_lockup-02.svg" alt="Monikers logo" />
        <h2 class="game-setup-headline">Create Game</h2>
          <h3 class="label-name">Team One (Your Team)</h3>
          <input v-model='team1Name'
            autoComplete="off"
            class="input-field"
            type="text"
            name="teamOne"
            value="Team 1"
          />
          <h3 class="label-name">Team Two</h3>
          <input v-model='team2Name'
            autoComplete="off"
            class="input-field"
            type="text"
            name="teamTwo"
            value="Team 2"
          />
          <h3 class="label-name">Number of Cards</h3>
          <input v-model='numCards'
            class="input-field"
            type="number"
            min="2"
            max="10"
            value="5"
            name="numCards"
          />
          <h3 class="label-name">Your Nickname</h3>
          <input v-model='nicknameCreate'
            class="input-field"
            type="text"
            name="nickname"
            value="tommy"
          />
          <button v-on:click="clickedCreateGame" class="start-button" >CREATE GAME</button>
        <h2 class="game-setup-headline">Join Game</h2>
          <h3 class="label-name">Game Code</h3>
          <input v-model='roomName'
            class="input-field"
            type="text"
            name="roomName"
            value=""
          />
          <h3 class="label-name">Your Nickname</h3>
          <input v-model='nicknameJoin'
            class="input-field"
            type="text"
            name="nickname"
            value="tommy"
          />
          <button v-on:click="clickedJoinGame" class="start-button" >JOIN GAME</button>
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
    },
    data() {
      return {
        nicknameJoin: 'tommy2',
        nicknameCreate: 'tommy',
        roomName: '',
        team1Name: 'Team 1',
        team2Name: 'Team 2',
        numCards: 5,
      }
    },
    methods: {
        ...mapActions([ 'createGame' ]),
        // To start the game, shuffle the full deck of cards, pick random ones and then set aside which cards are "Selected"
        // The Selected cards are now "In Play".
        clickedJoinGame() {
          console.log('GameWaiting.joinGame()')
          this.eventBus.$emit('set-nickname', this.nicknameJoin)
          this.$socket.emit('joinGame', this.roomName, this.nicknameJoin);
        },
        clickedCreateGame() {
          console.log('GameWaiting.createGame()')
          this.eventBus.$emit('set-nickname', this.nicknameCreate)
          this.createGame({ 
              team1Name: this.team1Name,
              team2Name: this.team2Name,
              numCards: this.numCards,
              nickname: this.nicknameCreate })
          console.log(this.getState)
          this.$socket.emit("createGame", this.getState);
        },
    },
    computed: {
      ...mapGetters([ 'getState' ]),
    },
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