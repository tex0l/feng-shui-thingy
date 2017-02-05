'use strict'
/* global Image, Path2D */
import eventBus from './eventBus'

export default {
  mounted () {
    this.drawImage()
    this.$refs.overlay.addEventListener('dragover', event => {
      this.dragX = event.clientX
      this.dragY = event.clientY
    })
    eventBus.$on('load-image', image => {
      this.plan = image
      this.loadedPlan = null
      this.redraw()
    })
  },
  props: ['width', 'height'],
  data () {
    return {
      plan: './resources/plan.gif',
      loadedPlan: null,
      points: [],
      gravityCenter: false
    }
  },
  methods: {
    async loadImage () {
      if (this.loadedPlan) return this.loadedPlan
      else {
        const image = new Image()
        image.src = this.plan
        return await new Promise(resolve => {
          image.onload = () => {
            this.loadedPlan = image
            resolve(this.loadedPlan)
          }
        })
      }
    },
    async drawImage () {
      const image = await this.loadImage()
      const context = this.$refs.canvas.getContext('2d')
      const imageRatio = image.height ? image.width / image.height : null
      const ownRatio = this.height ? this.width / this.height : null
      if (!imageRatio) throw new Error('Given image has no height')
      if (!ownRatio) throw new Error('Given canvas size has no height')
      const ratio = imageRatio / ownRatio
      if (ratio < 1) context.drawImage(image, (1 - ratio) * this.width / 2, 0, this.width * ratio, this.height)
      else context.drawImage(image, 0, (1 - 1 / ratio) * this.height / 2, this.width, this.height / ratio)
    },
    drawPoint ({x, y}) {
      const context2D = this.$refs.canvas.getContext('2d')

      context2D.beginPath()
      context2D.moveTo(x, y - 5)
      context2D.lineTo(x, y + 5)
      context2D.moveTo(x - 5, y)
      context2D.lineTo(x + 5, y)
      context2D.stroke()
    },
    drawPath () {
      if (this.points.length) {
        const context2D = this.$refs.canvas.getContext('2d')
        const {x: initialX, y: initialY} = this.points[0]
        context2D.fillStyle = 'rgba(43, 159, 223, 0.5)'
        const path = new Path2D()
        path.moveTo(initialX, initialY)

        for (let i = 0; i < this.points.length; i++) {
          const {x, y} = this.points[(i + 1) % this.points.length]
          path.lineTo(x, y)
        }
        path.closePath()
        context2D.stroke(path)
        context2D.fill(path)
      }
    },
    async redraw () {
      const context2D = this.$refs.canvas.getContext('2d')
      context2D.clearRect(0, 0, this.width, this.height)
      await this.drawImage()
      this.drawPath()
      this.calculateGravityCenter()
    },
    async handleClick (event) {
      this.points.push(this.calculateClickCoordinates(event))
      await this.redraw()
    },
    async handleClickOnPlus (index) {
      if (!this.dragging) {
        this.points.splice(index, 1)
        await this.redraw()
      }
    },
    async handleDrag (index, event) {
      this.dragging = true
      event.preventDefault()
      const {x, y} = this.calculateClickCoordinates({clientX: this.dragX, clientY: this.dragY}, true)
      this.points[index].x = x
      this.points[index].y = y
      await this.redraw()
    },
    calculateClickCoordinates (event) {
      let parent = this.$refs.overlay
      let offsetLeft = 0
      let offsetTop = 0
      while (parent) {
        offsetTop += parent.offsetTop
        offsetLeft += parent.offsetLeft
        parent = parent.offsetParent
      }
      const {clientX, clientY} = event
      return {x: clientX - offsetLeft, y: clientY - offsetTop}
    },
    calculateGravityCenter () {
      if (this.points.length > 2) {
        let xG = 0
        let yG = 0
        let S = 0
        for (let i = 0; i < this.points.length; i++) {
          const P0 = this.points[i]
          const P1 = this.points[(i + 1) % this.points.length]
          const factor = (P0.x * P1.y) - (P1.x * P0.y)
          xG = xG + ((P0.x + P1.x) / 6) * factor
          yG = yG + ((P0.y + P1.y) / 6) * factor
          S = S + factor
        }
        S = S / 2
        xG = xG / S
        yG = yG / S
        this.gravityCenter = {x: xG, y: yG}
      } else this.gravityCenter = false
    }
  },
  template: `<div class="bagua-canvas-container">
    <canvas ref="canvas"
            :width="width"
            :height="height">
    </canvas>
    <div ref="overlay" class="overlay" @click="handleClick($event)">
        <img v-for="(point, index) in points" 
             src="./resources/plus.svg" 
             :style="{left: point.x + 'px', top: point.y + 'px'}" 
             @drag="handleDrag(index, $event)"
             @dragend="dragging = false; redraw()"
             @click.stop.prevent="handleClickOnPlus(index)"/>
        <img v-if="gravityCenter" src="./resources/plus.svg"
             :style="{left: gravityCenter.x + 'px', top: gravityCenter.y + 'px'}"/>
    </div>
</div>`
}