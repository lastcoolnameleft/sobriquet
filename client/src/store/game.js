import Vue from 'vue'
import Vuex from 'vuex'
var _ = require('lodash');
var fullCardList = require('../clue-list.json');

//import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

var store = new Vuex.Store({
  state: {
      roomName: '',
      host: '',
      
      teamNames: ['', ''],
      // zero-indexed, so really Team 0 and Team 1, but we should display it as Team 1 and Team 2
      teamMembers: [ [], [] ],
      
      gameState: 'waiting',
      roundState: 'waiting',
      turnState: 'waiting',
      
      // 0 = round 1, 1 = round 2, 2 = round 3.  Because that's how zero-indexing works.
      activeRoundIndex: 0,
      activePlayerIndex: 0,
      activeTeamIndex: 0,
      activeCardIndex: -1,
      
      maxSelectedCards: 5,
      cardListSelected: [], // cards selected at the beginning of the game
      cardListInPlay: [], // starts with same list as clueListSelected, but call pop() each time clue-giver draws cards
      // 2 teams, 3 rounds, keep the index of each card that the team scores
      // Looks like this:  scoredCardIndex[teamInfo.currentTeamIndex][roundInfo.currentRoundIndex][List of card indexes successfully scored]
      scoredCardIndex: [[ [], [], [], ], [ [], [], [], ]] ,
      
      roundNames: ['Round One', 'Round Two', 'Round Three'],
      roundDescriptions: [
          'Describe the name using any words, sounds, or gestures except the name itself',
          'Describe the name using only one word, which can be anything except the name itself',
          'Describe the name using just charades. No words. Sound effects are OK'
      ],
    },
    actions: {
        startRound(context) {
            context.commit('resetCardListInPlay')
            context.commit('setRoundState', 'started')
            context.commit('startTurn')
            context.commit('drawCard')
        },
        // Score points for that team (TBD) and draw a new card
        // Add the index of the card to the "scoredCardIndex"
        cardSuccess({ commit, getters} ) {
            console.log('cardSuccess()')
            commit('scoreActiveCard')
            if (getters.numberOfCardsLeftInPlay > 0) {
                console.log('going to call drawCard')
                commit('drawCard')
            } else {
                console.log('going to call endRound')
                commit('endRound')
            }
          },
        // Clue-giver gives up.  Put card on bottom of deck and draw a new one
        // The rules say the card is lost for this round, but keeping logic simple for now and adding to bottom of deck
        cardPass({commit, state}) {
            console.log('cardPass()')
            commit('moveActiveCardToBottom')
            commit.drawCard()
            console.log('cardPass: ' + state.cardListInPlay)
        },
          endRound(state) {
            //console.log('endRound()')
            state.roundState = 'complete'
            state.turnState = 'complete'
            state.activeRoundIndex += 1
            //if (this.gameData.rounds.activeRoundIndex > 2) {
    ////                this.endGame()
            //}
          },    
    },
    mutations: {
      createGame(state, payload) {
        state.teamNames = [payload.team1Name, payload.team2Name]
        state.maxSelectedCards = payload.numCards
        state.gameState = 'created'
        state.host = payload.nickname
        state.teamMembers[0].push(payload.nickname)
      },
      updateRoom(state, payload) {
        state.roomName = payload.roomName   
      },
      startGame(state) {
        // In the real game, players get 8 cards and pick which 5 they want.  Randomly picking for now.
        var randomCards = _.slice(_.shuffle(Array(state.maxSelectedCards).fill().map((_, i) => i)), 0, fullCardList.length - 1)
        state.cardListSelected = randomCards
        state.gameState = 'started'
      },
      moveActiveCardToBottom(state) {
        state.cardListInPlay.unshift(state.activeCardIndex)
      },
      resetCardListInPlay(state) {
        state.cardListInPlay = [...state.cardListSelected]
      },
      setRoundState(state, value) {
          console.log('setRoundState::value=' + value)
          state.roundState = value
      },
      setGameState(state, value) {
          console.log('setGameState::value=' + value)
          state.gameState = value
      },
      setTurnState(state, value) {
          console.log('setTurnState::value=' + value)
          state.turnState = value
      },
      /*
      startRound(state) {
        console.log('startRound()')
        state.cardListInPlay = [...state.cardListSelected]
        state.roundState = 'started'
        //this.startTurn()
      },
      */
      startTurn(state) {
        console.log('startTurn()')
        state.turnState = 'started'
        //this.drawCard()
      },
      // Take the first card off the top of the In Play cards.
      drawCard(state) {
        console.log('drawCard()')
        state.activeCardIndex = state.cardListInPlay.pop()
      },
      // Score points for that team (TBD) and draw a new card
      // Add the index of the card to the "scoredCardIndex"
      scoreActiveCard(state) {
        state.scoredCardIndex[state.activeTeamIndex][state.activeRoundIndex].push(state.activeCardIndex)
      }, 
      /*
      cardSuccess(state) {
        console.log('cardSuccess()')
        state.scoredCardIndex[state.activeTeamIndex][state.activeRoundIndex].push(state.activeCardIndex)
        if (state.numberOfCardsLeftInPlay > 0) {
            this.drawCard()
        } else {
            this.endRound()
        }
      },
      */
      // Clue-giver gives up.  Put card on bottom of deck and draw a new one
      // The rules say the card is lost for this round, but keeping logic simple for now and adding to bottom of deck
      cardPass(state) {
          console.log('cardPass()')
          state.cardListInPlay.unshift(state.activeCardIndex)
          this.drawCard()
          console.log('cardPass: ' + state.cardListInPlay)
      },
      // TODO:  Write a test for this.  
      nextPlayer(state) {
        state.activePlayerIndex++
        if (state.activePlayerIndex >= state.teamMembers[state.activeTeamIndex].length ) {
            state.activePlayerIndex = 0
        }
      },
      endRound(state) {
        //console.log('endRound()')
        state.roundState = 'complete'
        state.turnState = 'complete'
        state.activeRoundIndex += 1
        //if (this.gameData.rounds.activeRoundIndex > 2) {
////                this.endGame()
        //}
      },
    },
    getters: {
      host: state => {
          return state.host
      },
      roomName: state => {
          return state.roomName
      },
      activePlayerName(state) {
        return state.teamMembers[state.activeTeamIndex][state.activePlayerIndex]
      },
      isGameStarted: state => {
          return state.gameState === 'started'
      },
      isGameWaiting: state => {
          return state.gameState === 'waiting'
      },
      isRoundWaiting: state => {
          return state.gameState === 'started' && state.roundState === 'waiting'
      },
      isRoundStarted: state => {
          return state.gameState === 'started' && state.roundState === 'started'
      },
      isTurnWaiting: state => {
          return state.gameState === 'started' && state.roundState === 'started' && state.turnState === 'waiting'
      },
      isRoundComplete: state => {
          return state.gameState === 'started' && state.roundState === 'complete'
      },
      isGameComplete: state => {
          return state.gameState === 'complete'
      },
      isGameCreated: state => {
          return state.gameState === 'created'
      },
      shouldGameDetailsBeVisible: state => {
          return state.gameState === 'started' && state.roundState === 'started' && state.turnState === 'started'
      },
      numberOfCardsLeftInPlay: state => {
          return state.cardListInPlay.length
      },
      // To calculate the score, sum all of the points for each card scored for a single round.  And then add up all 3 rounds
      team1Score: state => {
          var team1round1 =  _.reduce(state.scoredCardIndex[0][0], function(sum, n) { return sum + fullCardList[n].points }, 0)
          var team1round2 =  _.reduce(state.scoredCardIndex[0][1], function(sum, n) { return sum + fullCardList[n].points }, 0)
          var team1round3 =  _.reduce(state.scoredCardIndex[0][2], function(sum, n) { return sum + fullCardList[n].points }, 0)
          return team1round1 + team1round2 + team1round3
      },
      team2Score: state => {
          var team2round1 =  _.reduce(state.scoredCardIndex[1][0], function(sum, n) { return sum + fullCardList[n].points }, 0)
          var team2round2 =  _.reduce(state.scoredCardIndex[1][1], function(sum, n) { return sum + fullCardList[n].points }, 0)
          var team2round3 =  _.reduce(state.scoredCardIndex[1][2], function(sum, n) { return sum + fullCardList[n].points }, 0)
          return team2round1 + team2round2 + team2round3
      },
      activeRoundName: state => {
          return state.roundNames[state.activeRoundIndex]
      },
      activeRoundDescription: state => {
          return state.roundDescriptions[state.activeRoundIndex]
      },
      activeTeamName: state => {
          return state.teamNames[state.activeTeamIndex]
      },
      activeTeamMembers: state => {
          return state.teamMembers[state.activeTeamIndex]
      },
      emptyCard: () => {
          return { name: '', description: '', category: '', points: 0 }
      },
      activeCard: (state, getters) => {
          return state.activeCardIndex >= 0 ? fullCardList[state.activeCardIndex] : getters.emptyCard
      },
      team1Name: state => {
          return state.teamNames[0]
      },
      team2Name: state => {
          return state.teamNames[1]
      },
      team1Members: state => {
          return state.teamMembers[0]
      },
      team2Members: state => {
          return state.teamMembers[1]
      },
      getState: state => {
          return state
      }
    },
    strict: debug,
//    plugins: debug ? [createLogger()] : []
})

export default store