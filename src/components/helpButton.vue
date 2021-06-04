<template>
    <div @click.stop="onHelp" class="help-button">
        <icon-question :width="$attrs.width" :height="$attrs.height" />
    </div>    
</template>

<style scoped>
    .help-button {
        stroke: #666;
        stroke-width: 1px;
    }
    .help-button:hover {
        stroke: #1AAD19;
        stroke-width: 3px;
    }
</style>

<script>
import iconQuestion from './svg/iconQuestion.vue'
export default {
	components: { iconQuestion },
    methods: {
        onHelp() {
            window.open('https://season-studio.github.io/roadmap/help.html');
        }
    }
}
</script>