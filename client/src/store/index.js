import Vue from 'vue'
import Vuex from 'vuex'
import { auth } from './modules/auth'
import { events } from './modules/events'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    calendarPopup: false
  },
  mutations: {
    popupIsOpen (state) {
      state.calendarPopup = true
    },
    popupIsClose (state) {
      state.calendarPopup = false
    }
  },
  actions: {
    makeCalendarPopupIsOpened ({ commit }) {
      commit('popupIsOpen')
    },
    makeCalendarPopupIsClosed ({ commit }) {
      commit('popupIsClose')
    }
  },
  modules: {
    auth: auth,
    events: events
  }
})
