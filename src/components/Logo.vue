<template lang="pug">
.logo-container
    .logo-mask
        .colours
</template>

<style lang="scss">
.logo-container {
    @include ratio(1, 1);
    @include transition;
    position: relative;
    width: 100%;
    overflow: hidden;
    pointer-events: none;

    .logo-mask {
        position: absolute;
        @include coordinates;
        -webkit-mask-image: url('/images/logo-responsive.svg');
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-position: 50% 50%;
        -webkit-mask-size: contain;
        mask-image: url('/images/logo-responsive.svg');
        mask-repeat: no-repeat;
        mask-position: 50% 50%;
        mask-size: contain;
        pointer-events: none;
        overflow: hidden;
    }

    .colours {
        position: absolute;
        @include coordinates(-15%);
        background-color: color('purple');
        background-image: url('/images/colours.png');
        @include bg(contain);
        @include transition;
        pointer-events: none;
    }
}
</style>
