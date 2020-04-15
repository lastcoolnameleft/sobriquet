<template>
    <div>
        <GameWaiting v-show="isGameWaiting" :eventBus="eventBus"></GameWaiting>
        <Lobby v-show="isGameCreated" :eventBus="eventBus" :isHost="isHost"></Lobby>
        <RoundWaiting v-show="isRoundWaiting" :nickname="nickname" :eventBus="eventBus"></RoundWaiting>
        <RoundComplete v-show="isRoundComplete" :nickname="nickname" :eventBus="eventBus"></RoundComplete>
        <GameComplete v-show="isGameComplete" :eventBus="eventBus"></GameComplete>
        <ClueGiver v-show="shouldGameDetailsBeVisible" :eventBus="eventBus" :nickname="nickname"></ClueGiver>
    </div>
</template>

<script>
var eventBus = new Vue()
import Vue from 'vue'
import ClueGiver from './ClueGiver'
import GameWaiting from './GameWaiting'
import RoundWaiting from './RoundWaiting'
import RoundComplete from './RoundComplete'
import GameComplete from './GameComplete'
import Lobby from './Lobby'
import { mapGetters, mapMutations } from 'vuex';

export default {
    components: { ClueGiver, GameWaiting, RoundWaiting, RoundComplete, GameComplete, Lobby },
    sockets: {
        connect: function () {
            console.log('APP:socket connected')
        },
        gameCreated: function(roomName) {
            this.updateRoom({roomName })
        },
        gameData: function(data) {
            console.log('APP:game data')
            console.log(data)
            this.$store.replaceState(data)
        },
        customEmit: function () {
            console.log('APP:this method was fired by the socket server. eg: io.emit("customEmit", data)')
        },
        reconnect: function () {
            console.log('APP:socket RECONNECTED')
        },

    },
    data() {
        return {
            eventBus,
            nickname: '',
        }
    },
    methods: {
        ...mapMutations([ 'createGame', 'updateRoom' ]),
        // To start the game, shuffle the full deck of cards, pick random ones and then set aside which cards are "Selected"
        // The Selected cards are now "In Play".
        startGame() {
            console.log('startGame()')
            this.$socket.emit('startGame', this.roomName);
        },
        joinGame(roomName, nickname) {
            console.log('joinGame()')
            this.nickname = nickname
            this.$socket.emit('joinGame', roomName, nickname);
        },
    },
    computed: {
        ...mapGetters([
            'isGameStarted', 'isGameWaiting', 'isGameWaiting', 'isRoundWaiting', 'isTurnWaiting', 'isRoundComplete', 'isGameComplete', 'isGameCreated', 'shouldGameDetailsBeVisible', 'host'
        ]),
        isHost() {
            return this.$store.state.host == this.nickname
        },
    },

    // These functions mostly route messages from the global event bus to the local functions
    mounted() {
        this.eventBus.$on('set-nickname', nickname => (
            this.nickname = nickname
        )),
        this.eventBus.$on('join-game', (roomName, nickname) => (
            this.joinGame(roomName, nickname)
        ))
    }
}
</script>