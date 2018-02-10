import Vue from 'vue'
import Vuex from 'vuex'
import { auth } from './modules/auth'
import { events } from './modules/events'
import { calendarPopup } from './modules/calendarPopup'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  modules: {
    auth: auth,
    events: events,
    calendarPopup: calendarPopup
  }
})
