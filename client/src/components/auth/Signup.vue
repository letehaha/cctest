<template lang='pug'>
  section.flex-center
    .container.flex-center
      .panel
        .panel__title
          h1
            | Создать аккаунт Календарь
          span или
          router-link.panel__link(to='/login')
            | войти в свой аккакунт

        form.panel__form(v-on:submit.prevent='onSubmit')
          label.panel__form-label
            span
              | Логин:
            input.panel__form-input(name='name', ref='name' type='text', placeholder='Введите ваше имя', autocomplete='off', required)

          label.panel__form-label
            span
              | Пароль:
            input.panel__form-input(name='password', ref='password' type='password', placeholder='Введите ваш пароль', autocomplete='off', required)

          button.panel__form-submit(type='submit')
            | Зарегистрироваться

</template>

<script>
import axios from 'axios'

export default {
  name: 'Signup',
  data () {
    return {
      postBody: {
        name: null,
        password: null
      }
    }
  },
  beforeCreate () {
    if (this.$store.state.auth.userIsAuthorized) {
      this.$router.push('/')
    }
  },
  methods: {
    onSubmit () {
      this.postBody.name = this.$refs.name.value
      this.postBody.password = this.$refs.password.value
      axios.get(`http://localhost:8081/users`)
        .then(response => {
          if (this.userExists(response.data, this.postBody.name)) {
            alert('Такой пользователь уже существует! Придумайте другой логин')
            return false
          }
          axios.post(`http://localhost:8081/user`, { body: this.postBody })
            .then(response => {
              this.$store.commit('authorize')
              this.$store.commit('saveUser', this.postBody.name)
              localStorage.setItem('userIsAuthorized', 'true')
              localStorage.setItem('currentUser', this.postBody.name)
              this.$router.push('/')
            })
            .catch(e => {
              this.errors.push(e)
            })
        })
        .catch(e => {
          this.errors.push(e)
        })
      event.target.reset()
    },
    userExists (arr, username) {
      return arr.some(function (el) {
        return el.name === username
      })
    }
  }
}
</script>

<style lang='sass' scoped>
  section
    height: 100vh

  .panel
    @extend %panel
    display: inline-block

  .panel__title
    margin: 0 32px 24px

    h1
      font-size: 24px
      margin-bottom: 8px

    span
      margin-right: 8px

  .panel__link
    text-decoration: underline
    color: #298fca
    font-size: 18px

    &:hover
      color: #0c3953

  .panel__form-label
    display: block

    span
      display: block
      margin-bottom: 8px

    &:not(:last-child)
      margin-bottom: 16px

  .panel__form-input
    padding: 8px 13px
    width: 100%

  .panel__form-submit
    background-color: #2ecc71
    transition: background-color .15s ease-out, box-shadow .2s ease-out
    color: #fff
    padding: 8px 16px
    border: none
    max-width: 210px
    display: block
    margin: 24px auto 0
    +OpenSansSemiBold

    &:hover
      box-shadow: 0 0 40px 4px rgba(0, 0, 0, .1)

    &:active
      background-color: #2cc26c
      box-shadow: none

</style>
