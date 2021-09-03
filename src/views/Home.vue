<template lang="pug">
.view
  .header
    h1 Image Focal Point Preview
    .actions
      ul.action-list
        li.action-item
          a.button(href="#") Fork on Github
        li.action-item
          button.icon(@click="toggleGrid")
            .icon
            .label Toggle Grid
        li.action-item
          button.icon(@click="toggleDarkUI" :class={'on' : darkMode})
            .icon
            .label Toggle Dark Mode


  .canvas
    .controls
      p This little tool will help you find the focal point of your image. Use these coordinates to set your background position in your CSS.

      ul.options
        li
          .input-container
            label Select an Image
            span.description This image is not uploaded or stored anywhere, and is read from your computer's local storage
            input(type="text" v-model="filename")
        li
          .input-container
            label Postion X
            span.description Start by guessing the hozional coordinate, then adjust. Percentages work best, but you can try px, em, vh, or wm units.
            input(type="text"
              v-model="posX"
              @keyup.exact.up="increment(1, 'x')"
              @keyup.exact.down="increment(-1, 'x')"
              @keyup.exact.shift.up="increment(10, 'x')"
              @keyup.exact.shift.down="increment(-10, 'x')"
          )
        li
          .input-container
            label Postion Y
            input(type="text"
              v-model="posY"
              @keyup.exact.up="increment(1, 'y')"
              @keyup.exact.down="increment(-1, 'y')"
              @keyup.exact.shift.up="increment(10, 'y')"
              @keyup.exact.shift.down="increment(-10, 'y')"
            )
        li
          .input-container
            label Background Size
            span.description Set the CSS background-size
            input(type="text" v-model="backgroundSize")

    .preview(ref="preview" @mousemove="resize($event)" @mouseup="endResize($event)")
      .image-container(ref="imageContainer")
        .image(:style="{backgroundImage: `${url}`, backgroundPosition: `${posX} ${posY}`, backgroundSize: `${backgroundSize}` }")
        .guidelines(:style="posVars")
          .coordinate-x
            .line
          .coordinate-y
            .line
        .resize-controls
          .bottom-right.control(ref="bottomRight" @mousedown="startResize($event)")


</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'

const image = ref()
const filename = ref('' || 'card.png')
const posX = ref('' || '50%')
const posY = ref('' || '50%')
const backgroundSize = ref('' || 'cover')

const preview = ref()
const imageContainer = ref()
const bottomRight = ref()

const url = computed(() => {
    if (filename.value) return `url("/images/${filename.value}")`
})

const posVars = computed(() => {
    return {
        '--pos-X': posX.value,
        '--pos-Y': posY.value,
    }
})

const increment = (i:number, coordinate: string) => {
    let unit = ''
    let value = 0

    const captureUnit = (source: string) => {
        if (source.includes('%')) {
            unit = '%'
            value = Number(source.replace('%', ''))
        }

        if (source.includes('px')) {
            unit = 'px'
            value = Number(source.replace('px', ''))
        }

        if (source.includes('em')) {
            unit = 'em'
            value = Number(source.replace('em', ''))
        }

        if (source.includes('vh')) {
            unit = 'vh'
            value = Number(source.replace('vh', ''))
        }

        if (source.includes('vw')) {
            unit = 'vw'
            value = Number(source.replace('vw', ''))
        }
    }

    if (coordinate === 'x') {
        captureUnit(posX.value)
        value = value + i
        posX.value = value + unit
    }

    if (coordinate === 'y') {
        captureUnit(posY.value)
        value = value + i
        posY.value = value + unit
    }
}

let resizeActive = false

const resize = (event:any) => {
  if (resizeActive) {
    console.log('hello')
    let pageX = event.pageX
    let pageY = event.pageY

    let imageContainerWidth = imageContainer.value.getBoundingClientRect().left
    let imageContainerHeight = imageContainer.value.getBoundingClientRect().top

    imageContainer.value.style.width = pageX - imageContainerWidth + 'px'
    imageContainer.value.style.height = pageY - imageContainerHeight + 'px'

    console.log('pageY', pageY)
    console.log('pageX', pageX)

    console.log('size', imageContainer.value.getBoundingClientRect())
    console.log('imageContainerHeight', imageContainerHeight)
  }
}


const endResize = (event:any) => {
  event.preventDefault()
  resizeActive = false
}

const startResize = (event:any) => {
  event.preventDefault()
  resizeActive = true
}

</script>

<style scoped lang="scss">
.view {
    height: 100vh;
    line-height: line-height('small');
    overflow: auto;
    display: flex;
    flex-direction: column;
}

button, a {
  @include button-reset;
  @include font('primary', 'small', 'medium');
  line-height: 1;
  text-decoration: none;
}

