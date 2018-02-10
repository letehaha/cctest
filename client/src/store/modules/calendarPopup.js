export const calendarPopup = {
  state: {
    calendarPopup: false,
    popups: {
      add: false,
      remove: false
    }
  },
  mutations: {
    popupIsOpen (state) {
      state.calendarPopup = true
    },
    popupIsClose (state) {
      state.calendarPopup = false
    },
    updateAddEventPopupState (state, boolean) {
      state.popups.add = boolean
    },
    updateRemoveEventPopupState (state, boolean) {
      state.popups.remove = boolean
    }
  },
  actions: {
    makeCalendarPopupIsOpened ({ commit }) {
      commit('popupIsOpen')
    },
    makeCalendarPopupIsClosed ({ commit }) {
      commit('popupIsClose')
      commit('updateAddEventPopupState', false)
      commit('updateRemoveEventPopupState', false)
    },
    updateAddEventPopupState ({ commit }, boolean) {
      commit('updateAddEventPopupState', boolean)
    },
    updateRemoveEventPopupState ({ commit }, boolean) {
      commit('updateRemoveEventPopupState', boolean)
    }
  }
}
