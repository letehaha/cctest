<template lang='pug'>
  section
    .calendar
      .calendar__intro
        .container.calendar__intro-wrapper
          h1.calendar__title
            | Calendar

          .calendar__profile
            .calendar__user
              | Привет, {{ currentUser }} !

            button.calendar__logout(type='button', @click='logout')
              | Выйти

      .container
        .calendar__area
          .calendar__datetable
            .calendar__datetime(
              v-for='(timeStamp, index) in timeStamps')
              time.calendar__datetime-value(v-bind:class="{'calendar__datetime-value--small': isOdd(index)}")
                | {{ timeStamp }}

          .calendar__events
            .calendar__events-item(
              v-for='(event, index) in mutatedEvents',
              v-bind:style="{ top: event.start + 'px', height: event.duration + 'px' }"
            )
              template(v-if="mutatedEvents[index].left === '1'")
                .calendar__events-item-background(v-bind:style="{ left: '0', width: '50%' }")
                  .calendar__events-item-title {{ event.title }}

              template(v-else-if="mutatedEvents[index].left === '2'")
                .calendar__events-item-background(v-bind:style="{ width: '50%', marginLeft: '100px' }")
                  .calendar__events-item-title {{ event.title }}

              template(v-else)
                .calendar__events-item-background
                  .calendar__events-item-title {{ event.title }}

</template>

<script>
import axios from 'axios'
export default {
  name: 'calendar',
  data () {
    return {
      events: [],
      mutatedEvents: [],
      timeStamps: [],
      relative_value: 48 / 30,
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
    if (!this.$store.state.auth.userIsAuthorized) {
      this.$router.push('/login')
    }
  },
  mounted () {
    this.createTimeStamps()
  },
  computed: {
    fullTime: function () {
      return (this.interval.am.end - this.interval.am.start + this.interval.pm.end) * 60
    },
    currentUser: function () {
      return localStorage.getItem('currentUser')
    },
    besideElements: function () {
      let eventsMap = []
      for (var i = 0; i < this.fullTime; i++) {
        let events = this.events.filter(el => el.start <= i && el.start + el.duration - 1 >= i)
        if (events.length > 1) {
          for (var j = 0; j < events.length; j++) {
            let elEvent = eventsMap.find(el => el.id === events[j].id)
            if (!elEvent || elEvent.width > 1 / events.length) {
              eventsMap = eventsMap.filter(el => el.id !== events[j].id)
              eventsMap.push({ id: events[j].id, order: j, width: 1 / events.length })
            }
          }
        }
      }
      return eventsMap
    }
  },
  created () {
    axios.get(`http://localhost:8081/calendar`)
      .then(response => {
        this.events = response.data
        this.events.map((item, index) => {
          this.mutatedEvents.push({
            'id': item.id,
            'start': item.start * this.relative_value,
            'duration': item.duration * this.relative_value,
            'title': item.title,
            'left': item.left
          })
        })
      })
      .catch(e => {
        this.errors.push(e)
      })
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
      this.$store.commit('unauthorize')
      this.$store.commit('clearUser')
      localStorage.removeItem('userIsAuthorized')
      localStorage.removeItem('currentUser')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang='sass'>

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
    z-index: 1

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

</style>
