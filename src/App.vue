<template>
    <router-view />
</template>

<style lang="scss">
html,
body {
    position: fixed;
    @include coordinates;
    overflow: hidden;
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    min-height: -webkit-fill-available;
    @include debug;
}

* {
    box-sizing: border-box;
}
</style>
