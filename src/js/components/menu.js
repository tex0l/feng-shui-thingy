'use strict'

export default {
  props: ['options'],
  methods: {
    handleClick (option) {
      this.$emit('click', option)
    }
  },
  template: `
<div class="menu">
    <div class="menu-item" v-for="option in options" @click="handleClick(option)">{{option}}</div>
</div>`
}
