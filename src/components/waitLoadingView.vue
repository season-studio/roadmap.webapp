<template>
    <div class="wait-panel">
        <loader-animate d-style-background="80px/80px url('./logo.png')" d-style-width="7px" d-style-height="80px" />
        <p v-if="overTime">{{$T("The loading process took too long time.")}}</p>
        <p v-if="overTime">{{$T("Please check your network.")}}</p>
        <p v-else>{{$T("Loading")}}...</p>
    </div>
</template>

<style scoped>
    .wait-panel {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>

<script>
import loaderAnimate from './loaderAnimate.vue'
export default {
	components: { loaderAnimate },
    data() {
        return {
            overTime: false
        }
    },
    mounted() {
        setTimeout(() => this.overTime = true, 5000);
    }
}
</script>