<template lang='pug'>
  main#app
    router-view

</template>

<script>
export default {
  name: 'App',
  beforeCreate () {
    try {
      let input = document.createElement('input')
      input.type = 'time'
      if (input.type === 'time') {
        localStorage.setItem('HtmlInputTimeIsSupported', 'true')
      } else {
        localStorage.setItem('HtmlInputTimeIsSupported', 'false')
      }
    } catch (e) {
      localStorage.setItem('HtmlInputTimeIsSupported', 'false')
    }
  }
}
</script>

<style lang='sass'>

  @import './styles/sass/reset.sass'
  @import './styles/sass/global.sass'

</style>
