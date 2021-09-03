<template lang="pug">
.view(:class="{'darkMode':darkMode}")
  .header
    h1 Image Focal Point Preview
    Actions(:showGrid="showGrid" :darkMode="darkMode" @toggleGrid="toggleGrid()" @toggleDarkModeUI="toggleDarkModeUI()")

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

      .attribution
        a.logo(href="https://zachforrester.me" target="_blank" rel="noopener noreferrer")
          Logo
        small Photo by #[a(href="https://unsplash.com/@jetlag?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank" rel="noopener noreferrer") David Troeger] on #[a(href="https://unsplash.com/s/photos/turtle?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank" rel="noopener noreferrer") Unsplash ]

        small Built by #[a(href="https://zachforrester.me" target="_blank" rel="noopener noreferrer") Zach Forrester]



    .preview(ref="preview" @mousemove="resize($event)" @mouseup="endResize($event)" :class="{'showGrid' : showGrid}")
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
import { ref, reactive, computed, onMounted } from 'vue'

import Actions from '../components/Actions.vue'
import Logo from '../components/Logo.vue'

components: {
    'Logo', 'Actions'
}

const image = ref()
const filename = ref('' || 'turtle.jpg')
const posX = ref('' || '44%')
const posY = ref('' || '63%')
const backgroundSize = ref('' || 'cover')

const preview = ref()
const imageContainer = ref()
const bottomRight = ref()

const showGrid = ref(true)
const darkMode = ref()

const url = computed(() => {
    if (!filename.value) return
    if (filename.value.includes('://')) return `url("${filename.value}")`
    return `url("/images/${filename.value}")`
})

const posVars = computed(() => {
    return {
        '--pos-X': posX.value,
        '--pos-Y': posY.value,
    }
})

const increment = (i: number, coordinate: string) => {
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

const resize = (event: any) => {
    if (resizeActive) {
        console.log('hello')
        let pageX = event.pageX
        let pageY = event.pageY

        let imageContainerWidth =
            imageContainer.value.getBoundingClientRect().left
        let imageContainerHeight =
            imageContainer.value.getBoundingClientRect().top

        imageContainer.value.style.width = pageX - imageContainerWidth + 'px'
        imageContainer.value.style.height = pageY - imageContainerHeight + 'px'

        console.log('pageY', pageY)
        console.log('pageX', pageX)

        console.log('size', imageContainer.value.getBoundingClientRect())
        console.log('imageContainerHeight', imageContainerHeight)
    }
}

const endResize = (event: any) => {
    event.preventDefault()
    resizeActive = false
}

const startResize = (event: any) => {
    event.preventDefault()
    resizeActive = true
}

const toggleGrid = () => {
    showGrid.value = !showGrid.value
    console.log('emitted toggle')
}

const toggleDarkModeUI = () => {
    darkMode.value = !darkMode.value
}

onMounted(() => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')

    if (prefersDarkScheme.matches) {
        darkMode.value = true
    }

    prefersDarkScheme.addEventListener('change', (e) => {
        const colorScheme = e.matches ? 'dark' : 'light'
        if (colorScheme === 'dark') return (darkMode.value = true)
    })
})
</script>

<style scoped lang="scss">
.view {
    height: 100vh;
    line-height: line-height('small');
    overflow: auto;
    display: flex;
    flex-direction: column;
}

.header {
    background: color('white');
    box-shadow: 0 1px 1px color('gray-900', 0.1);
    padding: space(0.75);
    z-index: 1;
    position: sticky;
    top: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    @include transition;

    @include dark {
        background: color('gray-800');
        box-shadow: 0 1px 1px color('gray-950', 0.5);
    }

    h1 {
        @include font('primary', 'small', 'medium');
        color: color('gray-800');
        padding: 0 space(1);
        margin-right: auto;
        @include transition;

        @include dark {
            color: color('gray-200');
        }

        @include mq(screen('medium')) {
            text-align: center;
            position: absolute;
            left: 0;
            right: 0;
        }
    }
}

.canvas {
    display: flex;
    align-items: flex-start;
    flex-grow: 1;
    min-height: 0;
    min-width: 0;
    height: 100%;
    overflow: hidden;
    background-color: color('gray-200');
    @include transition;

    @include dark {
        background-color: color('gray-900');
    }
}