.header {
    background: color('white');
    box-shadow: 0 1px 1px color('gray-900', 0.1);
    padding: space(1);
    z-index: 1;
    position: sticky;
    top: 1;

    h1 {
        @include font('primary', 'small', 'medium');
        color: color('gray-800');
        padding: space(0.5);
        text-align: center;
    }

    .action-list {
      display: flex;
      margin: space(-1);
    }

    /* button {
      background: color()
    } */
}

.canvas {
    display: flex;
    align-items: flex-start;
    flex-grow: 1;
    min-height: 0;
    min-width: 0;
    height: 100%;
    overflow: hidden;
}

.controls {
    width: clamp(180px, 20%, 240px);
    height: 100%;
    flex-shrink: 0;
    background-color: color('gray-100');
    box-shadow: 1px 0 0 color('gray-900', 0.1);
    padding: space(2);
    overflow: auto;
    /* display: none; */

    p {
        @include font('primary', 'x-small', 'light');
        color: color('gray-600');
        padding: space(1);
    }
}

.options {
    margin: 0 space(-1.5);
    padding: space(0.5);

    li {
        padding: space(1.5);
    }
}

.input-container {
    display: flex;
    flex-wrap: wrap;

    label {
        @include font('primary', 'small', 'semi-bold');
        color: color('gray-800');
        padding: space(0.5);
    }

    .description {
        @include font('primary', 'x-small', 'light');
        color: color('gray-600');
        padding: space(0.5);
    }

    input {
        @include input-reset;
        @include font('primary', 'x-small', 'regular');
        color: color('gray-800');
        margin: space(1) space(0.5);
        padding: space(1) space(1.5);
        background-color: color('white');
        border-radius: radius('small');
        box-shadow: 0 0 0px 0.5px color('gray-900', 0.2),
            0 3px 3px -2px color('gray-900', 0.2);
        @include transition;
        width: 100%;

        &::placeholder {
            @include font('primary', 'x-small', 'regular');
            color: color('gray-500');
        }

        &:focus {
            box-shadow: 0 0 0px 0.5px color('gray-900', 0.2),
                0 3px 2px -2px color('gray-900', 0.2),
                0 0 16px color('blue', 0.25), 0 0 2px 1px color('aqua');
        }
    }
}

.preview {
    flex-grow: 1;
    flex-shrink: 1;
    padding: space(3);
    height: 100%;
    display: grid;
    place-items: center;
    min-height: 0;
    min-width: 0;

}

.image-container {
    height: 100%;
    width: 100%;
    min-height: 100px;
    min-width: 100px;
    max-height: 100%;
    max-width: 100%;
    position: relative;
    border-radius: radius('medium');
    background-color: color('gray-100');
    box-shadow: 0 4px 8px color('gray-900', 0.3);

    &:hover {
      .resize-controls {
        box-shadow: inset 0 0 0 2px color('aqua');
      }
      .control {
        transform: translate3d(-50%, -50%, 0) scale(1);
        margin: space(-.5);
      }

      .coordinate-x .line {
        opacity: 1;
      }

    }
}

.image {
    @include bg();
    position: absolute;
    @include coordinates;
    pointer-events: none;
    border-radius: inherit;
}

.guidelines {
    --pos-X: 50%;
    --pos-Y: 50%;

    position: absolute;
    @include coordinates;
    pointer-events: none;
    overflow: hidden;
    mix-blend-mode: hard-light;

    .coordinate-x,
    .coordinate-y {
        position: absolute;
        @include coordinates;
    }

    .line {
        position: absolute;
        background-color: color('aqua');
        /* opacity: .5; */
        box-shadow: 0 0 0 1px color('white', .5), 0 0 0 2px color('black', .4);
        @include transition;
    }

    .coordinate-x {
        transform: translateX(var(--pos-X));
        .line {
            top: 0;
            left: 0;
            bottom: 0;
            width: 2px;
            transform: translateX(-50%);
        }
    }

    .coordinate-y {
        transform: translateY(var(--pos-Y));
        .line {
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            transform: translateY(-50%);
        }
    }
}

.resize-controls {
    position: absolute;
    @include coordinates;
    border-radius: inherit;
    box-shadow: inset 0 0 0 0px color('aqua');
    @include transition;

    .control {
        @include circle(space(2));
        background-color: color('white');
        box-shadow: inset 0 0 0 2px color('aqua');
        transform: translate3d(-50%, -50%, 0) scale(.8);
        position: absolute;
        @include transition;
    }

    .bottom-right {
        top: 100%;
        left: 100%;
        /* margin: -2px; */
    }
}
</style>
