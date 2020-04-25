<template>
    <div>
        <Error v-if="errorData.type" :errorData="errorData"></Error>
        <TurnComplete v-else-if="isTurnComplete" :nickname="nickname" :eventBus="eventBus"></TurnComplete>
        <RoundWaiting v-else-if="isRoundWaiting" :nickname="nickname" :eventBus="eventBus"></RoundWaiting>
        <GameComplete v-else-if="isGameComplete" :eventBus="eventBus"></GameComplete>
        <RoundComplete v-else-if="isRoundComplete" :nickname="nickname" :eventBus="eventBus"></RoundComplete>
        <GameWaiting v-else-if="isGameWaiting" :eventBus="eventBus"></GameWaiting>
        <Lobby v-else-if="isGameCreated" :eventBus="eventBus" :isHost="isHost"></Lobby>
        <ClueGiver v-else-if="isTurnStarted" :eventBus="eventBus" :nickname="nickname"></ClueGiver>
    </div>
</template>

<script>
var eventBus = new Vue()
import Vue from 'vue'
import ClueGiver from './ClueGiver'
import GameWaiting from './GameWaiting'
import RoundWaiting from './RoundWaiting'
import GameComplete from './GameComplete'
import RoundComplete from './RoundComplete'
import TurnComplete from './TurnComplete'
import Lobby from './Lobby'
import Error from './Error'
import { mapGetters, mapActions } from 'vuex';

export default {
    components: { ClueGiver, GameWaiting, RoundWaiting, RoundComplete, GameComplete, TurnComplete, Lobby, Error },
    sockets: {
        connect: function (reason) {
            console.log('APP:socket connected::' + reason)
        },
        error: function (reason) {
            console.log('APP:socket error::' + reason)
        },
        disconnect: function (reason) {
            console.log('APP:socket disconnect::' + reason)
            this.errorData = { type: 'Disconnect', description: reason }
        },
        reconnect: function (reason) {
            console.log('APP:socket reconnect::' + reason)
        },
        reconnecting: function (reason) {
            console.log('APP:socket reconnecting::' + reason)
        },
        connecting: function (reason) {
            console.log('APP:socket connecting::' + reason)
        },
        gameData: function(data) {
            console.log('APP:game data')
            console.log(data)
            this.setStore(data)
        },
        customEmit: function () {
            console.log('APP:this method was fired by the socket server. eg: io.emit("customEmit", data)')
        },
    },
    data() {
        return {
            eventBus,
            nickname: '',
            errorData: {},
        }
    },
    methods: {
        ...mapActions([ 'updateRoom', 'setStore' ]),
        // To start the game, shuffle the full deck of cards, pick random ones and then set aside which cards are "Selected"
        // The Selected cards are now "In Play".
        startGame() {
            console.log('startGame()')
            this.$socket.emit('startGame', this.roomName);
        },
    },
    computed: {
        ...mapGetters([
            'isGameWaiting', 'isRoundWaiting', 'isRoundComplete', 'isGameComplete',
            'isGameCreated', 'isTurnStarted', 'host', 'isTurnComplete'
        ]),
        isHost() {
            return this.$store.state.host == this.nickname
        },
    },

    // These functions mostly route messages from the global event bus to the local functions
    mounted() {
        this.eventBus.$on('set-nickname', nickname => (
            this.nickname = nickname
        ))
    }
}
</script>