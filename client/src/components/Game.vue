<template>
    <div>
        <Error v-if="errorData.type" :errorData="errorData"></Error>
        <TurnComplete v-else-if="isTurnComplete" :eventBus="eventBus"></TurnComplete>
        <RoundWaiting v-else-if="isRoundWaiting" :eventBus="eventBus"></RoundWaiting>
        <GameComplete v-else-if="isGameComplete" :eventBus="eventBus"></GameComplete>
        <RoundComplete v-else-if="isRoundComplete" :eventBus="eventBus"></RoundComplete>
        <GameWaiting v-else-if="isGameWaiting" :eventBus="eventBus"></GameWaiting>
        <Lobby v-else-if="isGameCreated" :eventBus="eventBus"></Lobby>
        <TurnStarted v-else-if="isTurnStarted" :eventBus="eventBus"></TurnStarted>
    </div>
</template>

<script>
var eventBus = new Vue()
import Vue from 'vue'
import TurnStarted from './TurnStarted'
import GameWaiting from './GameWaiting'
import RoundWaiting from './RoundWaiting'
import GameComplete from './GameComplete'
import RoundComplete from './RoundComplete'
import TurnComplete from './TurnComplete'
import Lobby from './Lobby'
import Error from './Error'
import { mapGetters, mapActions } from 'vuex';

export default {
    components: { TurnStarted, GameWaiting, RoundWaiting, RoundComplete, GameComplete, TurnComplete, Lobby, Error },
    sockets: {
        connect: function (reason) {
            console.log('APP:socket connected::' + reason)
            console.log(this.$store.state)
            if (this.$store.state.roomName && this.$store.state.nickname) {
                console.log('APP:socket attempting to rejoin')
                this.$socket.emit('rejoinGame', this.$store.state.roomName, this.$store.state.nickname);
            }
        },
        error: function (reason) {
            console.log('APP:socket error::' + reason)
        },
        disconnect: function (reason) {
            console.log('APP:socket disconnect::' + reason)
            this.errorData = { type: 'Disconnect', reason }
        },
        reconnect: function (reason) {
            console.log('APP:socket reconnect::' + reason)
            //this.$socket.emit('reconnect');
            this.errorData = { type: 'Reconnect', reason }
        },
        reconnecting: function (reason) {
            console.log('APP:socket reconnecting::' + reason)
            //this.$socket.emit('reconnecting', this.roomName);
            this.errorData = { type: 'Reconnecting', reason }
        },
        connecting: function (reason) {
            console.log('APP:socket connecting::' + reason)
        },
        clientError: function (type, reason) {
            console.log(`APP:socket Client Error:: ${type} + ${reason}`)
            this.errorData = { type, reason }
        },
        gameData: function(data) {
            console.log('APP:game data')
            console.log(data)
            this.errorData = {}
            this.setStore(data)
        },
        customEmit: function () {
            console.log('APP:this method was fired by the socket server. eg: io.emit("customEmit", data)')
        },
    },
    data() {
        return {
            eventBus,
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
            'isGameCreated', 'isTurnStarted', 'host', 'isTurnComplete', 'isActivePlayer'
        ]),
    },
}
</script>