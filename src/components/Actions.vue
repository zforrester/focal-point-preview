<template lang="pug">
.actions
  ul.action-list
    li.action-item
      button(@click="$emit('toggleDarkModeUI')" )
        .icon(:class="{'moon' : !darkMode, 'sun' : darkMode}")
        .label Toggle Dark Mode
    li.action-item
      button(@click="$emit('toggleGrid')" :class="{'active' : showGrid}")
        .icon.grid
        .label Toggle Grid
    li.action-item
        GithubButton(v-if="!darkMode" href="https://github.com/zforrester/focal-point-preview" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" data-show-count="true" aria-label="Star zforrester/focal-point-preview on GitHub") Star
        GithubButton(v-if="darkMode" href="https://github.com/zforrester/focal-point-preview" data-color-scheme="no-preference: dark; light: dark; dark: dark;" data-size="large" data-show-count="true" aria-label="Star zforrester/focal-point-preview on GitHub") Star

</template>

<script>
import { ref } from 'vue'
import GithubButton from 'vue-github-button'

export default {
    components: {
        GithubButton,
    },
    props: ['showGrid', 'darkMode'],
}
</script>

<style lang="scss" scoped>
button {
    @include button-reset;
    @include font('primary', 'small', 'medium');
    line-height: 1;
    text-decoration: none;
}

.action-list {
    display: flex;
    margin: space(-0.5);
    align-items: center;
}

.action-item {
    padding: space(0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
}

button {
    border-radius: radius('x-small');
    display: flex;
    color: color('gray-700');
    box-shadow: 0 0 0 1px color('gray-300', 0);
    transition: background-color $t $t-snap, box-shadow $t $t-snap;

    @include dark {
        color: color('gray-400');
    }

    &:hover {
        box-shadow: 0 0 0 1px color('gray-300');
        background-color: color('gray-200');
        color: color('gray-600');

        @include dark {
            box-shadow: 0 0 0 1px color('gray-950', 0.3);
            background-color: color('gray-500', 0.3);
            color: color('gray-100');
        }
    }

    &.active {
        color: color('blue');
        background-color: lighten(color('blue', 0.2), 10%);

        &:hover {
            color: color('white');
            box-shadow: inset 0 0 1px 1px darken(color('blue', 0.5), 10%);
            background-color: lighten(color('blue'), 10%);
        }
    }

    .icon {
        @include icon-size('medium');
        background-color: currentColor;
        transform: scale(0.8);
    }

    .grid {
        @include icon('grid');
    }

    .sun {
        @include icon('sun');
    }

    .moon {
        @include icon('moon');
    }

    .label {
        position: absolute;
        @include transition;
        @include show('off');
    }
}
</style>

<!-- Place this tag where you want the button to render.
<github-button href="https://github.com/zforrester/focal-point-preview" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" data-show-count="true" aria-label="Star zforrester/focal-point-preview on GitHub">Star</github-button> -->
<!-- Place this tag where you want the button to render. -->
<!-- <github-button href="https://github.com/zforrester/focal-point-preview" data-color-scheme="no-preference: light; light: light; dark: dark;" data-show-count="true" aria-label="Star zforrester/focal-point-preview on GitHub">Star</github-button> -->
