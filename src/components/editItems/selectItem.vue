<template>
    <div class="select-container">
        <div class="select-panel" d-123="123" :style="{height: `${height}px`, }">
            <div class="select-value" :style="{width:`${width}px`}">
                <div class="select-item-icon" v-if="valueColor" :style="{backgroundColor: valueColor, '--height': `${height}px`}"></div>
                <div class="select-item-icon" v-else-if="valueImage" :style="{backgroundImage: `url(${valueImage})`, '--height': `${height}px`}"></div>
                <div>{{$T(valueTip)}}</div>
            </div>
            <drop-down-container position="bottom-right" class="select-dropdown-button" :style="{'--height': `${height}px`}" :autoDropdown="false">
                <icon-pulldown style="margin: 0px 6px 0px 6px;" />
                <template slot="drop-content">
                    <div class="select-droplist-box">
                        <div v-for="(item, key) in list" :key="key" class="select-value select-list-item" @click="$emit('set-value', item.value)">
                            <div class="select-item-icon" v-if="item.color" :style="{backgroundColor: item.color, '--height': `${height}px`}"></div>
                            <div class="select-item-icon" v-else-if="item.image" :style="{backgroundImage: `url(${item.image})`, '--height': `${height}px`}"></div>
                            <div class="select-value-tip">{{$T(item.tip)}}</div>
                        </div>
                    </div>
                </template>
            </drop-down-container>
        </div>
        <div v-if="canClear" @click="$emit('clear')"><icon-delete class="select-clear-button" :style="{height: `${height}px`, width: `${height}px`}" /></div>
    </div>
</template>

<style scoped>
    .select-container {
        display: flex;
        flex-direction: row;
    }
    .select-panel {
        border-radius: 6px;
        border: solid 1px #ccc;
        background-color: #fff;
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
    }
    .select-dropdown-button {
        width: var(--height);
        height: var(--height);
        display: flex;
        align-items: center;
        align-content: center;
        border-left: solid 1px #ccc;
    }
    .select-dropdown-button:hover > svg {
        fill: #40a9ff;
    }
    .select-value {
        display: flex;
        flex: row;
        align-items: center;
        align-content: flex-start;
    }
    .select-value > * {
        padding: 4px;
    }
    .select-value-tip {
        white-space: nowrap;
    }
    .select-list-item {
        width: 100%
    }
    .select-list-item:hover {
        background-color: #40a9ff;
    }
    .select-list-item:hover * {
        color: #fff;
    }
    .select-item-icon {
        margin-left: 2px;
        width: var(--height);/* 26px; */
        height: calc(var(--height) - 6px); /* 20px; */
        border: solid 1px #fff;
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
    .select-droplist-box {
        background-color: #fff;
        box-shadow: 0px 0px 6px rgba(128, 128, 128, 0.6);
        border: 0px;
        border-radius: 6px;
        padding: 3px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        margin-top: 3px;
    }
    .select-clear-button {
        stroke: #fff;
        stroke-width: 1px;
        fill: #ccc;
        padding: 3px;
    }
    .select-clear-button:hover {
        fill: #f00;
    }
    .select-clear-button:active {
        fill: #e00;
    }
</style>

<script>
import DropDownContainer from '../dropDownContainer.vue';
import IconDelete from '../svg/iconDelete.vue';
import IconPulldown from '../svg/iconPulldown.vue';

export default {
	components: { 
        DropDownContainer, 
        IconPulldown,
        IconDelete 
    },
    props: {
        list: {
            type: Array,
            required: true
        },
        value: [String, Number, Boolean, Date],
        width: {
            type: Number,
            default: 80
        },
        height: {
            type: Number,
            default: 26
        },
        canClear: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        valueColor() {
            for (const item of this.list) {
                if (item.value === this.value) {
                    return item.color;
                }
            }
            return undefined;
        },
        valueImage() {
            for (const item of this.list) {
                if (item.value === this.value) {
                    return item.image;
                }
            }
            return undefined;
        },
        valueTip() {
            for (const item of this.list) {
                if (item.value === this.value) {
                    return item.tip;
                }
            }
            return this.value;
        }
    }
}
</script>