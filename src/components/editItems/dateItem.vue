<template>
    <div class="date-item-container">
        <input class="date-item-input" type="date" :d-value="valueForInput" :value="valueForInput" @change="onChange" :style="customStyle" />
        <div v-if="canClear" @click="$emit('clear')">
            <icon-delete class="date-clear-button" :style="{height: `${height}px`, width: `${height}px`}" />
        </div>
    </div>
</template>

<style scoped>
    .date-item-container {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }
    .date-item-input {
        outline: none;
        padding: 0px;
        border: solid 1px #ccc;
        position: relative;
        height: var(--height);
        width: var(--width);
    }
    .date-item-input::after {
        content: attr(d-value);
        background-color: #fff;
        padding: 2px 3px;
        position: absolute;
        left: 0px;
        top: 50%;
        transform: translate(0, -50%);
        right: var(--height);
    }
    .date-clear-button {
        width: 20px;
        height: 20px;
        fill: #ccc;
        stroke: #fff;
        stroke-width: 1px;
    }
    .date-clear-button:hover {
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
            default: 100
        },
        value: {
            default: new Date()
        },
        canClear: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        valueForInput() {
            const date = new Date(this.value);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${date.getFullYear()}-${month < 10 ? ("0" + month) : month}-${day < 10 ? ("0" + day) : day}`
        }, 
        customStyle() {
            return {
                "--height": `${this.height}px`,
                "--width": `${this.width}px`
            }
        }
    },
    methods: {
        onChange(_event) {
            this.$emit("set-value", new Date(_event.target.value));
        }
    }
}
</script>