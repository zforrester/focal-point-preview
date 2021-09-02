<template>
    <router-view />
</template>

<script lang="ts"></script>

<style lang="scss">
html,
body {
    background-color: color('gray-200');
    position: fixed;
    @include coordinates;
    overflow: hidden;
    width: 100%;
    height: 100vh;
}

* {
    box-sizing: border-box;
}
</style>
