function checkUserIsAuthorized () {
  if (localStorage.getItem('userIsAuthorized') === 'true') {
    return true
  } else {
    return false
  }
}

export const auth = {
  state: {
    userIsAuthorized: checkUserIsAuthorized(),
    user: ''
  },
  mutations: {
    authorize (state) {
      state.userIsAuthorized = true
    },
    unauthorize (state) {
      state.userIsAuthorized = false
    },
    saveUser (state, user) {
      state.user = user
    },
    clearUser (state) {
      state.user = ''
    }
  }
}
