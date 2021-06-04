<template>
    <div class="image-item-container" :style="containerStyle">
        <div v-if="value" class="image-item-bar">
            <div @click="onSelectImage"><icon-open class="image-item-button" /></div>
            <div v-if="canClear" @click="$emit('clear')"><icon-delete class="image-item-button image-item-delete-button" /></div>
        </div>
        <div v-else @click="onSelectImage"><icon-plus class="image-item-plus-big" /></div>
    </div>    
</template>

<style scoped>
    .image-item-container {
        background-color: rgba(196, 196, 196, 0.1);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
    }
    .image-item-plus-big {
        fill: #fff;
        border: dashed 1px #fff;
        width: 100%;
        height: 100%;
        padding: 10px;
    }
    .image-item-plus-big:hover {
        fill: #40a9ff;
        border-color: #40a9ff;
    }
    .image-item-bar {
        background-color: rgba(196, 196, 196, 0.1);
        width: 100%;
        padding: 6px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }
    .image-item-bar:hover {
        background-color: rgba(128, 128, 128, 0.2);
    }
    .image-item-button {
        width: 20px;
        height: 20px;
        stroke: #aaa;
        stroke-width: 1px;
        fill: #fff;
    }
    .image-item-button:hover {
        fill: #40a9ff;
        stroke: #fff;
    }
    .image-item-delete-button:hover {
        fill: #f00;
        stroke: #fff;
    }
    .image-item-delete-button:active {
        fill: #e00;
        stroke: #fff;
    }
</style>

<script>
import IconDelete from '../svg/iconDelete.vue';
import IconPlus from '../svg/iconPlus.vue';
import { pickFile } from '../../toolkits/src/domKits';
import IconOpen from '../svg/iconOpen.vue';

export default {
	components: { IconPlus, IconDelete, IconOpen },
    props: {
        value: {
            type: String,
            default: undefined
        },
        width: {
            type: Number,
            default: 100
        },
        height: {
            type: Number,
            default: 100
        },
        canClear: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        containerStyle() {
            const a = Object.assign({
                width: `${this.width}px`,
                height: `${this.height}px`
            }, this.value ? {backgroundImage: `url(${this.value})`} : {padding: '10px'});
            return a;
        }
    },
    methods: {
        async onSelectImage() {
            try {
                const file = await pickFile(".png,.jpeg,.jpg,.ico");
                if (file) {
                    const image = new Image();
                    image.src = URL.createObjectURL(file);
                    image.onload = () => {
                        const { width, height } = image;
                        const canvas = document.createElement("canvas");
                        canvas.width = width;
                        canvas.height = height;
                        const context = canvas.getContext("2d");
                        context.fillStyle = 'rgba(255,255,255,0)';
                        context.fillRect(0, 0, width, height);
                        context.drawImage(image, 0, 0);  
                        const data = canvas.toDataURL("image/png");
                        this.$emit("set-value", data);
                    };
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}
</script>