.controls {
    width: clamp(180px, 20%, 240px);
    height: 100%;
    flex-shrink: 0;
    background-color: color('gray-100');
    box-shadow: 1px 0 0 color('gray-900', 0.1);
    padding: space(2);
    overflow: auto;
    @include transition;
    display: flex;
    flex-direction: column;

    @include dark {
        background-color: color('gray-700', 0.5);
        box-shadow: 1px 0 0 color('gray-950', 0.3);
    }

    p {
        @include font('primary', 'x-small', 'light');
        color: color('gray-600');
        padding: space(1);
        @include transition;

        @include dark {
            color: color('gray-500');
            font-weight: font-weight('regular');
        }
    }

    .attribution {
        margin-top: auto;
    }

    small {
        @include font('primary', 'x-small', 'regular');
        color: color('gray-600');
        padding: space(0.5);
        @include transition;
        display: block;

        @include dark {
            color: color('gray-500');
            font-weight: font-weight('regular');
        }

        a {
            text-decoration: none;
            color: darken(color('blue'), 10%);
            @include transition;

            &:hover {
                text-decoration: underline;
                color: color('blue');
            }
        }
    }

    .logo {
        width: 50%;
        display: block;
        transform-origin: bottom left;
        transform: scale(0.5);
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
        @include transition;

        @include dark {
            color: color('gray-200');
        }
    }

    .description {
        @include font('primary', 'x-small', 'light');
        color: color('gray-600');
        padding: space(0.5);
        @include transition;

        @include dark {
            color: color('gray-500');
            font-weight: font-weight('regular');
        }
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

        @include dark {
            color: color('gray-300');
            background-color: color('gray-700', 0.4);
            box-shadow: inset 0 1px 1px color('white', 0.1),
                inset 0 0 0 1px color('gray-500', 0.1),
                0 0 0px 0.5px color('gray-950', 0.5),
                0 3px 3px -2px color('gray-950', 0.3);

            &::selection {
                background-color: color('blue');
                color: color('white');
            }
        }

        &::placeholder {
            @include font('primary', 'x-small', 'regular');
            color: color('gray-500');

            @include dark {
                color: color('gray-400');
            }
        }

        &:focus {
            box-shadow: 0 0 0px 0.5px color('gray-900', 0.2),
                0 3px 2px -2px color('gray-900', 0.2),
                0 0 16px color('blue', 0.25), 0 0 2px 1px color('blue');
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
    max-width: 100%;
}

.image-container {
    height: 100%;
    width: 100%;
    min-height: 100px;
    min-width: 100px;
    max-height: 100%;
    position: relative;
    border-radius: radius('medium');
    background-color: color('gray-100');
    box-shadow: 0 8px 8px -4px color('gray-900', 0.3),
        0 16px 24px -8px color('gray-950', 0.3),
        0 4px 24px color('gray-950', 0.2);

    @include dark {
        background-color: color('gray-900');
        box-shadow: 0 8px 8px -4px color('gray-900', 0.3),
            0 16px 24px -8px color('gray-950', 0.3),
            0 4px 24px color('gray-950', 0.2);
    }

    &:hover {
        .resize-controls {
            box-shadow: inset 0 0 0 2px color('blue');
        }
        .control {
            transform: translate3d(-50%, -50%, 0) scale(1);
            margin: space(-0.5);
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
    overflow: hidden;
    mix-blend-mode: hard-light;
    @include transition();
    @include show('off');
    transform: scale(0);

    .showGrid & {
        @include show('on');
        pointer-events: none;
        transform: scale(1);
    }

    .coordinate-x,
    .coordinate-y {
        position: absolute;
        @include coordinates;
    }

    .line {
        position: absolute;
        background-color: color('blue');
        /* opacity: .5; */
        box-shadow: 0 0 0 1px color('white', 0.5), 0 0 0 2px color('black', 0.4);
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
    box-shadow: inset 0 0 0 0px color('blue');
    @include transition;

    .control {
        @include circle(space(2));
        background-color: color('white');
        box-shadow: inset 0 0 0 2px color('blue');
        transform: translate3d(-50%, -50%, 0) scale(0.8);
        position: absolute;
        @include transition;
        cursor: nwse-resize;
    }

    .bottom-right {
        top: 100%;
        left: 100%;
        /* margin: -2px; */
    }
}
</style>
