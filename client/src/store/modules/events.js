export const events = {
  state: {
    events: [],
    mutatedEvents: [],
    besideElements: [],
    relative_value: 48 / 30, // 1.6 px === 1 min
    eventToRemove: null
  },
  mutations: {
    makeEmpty (state) {
      state.events = []
      state.mutatedEvents = []
      state.besideElements = []
    },
    updateEventToRemove (state, value) {
      state.eventToRemove = value
    },
    updateEvents (state, newValue) {
      state.events = newValue
    },
    updateMutated (state) {
      state.events.map((item, index) => {
        state.mutatedEvents.push({
          'id': item._id,
          'start': item.start * state.relative_value,
          'duration': item.duration * state.relative_value,
          'title': item.title
        })
      })
    },
    updateBeside (state, newValue) {
      state.besideElements = newValue
    }
  },
  actions: {
    postEventToRemove ({ commit }, id) {
      commit('updateEventToRemove', id)
    },
    updateEventsMap (context, newMap) {
      context.commit('makeEmpty')
      context.commit('updateEvents', newMap)
      context.commit('updateMutated')
      let eventsMap = []
      for (let i = 0; i < 540; i++) {
        let events = context.state.mutatedEvents.filter(el => el.start <= i && el.start + el.duration - 1 >= i)
        if (events.length > 0) {
          for (let j = 0; j < events.length; j++) {
            let elEvent = eventsMap.find(el => el.id === events[j].id)
            if (!elEvent || elEvent.width > 1 / events.length) {
              eventsMap = eventsMap.filter(el => el.id !== events[j].id)
              eventsMap.push({ id: events[j].id, width: 1 / events.length, position: j })
            }
          }
        }
      }
      for (let i = 0; i < context.state.mutatedEvents.length; i++) {
        for (let j = 0; j < eventsMap.length; j++) {
          if (context.state.mutatedEvents[i].id === eventsMap[j].id) {
            eventsMap[j].title = context.state.mutatedEvents[i].title
            eventsMap[j].start = context.state.mutatedEvents[i].start
            eventsMap[j].duration = context.state.mutatedEvents[i].duration
          }
        }
      }
      context.commit('updateBeside', eventsMap)
    }
  }
}
