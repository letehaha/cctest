<template lang='pug'>
  section
    .calendar
      .calendar__intro
        .container.calendar__intro-wrapper
          h1.calendar__title
            | Календарь

          .calendar__profile
            .calendar__user
              | Привет, {{ currentUser }} !

            button.calendar__logout(type='button', @click='logout')
              | Выйти

      .container
        .calendar__actions
          .calendar__action
            button.calendar__action-btn.calendar__action-btn-add(type='button', @click='openAddEventPopup') Добавить

          .calendar__action
            button.calendar__action-btn.calendar__action-btn-export(type='button', @click='exportCalendar') Экспортировать

        .calendar__area
          .calendar__datetable
            .calendar__datetime(
              v-for='(timeStamp, index) in timeStamps')
              time.calendar__datetime-value(v-bind:class="{ 'calendar__datetime-value--small': isOdd(index) }")
                | {{ timeStamp }}

          .calendar__events
            .calendar__events-item(
              v-for='(event, index) in eventsMap',
              v-bind:style=`{
                top: event.start + 'px',
                height: event.duration + 'px',
                left: event.width * event.position * 100 + '%',
                width: event.width * 100 + '%'
              }`,
              :data-title='event.title',
              @click='removeEvent()'
            )
              .calendar__events-item-background
                .calendar__events-item-title {{ event.title }}

    .popup(v-bind:class="{ 'is-open': popupState }")
      .popup__overlay(@click='closePopup')
      .popup__content
        template(v-if='popups.add')
          add-event-popup
        template(v-else-if='popups.remove')
          remove-event-popup(:event-id="removeEventId")
        template(v-else-if='popups.export')
          .calendar__export-data
            textarea.calendar__export-data-field(ref='exportCalendarField')
            .calendar__export-data-btns
              button.calendar__export-data-btn(type='button', @click='copyCalendarData')
                | Скопировать

</template>

<script>
import axios from 'axios'
import addEventPopup from './AddEvent'
import removeEventPopup from './RemoveEvent'

export default {
  name: 'calendar',
  components: { addEventPopup, removeEventPopup },
  data () {
    return {
      timeStamps: [],
      removeEventId: null,
      interval: {
        am: {
          start: 8,
          end: 12
        },
        pm: {
          start: 1,
          end: 5
        }
      }
    }
  },
  beforeCreate () {
    if (!this.$store.state.auth.userIsAuthorized) this.$router.push('/login')
  },
  mounted () {
    axios.post(`http://localhost:8081/calendar`, { username: this.currentUser })
      .then(response => {
        this.$store.dispatch('updateEventsMap', response.data)
      })
      .catch(e => {
        console.error(e)
      })
    this.createTimeStamps()
  },
  computed: {
    popupState: function () { return this.$store.state.calendarPopup.calendarPopup },
    fullTime: function () {
      return (this.interval.am.end - this.interval.am.start + this.interval.pm.end) * 60
    },
    currentUser: function () { return localStorage.getItem('currentUser') },
    eventsMap: function () { return this.$store.state.events.besideElements },
    popups: function () { return this.$store.state.calendarPopup.popups }
  },
  methods: {
    createTimeStamps () {
      for (let i = this.interval.am.start; i <= this.interval.am.end; i++) {
        this.timeStamps.push(i + ':00')
        this.timeStamps.push(i + ':30')
      }
      for (let i = this.interval.pm.start; i <= this.interval.pm.end; i++) {
        this.timeStamps.push(i + ':00')
        if (i !== this.interval.pm.end) {
          this.timeStamps.push(i + ':30')
        }
      }
    },
    isOdd (value) {
      return value % 2 !== 0
    },
    logout () {
      this.$store.dispatch('makeUserUnauthorized')
      localStorage.removeItem('userIsAuthorized')
      localStorage.removeItem('currentUser')
      this.$router.push('/login')
    },
    removeEvent () {
      let target = event.target

      this.openPopup()
      this.$store.dispatch('updateRemoveEventPopupState', true)
      while (true) {
        if (target.classList.contains('calendar__events-item')) {
          for (let i = 0; i < target.parentNode.children.length; i++) {
            if (target === target.parentNode.children[i]) {
              this.$store.dispatch('postEventToRemove', this.eventsMap[i].id)
            }
          }
          return false
        }
        target = target.parentNode
      }
    },
    openAddEventPopup () {
      this.openPopup()
      this.$store.dispatch('updateAddEventPopupState', true)
    },
    exportCalendar () {
      this.openPopup()
      this.$store.dispatch('updateExportCalendarPopupState', true)
      axios.post(`http://localhost:8081/calendar/export`, { username: this.currentUser })
        .then(response => {
          this.$refs.exportCalendarField.value = JSON.stringify(response.data)
        })
        .catch(e => {
          console.error(e)
        })
    },
    copyCalendarData () {
      this.$refs.exportCalendarField.select()
      document.execCommand('Copy')
    },
    openPopup () {
      this.$store.dispatch('makeCalendarPopupIsOpened')
    },
    closePopup () {
      this.$store.dispatch('makeCalendarPopupIsClosed')
    }
  }
}
</script>

