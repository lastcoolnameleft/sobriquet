var _ = require('lodash');
var fullClueList = require('./clue-list.json');

var eventBus = new Vue()

Vue.component('score', {
    props: {
        isGameStarted: {
            type: Boolean,
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
    },
    template: `
            <div >
                <div v-show="isGameStarted" class="score">
                    <p>Scores:</p>
                    <p><b>Team #1:</b> {{team1Score}}</p>
                    <p><b>Team #2:</b> {{team2Score}}</p>
                </div>
            </div>
        `
})

Vue.component('clue-giver', {
    props: {
        clueIndex: {
            type: Number,
            required: true
        },
        gameState: {
            type: String,
            required: true
        },
        roundState: {
            type: String,
            required: true
        },
    },
    computed: {
        clue() {
            console.log('clue()')
            return this.clueIndex >= 0 ? fullClueList[this.clueIndex] : { name: '', description: ''}
        },
        isGameStarted() {
            return this.gameState === 'started'
        },
        isRoundStarted() {
            console.log('roundStarted()')
            return this.roundState === 'started'
        },
    },
    template: `
        <div>
            <div v-show="isRoundStarted">
                <p>
                    Your clue is: <b>{{clue.name}}</b></b>
                </p>
                <p>
                    Description: {{clue.description}}
                </p>
                <p>
                    Points: {{clue.points}}
                </p>
                <p>
                    Category: {{clue.category}}
                </p>
                <button v-on:click="clueGiverSuccess">Success!</button> 
                <button v-on:click="clueGiverPass">Pass</button> 
            </div>
        </div>
    `,
    methods: {
        clueGiverSuccess() {
            eventBus.$emit('clue-giver-success', this.clueIndex)
        },
        clueGiverPass() {
            eventBus.$emit('clue-giver-pass', this.clueIndex)
        }
    }
})

var app = new Vue({
    template: `
        <div >
            <score :isGameStarted="isGameStarted" :team1Score="team1Score" :team2Score="team2Score"></score>
            <div v-show="isGameWaiting">
                <p>Welcome to an online webapp version of Monikers, a dumb party game that respects you intelligence.</p>
                <b>Rules:</b></br>
                
                <p>A person from the starting team has 60 seconds to get their team to guess as many names as possible from the deck by giving clues about the card's identity. There’s no limit to the number of guesses.</p>
            
                <p>Skipping is allowed and highly encouraged in all rounds.</p>
              
                <p>Teams keep the cards they guessed correctly for scoring. Skipped cards are reshuffled into the deck after each turn.</p>
               
                <p>Teams take turns giving clues. Each player should take a turn giving clues before any teammates repeat.</p>
                
                <p>A round ends when all cards from the deck have been guessed correctly. When that happens, teams add the point values from each card they correctly guessed.</p>
                
                <p>The team with the lowest score begins the next round.</p>

                <p>For any questions, check out the <a href='https://s3.amazonaws.com/www.monikersgame.com/Press+kit/Monikers+PnP.pdf'>complete rules</a>.</p>
                <button v-on:click="startGame">START GAME</button>
            </div>

            <div v-show="isRoundWaiting">
                <p>Monikers has 3 rounds. Each has a restriction on how players are allowed to give clues:</p>
                <p><b>ROUND 1:</b> You can use any words, sounds, or gestures except the name itself, including the clue text on the card. If you say any part of the name, you have to skip that card this turn.</p>
                <p><b>ROUND 2:</b> Use only one word, which can be anything except the name itself. You can repeat that word as many times as you like, but no sounds or gestures.</p>
                <p><b>ROUND 3:</b> Just charades. No words. Sound effects are OK.</p>
                <button v-on:click="startRound">START ROUND</button>
            </div>

            <div v-show="isRoundComplete">
                <p><b>Round {{roundIndex + 1}} complete.</b></p>

                <div v-show="roundIndex == 0">
                    <p>Rules for the next round:</p>
                    <p><b>ROUND 2:</b> Use only one word, which can be anything except the name itself. You can repeat that word as many times as you like, but no sounds or gestures.</p>
                    <button v-on:click="startRound">START ROUND</button>
                </div>
                <div v-show="roundIndex == 1">
                    <p>Rules for the next round:</p>
                    <p><b>ROUND 3:</b> Just charades. No words. Sound effects are OK.</p>
                    <button v-on:click="startRound">START ROUND</button>
                </div>
                <div v-show="roundIndex == 2">
                    <p>GAME OVER</p>
                </div>
            </div>

            <div v-show="shouldGameDetailsBeVisible">
                <b>You are the {{persona}}</b></br>
                <b># of Cards left: {{numberOfcardsLeftInPlay + 1}}</b>
                <clue-giver :clueIndex="currentClueIndex" :gameState="gameState" :roundState="roundState"></clue-giver>
            </div>
        </div>
    `,
    el: '#app',
    data: {
        persona: 'clue-giver',
        currentClueIndex: -1,
        maxSelectedCards: 5,
        fullClueList: fullClueList,
        clueListSelected: [],
        clueListInPlay: [],
        gameState: 'waiting',
        roundState: 'waiting',
        roundIndex: -1,
        teamIndex: 0, // zero-indexed, so really Team 0 and Team 1, but we should display it as Team 1 and Team 2
        scoredCardIndex: [[ [], [], [], ], [ [], [], [], ]] // 2 teams, 3 rounds, keep the index of each card that the team scores
    },
    methods: {
        // If we have 13 cards and want 5, Create an array of 0-12, shuffle it and then take the first 5 elements
        pickRandomCards(noToPick, noOfCards) {
            console.log('pickRandomCards()')
            return _.slice(_.shuffle(Array(noOfCards).fill().map((_, i) => i)), 0, noToPick)
        },
        // To start the game, shuffle the full deck of cards, pick random ones and then set aside which cards are "Selected"
        // The Selected cards are now "In Play".
        startGame() {
            console.log('startGame()')

            // In the real game, players get 8 cards and pick which 5 they want.  Randomly picking for now.
            this.clueListSelected = this.pickRandomCards(this.maxSelectedCards, fullClueList.length - 1)
            this.gameState = 'started'
            console.log('Game Started: ' + this.clueListInPlay)
        },
        // Take the first card from the selected list and show it to the clue-giver
        startRound() {
            console.log('startRound()')
            // Each time the round starts, we start over from the cards selected at the beginning
            this.clueListInPlay = [...this.clueListSelected]
            this.roundState = 'started'
            this.roundIndex += 1
            this.drawClue()
        },
        // Take the first card off the top of the In Play cards.
        drawClue() {
            console.log('drawClue()')
            this.currentClueIndex = this.clueListInPlay.pop()
        },
        // Score points for that team (TBD) and draw a new card
        clueSuccess() {
            console.log('clueSuccess()')
            this.scoredCardIndex[this.teamIndex][this.roundIndex].push(this.currentClueIndex)
            if (this.numberOfcardsLeftInPlay > 0) {
                this.drawClue()
            } else {
                this.roundState = 'complete'
            }
        },
        // Clue-giver gives up.  Put card on bottom of deck and draw a new one
        // The rules say the card is lost for this round, but keeping logic simple for now and adding to bottom of deck
        cluePass() {
            console.log('cluePass()')
            this.clueListInPlay.unshift(this.currentClueIndex)
            this.drawClue()
            console.log('cluePass: ' + this.clueListInPlay)
        },

    },
    computed: {
        numberOfcardsLeftInPlay() {
            return this.clueListInPlay.length
        },
        isGameStarted() {
            return this.gameState === 'started'
        },
        isGameWaiting() {
            return this.gameState === 'waiting'
        },
        isRoundWaiting() {
            return this.gameState === 'started' && this.roundState === 'waiting'
        },
        isRoundComplete() {
            return this.gameState === 'started' && this.roundState === 'complete'
        },
        shouldGameDetailsBeVisible() {
            return this.gameState === 'started' && this.roundState === 'started'
        },
        team1Score() {
            team1round1 =  _.reduce(this.scoredCardIndex[0][0], function(sum, n) { return sum + fullClueList[n].points }, 0)
            team1round2 =  _.reduce(this.scoredCardIndex[0][1], function(sum, n) { return sum + fullClueList[n].points }, 0)
            team1round3 =  _.reduce(this.scoredCardIndex[0][2], function(sum, n) { return sum + fullClueList[n].points }, 0)
            return team1round1 + team1round2 + team1round3
        },
        team2Score() {
            team2round1 =  _.reduce(this.scoredCardIndex[1][0], function(sum, n) { return sum + fullClueList[n].points }, 0)
            team2round2 =  _.reduce(this.scoredCardIndex[1][1], function(sum, n) { return sum + fullClueList[n].points }, 0)
            team2round3 =  _.reduce(this.scoredCardIndex[1][2], function(sum, n) { return sum + fullClueList[n].points }, 0)
            return team2round1 + team2round2 + team2round3
        },
    },
    mounted() {
        eventBus.$on('clue-giver-success', clueIndex => (
            this.clueSuccess()
        )),
        eventBus.$on('clue-giver-pass', clueIndex => (
            this.cluePass()
        ))
    }

})