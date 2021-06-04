<template>
    <component 
        :is="`${type}Item`" 
        :list="list" 
        :value="value" 
        :width="width"
        :height="height" 
        :canClear="canClear"
        @set-value="$emit('set-value', arguments[0])"
        @clear="$emit('clear')"
    />
</template>

<script>
import selectItem from './selectItem.vue';
import imageItem from './imageItem.vue';
import switchItem from './switchItem';
import dateItem from './dateItem';
import percentItem from './percentItem';

export default {
    components: {
        selectItem,
        imageItem,
        switchItem,
        dateItem,
        percentItem
    },
    props: ["type", "list", "value", "width", "height", "canClear"]
}
</script>