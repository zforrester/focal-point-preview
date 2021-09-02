<template lang="pug">
.view
  .header
    h1 Image Focal Point Preview
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
            span.description Start by guessing the hozional coordinate, then adjust
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

    .image-container
      .image(:style="{backgroundImage: `${url}`, backgroundPosition: `${posX} ${posY}` }")
      .guidelines(:style="posVars")
        .coordinate-x
          .line
        .coordinate-y
          .line


</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'

const image = ref()
const filename = ref('' || 'card.png')
const posX = ref('' || '50%')
const posY = ref('' || '50%')

const url = computed(() => {
    if (filename.value) return `url("/images/${filename.value}")`
})

const posVars = computed(() => {
    return {
        '--pos-X': posX.value,
        '--pos-Y': posY.value,
    }
})
//
// const seperateUnit = (source: string) => {
//     let unit = ''
//     let value = ''
//
//     if (source.includes('%')) {
//         unit = '%'
//         value = source.replace('%', '')
//         console.log('unit', unit)
//         console.log('value', value)
//     }
// }

const increment = (i: number, coordinate: string) => {
    console.log('i', i)
    console.log('coordinate', coordinate)
    let unit = ''
    let value: number = 0

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
    /* width: 100%; */
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
}

.canvas {
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    min-height: 0;
    height: 100%;
    overflow: hidden;
}

.controls {
    width: clamp(180px, 20%, 240px);
    height: 100%;
    background-color: color('gray-100');
    box-shadow: 1px 0 0 color('gray-900', 0.1);
    padding: space(2);
    overflow: auto;

    p {
        @include font('primary', 'x-small', 'regular');
        color: color('gray-600');
        padding: space(1);
    }
}

.options {
    margin: space(-1.5);
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
        @include font('primary', 'x-small', 'regular');
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

.image-container {
    flex-grow: 1;
    display: grid;
    place-items: center;
    position: relative;
    margin: space(3);
    border-radius: radius('small');
    overflow: hidden;
    box-shadow: 0 4px 8px color('gray-900', 0.3);
}

.image {
    @include bg();
    position: absolute;
    @include coordinates;
}

.guidelines {
    --pos-X: 50%;
    --pos-Y: 50%;

    position: absolute;
    @include coordinates;

    .coordinate-x,
    .coordinate-y {
        position: absolute;
        @include coordinates;
    }

    .line {
        position: absolute;
        background-color: color('aqua');
    }

    .coordinate-x {
        transform: translateX(var(--pos-X));
        .line {
            top: 0;
            left: 0;
            bottom: 0;
            width: 1px;
        }
    }

    .coordinate-y {
        transform: translateY(var(--pos-Y));
        .line {
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
        }
    }
}
</style>
