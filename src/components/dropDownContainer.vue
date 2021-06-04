<template>
    <div class="dropdown-start-item" @mouseleave="onLeave" @mouseenter="onEnter(autoDropdown)" @click.stop="onEnter(true)">
        <slot></slot>
        <div :class="dropContainerClass" v-if="showContent" @click.stop="onLeave">
            <slot name="drop-content"></slot>
        </div>
    </div>
</template>

<style scoped>
    .dropdown-start-item {
        position: relative;
    }
    .dropdown-container {
        position: absolute;
    }
    .dropdown-container-top-left {
        left: 0px;
        bottom: 100%;
    }
    .dropdown-container-top-right {
        right: 0px;
        bottom: 100%;
    }
    .dropdown-container-bottom-left {
        left: 0px;
        top: 100%;
    }
    .dropdown-container-bottom-right {
        right: 0px;
        top: 100%;
    }
</style>

<script>
export default {
    data() {
        return {
            showContent: this.initDropdown
        }
    },
    props: {
        position: {
            type: String
        },
        autoDropdown: {
            type: Boolean,
            default: true
        },
        initDropdown: {
            type: Boolean,
            default: false
        },
        dropdownClass: {
            type: String,
            default: ""
        }
    },
    computed: {
        dropContainerClass() {
            return `dropdown-container dropdown-container-${this.position || "bottom-left"} ${this.dropdownClass || ""}`;
        }
    },
    methods: {
        onEnter(_show) {
            this.showContent = _show;
        },
        onLeave() {
            this.showContent = false;
        }
    }
}
</script>