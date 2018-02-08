<template lang='pug'>
  form.event(v-on:submit.prevent='onSubmit')
    label.panel__form-label
      span
        | Название:
      input.panel__form-input(name='event-name', ref='eventName' type='text', placeholder='Введите название', required)

    label.panel__form-label
      span
        | Время начала:
      input.panel__form-input(name='event-start', ref='eventStart', :type="timeSupport ? 'time' : 'text'", placeholder='11:10', required)

    label.panel__form-label
      span
        | Время окончания:
      input.panel__form-input(name='event-end', ref='eventEnd', :type="timeSupport ? 'time' : 'text'", placeholder='15:50', required)

    button.panel__form-submit(type='submit')
      | Войти

</template>

<script>
import axios from 'axios'

export default {
  name: 'addEvent',
  data () {
    return {
      postBody: {
        username: null,
        event: {
          title: null,
          start: null,
          duration: null
        }
      },
      dayStart: 8 * 60 // 8 hours * 60 minutes
    }
  },
  computed: {
    timeSupport: function () {
      if (localStorage.getItem('HtmlInputTimeIsSupported') === 'true') {
        return true
      } else {
        return false
      }
    },
    currentUser: function () {
      return localStorage.getItem('currentUser')
    }
  },
  methods: {
    onSubmit () {
      this.postBody.username = this.currentUser
      this.postBody.event.start = this.getEventStartInMinutes(this.$refs.eventStart.value)
      this.postBody.event.duration = this.getEventDuration(this.$refs.eventStart.value, this.$refs.eventEnd.value)
      this.postBody.event.title = this.$refs.eventName.value
      if (this.postBody.event.duration > 0) {
        axios.post(`http://localhost:8081/event`, this.postBody)
          .then(response => {
            this.$store.dispatch('updateEventsMap', response.data)
          })
          .catch(e => {
            console.error(e)
          })
      }
    },
    getEventDuration (start, end) {
      let a = start.split(':')
      let b = end.split(':')
      let startMinutes = (+a[0]) * 60 + (+a[1]) - this.dayStart
      let endMinutes = (+b[0]) * 60 + (+b[1]) - this.dayStart
      return endMinutes - startMinutes
    },
    getEventStartInMinutes (start) {
      let array = start.split(':')
      return (+array[0]) * 60 + (+array[1]) - this.dayStart
    }
  }
}
</script>

<style lang='sass' scoped>

</style>
