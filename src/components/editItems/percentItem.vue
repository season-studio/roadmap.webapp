<template>
    <div class="percent-item-container">
        <input type="number" :value="value" @change="onChange" :style="{height: `${height}px`, width:`${width}px`}" min="0" mix="100" />
        %
        <div v-if="canClear" @click="$emit('clear')">
            <icon-delete class="percent-clear-button" :style="{height: `${height}px`, width: `${height}px`}" />
        </div>
    </div>
</template>

<style scoped>
    .percent-item-container {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }
    .percent-item-container > input[type="number"] {
        outline: none;
        border: solid 1px #ccc;
        cursor: text;
    }
    .percent-clear-button {
        width: 20px;
        height: 20px;
        fill: #ccc;
        stroke: #fff;
        stroke-width: 1px;
    }
    .percent-clear-button:hover {
        fill: #f00;
    }
    .date-clear-button:active {
        fill: #e00;
    }
</style>

<script>
import IconDelete from '../svg/iconDelete.vue'
export default {
    components: { IconDelete },
    props: {
        height: {
            type: Number,
            default: 26
        },
        width: {
            type: Number,
            default: 46
        },
        value: {
            type: Number,
            default: 0
        },
        canClear: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        onChange(_event) {
            this.$emit("set-value", Number(_event.target.value) || 0);
        }
    }
}
</script>