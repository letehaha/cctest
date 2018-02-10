<template lang='pug'>
  form.event.event--column(v-on:submit.prevent='onSubmit')
    label.event__label
      span.event__label-text
        | Название:

      input.event__input(name='event-name',
                        ref='eventName' type='text',
                        placeholder='Введите название',
                        required)

    label.event__label
      span.event__label-text
        | Время начала:

      input.event__input(name='event-start',
                        ref='eventStart',
                        :type="timeSupport ? 'time' : 'text'",
                        placeholder='11:10',
                        required,
                        v-bind:class="{ 'invalid': !inputsIsValid.start }")

    label.event__label
      span.event__label-text
        | Время окончания:

      input.event__input(name='event-end',
                        ref='eventEnd',
                        :type="timeSupport ? 'time' : 'text'",
                        placeholder='15:50',
                        required,
                        v-bind:class="{ 'invalid': !inputsIsValid.end }")

    button.event__submit(type='submit')
      | Добавить

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
        alert('Время начала события должно быть позже 8 утра и раньше 5 вечера ')
        return false
      } else {
        this.inputsIsValid.start = true
      }
      if (this.getEventInMinutes(this.$refs.eventEnd.value) <= this.dayStart ||
          this.getEventInMinutes(this.$refs.eventEnd.value) >= this.dayEnd) {
        this.inputsIsValid.end = false
        alert('Время начала события должно быть позже 8 утра и раньше 5 вечера ')
        return false
      } else {
        this.inputsIsValid.end = true
      }
      this.postBody.username = this.currentUser
      this.postBody.event.start = this.getEventInMinutes(this.$refs.eventStart.value) - this.dayStart
      this.postBody.event.duration = this.getEventDuration(this.$refs.eventStart.value, this.$refs.eventEnd.value)
      this.postBody.event.title = this.$refs.eventName.value
      if (this.postBody.event.duration > 0) {
        axios.post(`http://localhost:8081/event/add`, this.postBody)
          .then(response => {
            this.$store.dispatch('updateEventsMap', response.data)
          })
          .catch(e => {
            console.error(e)
          })
      } else {
        alert('Время старта позже время окончания события!')
      }
      this.$store.dispatch('makeCalendarPopupIsClosed')
      event.target.reset()
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

  .event--column
    display: inline-flex
    flex-direction: column
    align-items: center

  .event__label
    &:not(:last-child)
      margin-bottom: 16px

  .event__label-text
    display: block
    margin-bottom: 8px

  .event__input
    width: 270px
    padding: 8px 16px

    &.invalid
      border-color: red

  .event__submit
    @extend %button
    @extend %button--shadow
    box-sizing: content-box

</style>
