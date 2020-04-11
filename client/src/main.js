import Vue from 'vue'
import Game from './components/Game.vue'

Vue.config.productionTip = false

new Vue({
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