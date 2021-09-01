<template lang="pug">
h1 Image Focal Point Preview
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
      input(type="text" v-model="posX")
  li
    .input-container
      label Postion Y
      span.description Start by guessing the vertical coordinate, then adjust
      input(type="text" v-model="posY")

.image-container
  .image(:style="{backgroundImage: `${url}`, backgroundPosition: `${posX} ${posY}` }")

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
</script>

<style scoped lang="scss">
h1 {
    background: color('blue');
}

.image {
    height: 200px;
    width: 200px;
    @include debug;
    display: flex;
    @include bg();
}
</style>
