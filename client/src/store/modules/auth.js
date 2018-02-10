function checkUserIsAuthorized () {
  if (localStorage.getItem('userIsAuthorized') === 'true') {
    return true
  } else {
    return false
  }
}

export const auth = {
  state: {
    userIsAuthorized: checkUserIsAuthorized()
  },
  mutations: {
    authorize (state) {
      state.userIsAuthorized = true
    },
    unauthorize (state) {
      state.userIsAuthorized = false
    }
  },
  actions: {
    makeUserAuthorized ({ commit }) {
      commit('authorize')
    },
    makeUserUnauthorized ({ commit }) {
      commit('unauthorize')
    }
  }
}
