<template lang='pug'>
  form.event(v-on:submit.prevent='onSubmit')
    label.panel__form-label
      span
        | Название:
      input.panel__form-input(name='event-name', ref='eventName' type='text', placeholder='Введите название', required)

    label.panel__form-label
      span
        | Время начала:
      input.panel__form-input(name='event-start',
                              ref='eventStart',
                              :type="timeSupport ? 'time' : 'text'",
                              placeholder='11:10',
                              required,
                              v-bind:class="{ 'invalid': !inputsIsValid.start }")

    label.panel__form-label
      span
        | Время окончания:
      input.panel__form-input(name='event-end',
                              ref='eventEnd',
                              :type="timeSupport ? 'time' : 'text'",
                              placeholder='15:50',
                              required,
                              v-bind:class="{ 'invalid': !inputsIsValid.end }")

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
      dayStart: 8 * 60, // 8 hours * 60 minutes
      dayEnd: 17 * 60,
      inputsIsValid: {
        start: true,
        end: true
      }
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
      if (this.getEventInMinutes(this.$refs.eventStart.value) <= this.dayStart ||
          this.getEventInMinutes(this.$refs.eventStart.value) >= this.dayEnd) {
        this.inputsIsValid.start = false
        return false
      } else {
        this.inputsIsValid.start = true
      }
      if (this.getEventInMinutes(this.$refs.eventEnd.value) <= this.dayStart ||
          this.getEventInMinutes(this.$refs.eventEnd.value) >= this.dayEnd) {
        this.inputsIsValid.end = false
        return false
      } else {
        this.inputsIsValid.end = true
      }
      this.postBody.username = this.currentUser
      this.postBody.event.start = this.getEventInMinutes(this.$refs.eventStart.value) - this.dayStart
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
      } else {
        console.log('Время старта позже время окончания события!')
      }
    },
    getEventDuration (start, end) {
      let startMinutes = this.getEventInMinutes(start) - this.dayStart
      let endMinutes = this.getEventInMinutes(end) - this.dayStart
      return endMinutes - startMinutes
    },
    getEventInMinutes (value) {
      let array = value.split(':')
      return (+array[0]) * 60 + (+array[1])
    }
  }
}
</script>

<style lang='sass' scoped>

  .panel__form-input
    &.invalid
      border-color: red

</style>
