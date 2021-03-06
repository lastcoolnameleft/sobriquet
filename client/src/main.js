import Vue from 'vue'
import Vuex from 'vuex'
import Game from './components/Game.vue'
import store from './store/game'
import VueSocketIO from 'vue-socket.io'
import SocketIO from "socket.io-client"

Vue.config.productionTip = false

Vue.use(Vuex)

Vue.use(new VueSocketIO({
  debug: false,
  connection: SocketIO(process.env.VUE_APP_SOCKET_URL),
}))

new Vue({
  store,
  render: h => h(Game),
}).$mount('#app')

/*
import Vue from 'vue'
import VueRouter from 'vue-router'
import Game from './components/Game'
import Home from './components/Home'
import Instructions from './components/Instructions'


const router = new VueRouter({
    routes: [
        { path: '/', component: Home, props: true },
        { path: '/game', component: Game, props: true, name: 'game'},
        { path: '/instructions', component: Instructions, name: 'instructions', props: true},
    ]
  })
  

new Vue({
    router,
}).$mount('#app')
*/