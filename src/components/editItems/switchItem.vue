<template>
    <div class="switch-item-container" >
        <div class="switch-item" :style="containerStyle" @click="$emit('set-value', !value)">
            <div class="switch-item-button" :style="buttonStyle"></div>
        </div>
        <div v-if="canClear" @click="$emit('clear')"><icon-delete class="switch-clear-button" /></div>
    </div>
</template>

<style scoped>
    .switch-item-container {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .switch-item {
        background-color: #ccc;
        border: solid 2px #fff;
        /* box-shadow: 2px 2px 6px #666 inset; */
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 2px;
    }
    .switch-item-button {
        /* background-color: #aaa;
        border: solid 1px transparent;
        box-shadow: 9px 9px 10px #fff inset; */
        background-color: #fff;
        box-shadow: 0px 0px 6px rgba(128, 128, 128, 0.6);
    }
    .switch-clear-button {
        width: 20px;
        height: 20px;
        fill: #ccc;
        stroke: #fff;
        stroke-width: 1px;
    }
    .switch-clear-button:hover {
        fill: #f00;
    }
    .switch-clear-button:active {
        fill: #e00;
    }
</style>

<script>
import iconDelete from '../svg/iconDelete.vue';
export default {
	components: { iconDelete },
    props: {
        height: {
            type: Number,
            default: 26
        },
        value: {
            type: Boolean,
            default: false
        },
        canClear: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        containerStyle() {
            return {
                height: `${this.height}px`,
                width: `${this.height * 2 - 8 }px`,
                borderRadius: `${this.height / 2}px`,
                backgroundColor: this.value ? "#40a9ff" : "#ccc",
                justifyContent: this.value ? "flex-end" : "flex-start"
            };
        },
        buttonStyle() {
            const size = this.height - 8;
            return {
                height: `${size}px`,
                width: `${size}px`,
                borderRadius: `${size / 2}px`
            };
        }
    }
}
</script>