<template>
    <div class="background-wrapper">
      <div class="instructions">
        <h2 class="headline">GETTING STARTED</h2>
        <p class="body-text">
          Monikers only takes about 5-10 minutes to learn. Start by dividing
          your group into 2 teams.
        </p>
        <p class="body-text">
          Choose the number of cards for your deck. For lower amounts of players
          (4-6) choose around 40 cards. For larger groups (6+) select around 60
          cards.
        </p>
        <p class="body-text last-paragraph ">
          Next, create your team names and hit START GAME. The team that is
          prompted will be the first team to go.
        </p>
        <h2 class="subtitle ">HOW TO PLAY</h2>
        <p class="body-text">
          A person from the starting team has 60 seconds to get their team to
          guess as many names as possible from the deck by giving clues about
          the person’s identity, (If you’re playing with more than 10 people,
          30—45 seconds is probably better) There’s no limit to the number of
          guesses. Skipping is allowed and highly encouraged in all rounds.
        </p>
        <p class="body-text">
          Teams take turns giving clues, Each player should take a turn giving
          clues before any teammates repeat. Go in clockwise order or feel free
          to use some other system.
        </p>
        <p class="body-text last-paragraph">
          A round ends when all cards from the deck have been guessed correctly.
          The team with the lowest score begins the next round.
        </p>
        <h2 class="subtitle">RULES FOR EACH ROUND</h2>
        <p class="body-text">
          Monikers has 3 rounds. Each has a restriction on how players are
          allowed to give clues:
        </p>
        <p class="body-text">
          ROUND 1 You can use any words, sounds, or gestures except the name
          itself, including the clue text on the card, If you say any part of
          the name, you have to skip that card this turn.
        </p>
        <p class="body-text">
          ROUND 2 Use only one word, which can be anything except the name
          itself, You can repeat that word as many times as you like, but no
          sounds or gestures.
        </p>
        <p class="body-text last-paragraph">
          ROUND 3 Just charades. No words. Sound effects are OK.
        </p>
        <h2 class="subtitle">ENDING THE GAME</h2>
        <p class="body-text">
          The team with the highest total score after 3 rounds wins. But feel
          free not to keep score at all. It’s fun to play competitively, but not
          necessary with the right group.
        </p>
        <p>
          Monikers is available for free under a Creative Commons BY-NC-SA 4.0
          license.
        </p>
        <router-link to="/">
            <button class="back-button" >
            BACK
            </button>
        </router-link>

      </div>
    </div>

</template>
<script>
import Home from './Home'
const routes = [
  { path: '/', component: Home },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes // short for `routes: routes`
})


export default {
    router
}
</script>
<style scoped>
.instructions {
  width:85%;
  padding: 10px 35px 40px 35px;
  background-color: #FFF;
  border-radius: 15px;
  margin: 25px auto;
}

.background-wrapper {
  background-image: url('../assets/seamlessbg-03.svg');
  background-repeat: repeat;
  width: 100%;
  height: 100%;
  background-size: 75%;
}

.headline {
  color:#00B4EF;
  text-align: center;
  margin: 40px auto 25px auto;
}

.subtitle {
  color: #00B4EF;
  font-size: 1.2rem;
  margin: 0 0 10px 0;
  text-align: center;

}

.body-text {
  color: #555;
  margin: 0 0 10px 0;
  font-weight: 300;
  line-height: 1.4rem;
  font-size: 0.9rem;
}

.last-paragraph {
 margin-bottom: 30px;
}

.dashed-line-instructions {
  border-bottom: 2px dotted #555;
  width: 40%;
  margin: 0 auto 30px auto;
}

.back-button {
  width: 100%;
  height: 40px;
  color: #FFF;
  background-color: rgba(134, 106, 173, 1);
  border: 1px solid #FFF;
  border-radius: 5px;
  font-size: 1rem;
  margin-top: 15px;
  -webkit-box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  -moz-box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  
}

@media (min-width: 375px) {
  .body-text {
    font-size: 1rem;
    line-height: 1.5rem;
  }
}

@media (min-width: 620px) {
  
  .instructions {
    width: 600px;
    padding: 15px 40px 40px;
    background-color: #FFF;
    border-radius: 15px;
    margin: 25px auto;
  }
}

</style>