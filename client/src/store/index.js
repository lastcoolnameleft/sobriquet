import Vue from 'vue'
import Vuex from 'vuex'
import GameModule from './modules/game'
//var game = require('./modules/game');
var personal = require('./modules/personal');

//import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

var store = new Vuex.Store({
    modules: {
        game: GameModule,
        personal
    },
    strict: debug,
//    plugins: debug ? [createLogger()] : []
})

export default store