<style lang='sass'>
  .popup
    @extend %popup
    display: none

    &.is-open
      display: flex

  .popup__content
    @extend %popup__content

  .popup__overlay
    @extend %popup__overlay

  .calendar__intro
    padding: 20px 0
    box-shadow: 0 0 40px 4px rgba(0, 0, 0, .2)

  .calendar__intro-wrapper
    display: flex
    justify-content: space-between

  .calendar__logout
    background-color: tranparent
    border: none
    text-decoration: underline
    margin-top: 10px
    margin-left: auto
    display: block

  .calendar__actions
    margin-top: 20px
    display: flex

  .calendar__action
    &:not(:last-child)
      margin-right: 15px

  .calendar__action-btn,
  .calendar__export-data-btn
    @extend %button
    @extend %button--shadow
    padding: 4px 8px

  .calendar__export-data-btns
    margin-top: 24px
    display: flex
    justify-content: flex-end

  .calendar__area
    display: flex
    margin-top: 40px

  .calendar__datetable
    display: flex
    flex-direction: column

  .calendar__datetime
    height: 48px

    &:nth-child(odd)
      position: relative

      &:after
        content: ''
        position: absolute
        left: 0
        top: 0
        height: 1px
        background-color: #cecece
        width: calc(100% + 215px)

  .calendar__datetime-value
    font-size: 16px
    +OpenSansLight

  .calendar__datetime-value--small
    font-size: 12px

  .calendar__events
    position: relative
    width: 200px
    margin-left: 15px

  .calendar__events-item
    position: absolute
    width: 100%
    z-index: 0
    cursor: pointer

    &:hover
      &:after,
      &:before
        opacity: 1
        visibility: visible

    &:after
      content: attr(data-title)
      position: absolute
      z-index: 1
      background-color: #6e9ecf
      border-radius: 3px
      color: #fff
      bottom: calc(100% + 10px)
      left: 60%
      font-size: 12px
      padding: 4px 8px
      width: 120px
      opacity: 0
      visibility: hidden
      transition: opacity .2s ease-out

    &:before
      content: ''
      position: absolute
      z-index: 1
      width: 12px
      height: 12px
      border-radius: 2px
      transform: rotate(45deg)
      background-color: #6e9ecf
      left: 70%
      bottom: calc(100% + 5px)
      opacity: 0
      visibility: hidden
      transition: opacity .2s ease-out

  .calendar__events-item-background
    background-color: #e2ecf5
    border-left: 2px solid #6e9ecf
    display: block
    height: 100%

  .calendar__events-item-title
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis

  .calendar__events-item--small
    width: 50%

  .calendar__export-data-field
    padding: 8px
    resize: none
    width: 400px
    height: 300px

</style>
