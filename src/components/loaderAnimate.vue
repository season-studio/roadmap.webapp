<template>
    <div class="loader loader-17" :style="customStyle">
        <div class="css-square" :style="Object.assign({'--delay': '0.125s', '--index': 0}, customStyle)"></div>
        <div class="css-square" :style="Object.assign({'--delay': '0.3s', '--index': 1}, customStyle)"></div>
        <div class="css-square" :style="Object.assign({'--delay': '0.425s', '--index': 2}, customStyle)"></div>
        <div class="css-square" :style="Object.assign({'--delay': '0.540s', '--index': 3}, customStyle)"></div>
        <div class="css-square" :style="Object.assign({'--delay': '0.655s', '--index': 4}, customStyle)"></div>
        <div class="css-square" :style="Object.assign({'--delay': '0.79s', '--index': 5}, customStyle)"></div>
        <div class="css-square" :style="Object.assign({'--delay': '0.9s', '--index': 6}, customStyle)"></div>
        <div class="css-square" :style="Object.assign({'--delay': '1s', '--index': 7}, customStyle)"></div>
    </div>
</template>

<style scoped>
    .loader { 
        position: relative; 
        width: calc((var(--width, 7px) + 3px) * 8 + var(--height, 60px));
        height: var(--height, 60px);
        display: inline-block; 
        vertical-align: middle;
        background: transparent;
    }
    .loader-17 .css-square { 
        position: absolute; 
        top: 0px; 
        width: var(--width, 7px); 
        height: var(--height, 60px); 
        background: var(--background, white);
        margin: 0px 3px 0px 0px;

        background-position-y: 0px;
        background-position-x: calc(-10px * var(--index));
        left: calc(var(--height, 60px) / 2 + (var(--width, 7px) + 3px) * var(--index)); 
        -webkit-animation: dominos 1.7s var(--delay) ease infinite; 
        animation: dominos 1.7s var(--delay) ease infinite; 
    }
    @-webkit-keyframes dominos {
        0% {
            opacity: 1;
            box-shadow: 0px 0px 3px #666;
        }
        50% {
            opacity: 0.3;
            box-shadow: none;
        }
        80% {
            opacity: 0.1;
        }
        100% {
            opacity: 1;
        }
    }
    @keyframes dominos {
        0% {
            opacity: 1;
            box-shadow: 0px 0px 3px #666;
        }
        50% {
            opacity: 0.3;
            box-shadow: none;
        }
        80% {
            opacity: 0.1;
        }
        100% {
            opacity: 1;
        }
    }
</style>

<script>
export default {
    computed: {
        customStyle() {
            const style = {};
            const attrs = this.$attrs;
            for (let key in attrs) {
                if (key.startsWith("d-style-")) {
                    style[`--${key.replace("d-style-", "")}`] = attrs[key];
                }
            }
            return style;
        }
    }
}
</script>