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
}

* {
    box-sizing: border-box;
}
</style>
