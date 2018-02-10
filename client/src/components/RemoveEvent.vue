<template lang='pug'>
  .remove-event
    .remove-event__title
      | Вы точно хотите удалить текущий эвент?

    .remove-event__btns
      .remove-event__btn.remove-event__btn-submit(@click='removeEvent')
        | Remove

      .remove-event__btn.remove-event__btn-cancel(@click='cancel')
        | Cancel

</template>

<script>
import axios from 'axios'

export default {
  name: 'removeEvent',
  data () {
    return {
      postBody: {
        username: null,
        removeId: null
      }
    }
  },
  props: ['event-id'],
  computed: {
    eventToRemove: function () {
      return this.$store.state.events.eventToRemove
    },
    currentUser: function () {
      return localStorage.getItem('currentUser')
    }
  },
  methods: {
    removeEvent () {
      this.postBody.username = this.currentUser
      this.postBody.removeId = this.eventToRemove
      axios.post(`http://localhost:8081/event/remove`, this.postBody)
        .then(response => {
          this.$store.dispatch('updateEventsMap', response.data)
          this.$store.dispatch('makeCalendarPopupIsClosed')
        })
        .catch(e => {
          console.error(e)
        })
    },
    cancel () {
      this.$store.dispatch('makeCalendarPopupIsClosed')
    }
  }
}
</script>

<style lang='sass' scoped>

  .remove-event__btns
    margin-top: 32px
    display: flex
    justify-content: space-around

  .remove-event__btn
    @extend %button
    @extend %button--shadow
    box-sizing: content-box

</style>
