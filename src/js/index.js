'use strict'
/* global FileReader */
import { DOMContentLoaded } from './utils/events'
import Vue from 'vue'
import baguaCanvas from './components/bagua-canvas'
import customMenu from './components/menu'
import eventBus from './components/eventBus'

const main = async () => {
  await DOMContentLoaded
  return new Vue({
    mounted () {
      this.$refs.menu.$on('click', optionName => {
        const option = this.options.find(option => option.name === optionName)
        if (option) option.action()
      })
      this.$refs.fileInput.onchange = event => {
        const files = event.target.files
        if (files && files.length) {
          const fileReader = new FileReader()
          fileReader.onload = () => eventBus.$emit('load-image', fileReader.result)
          fileReader.readAsDataURL(files[0])
        }
      }
    },
    components: {
      baguaCanvas,
      customMenu
    },
    data () {
      return {
        options: [
          {
            name: 'Charger un plan',
            action: () => {
              this.$refs.fileInput.click()
            }
          },
          {
            name: 'Effacer les points',
            action: () => {}
          }
        ]
      }
    },
    el: '#bagua-application',
    template: `
<div class="feng-shui-app">
    <bagua-canvas width="800" height="600"></bagua-canvas>
    <custom-menu ref="menu" :options="options.map(option => option.name)"></custom-menu>
    <input ref="fileInput" type="file" style="display:none;" accept="image/*" /> 
</div>
    
    `
  })
}

main()
  .catch(console.error)
