var _ = require('lodash');
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
  

var app = new Vue({
    router,
}).$mount('#app')