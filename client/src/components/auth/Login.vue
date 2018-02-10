<template lang='pug'>
  section.flex-center
    .container.flex-center
      .panel
        .panel__title
          h1
            | Вход в Календарь
          span или
          router-link.panel__link(to='/signup')
            | создать аккаунт

        form.panel__form(v-on:submit.prevent='onSubmit')
          label.panel__form-label
            span
              | Логин:
            input.panel__form-input(name='name', ref='name' type='text', placeholder='Введите ваше имя', required)

          label.panel__form-label
            span
              | Пароль:
            input.panel__form-input(name='password', ref='password' type='password', placeholder='Введите ваш пароль', required)

          button.panel__form-submit(type='submit')
            | Войти

</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data () {
    return {
      events: null,
      loginInformation: {
        name: '',
        password: ''
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
      this.loginInformation.name = this.$refs.name.value
      this.loginInformation.password = this.$refs.password.value
      axios.get(`http://localhost:8081/user/get`)
        .then(response => {
          if (!this.userExists(response.data, this.loginInformation.name)) {
            alert('Такого пользователя не существует!')
            return false
          }
          for (let i = 0; i < response.data.length; i++) {
            if (this.loginInformation.name === response.data[i].name && this.loginInformation.password === response.data[i].password) {
              this.$store.dispatch('makeUserAuthorized')
              localStorage.setItem('userIsAuthorized', 'true')
              localStorage.setItem('currentUser', this.loginInformation.name)
              this.$router.push('/')
            }
          }
        })
        .catch(e => {
          console.error(e)
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
    padding: 8px 16px
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
