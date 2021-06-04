<template>
    <div class="title-panel">
        <div class="caption-container" @click.stop="onStartEditCaption">
            <span class="caption-tag">{{$T("Project")}}:</span>
            <input v-if="editCaptionMode" type="text" class="caption-input" :placeholder="$T('Input the caption of this project')" @keydown.esc.prevent="inEditCaption = false" @keypress.enter="onSubmitCaption" @blur="onSubmitCaption" />
            <span v-else class="caption-text">{{caption}}</span>
        </div>
        <drop-down-container class="caption-dropdown-button" position="bottom-right" :autoDropdown="false">
            <icon-extend />
            <template slot="drop-content">
                <div class="caption-drop-menu-box">
                    <div v-if="projectCollection && (projectCollection.length > 0)" :style="{maxHeight: `${dropMenuMaxHeight}px`}" class="project-list-box">
                        <div v-for="(item, index) in projectCollection" :key="index" class="caption-menu-item" @click="$emit('select-project', index)">
                            {{item.caption}}
                        </div>
                    </div>
                    <div class="caption-menu-seperator-horizontal"></div>
                    <div class="caption-menu-item project-option-button" @click="$emit('draw-project')">
                        <icon-draw width="17" height="17" />
                        {{$T("Draw Roadmap...")}}
                    </div>
                    <div class="caption-menu-seperator-horizontal"></div>
                    <div class="caption-menu-item project-option-button" @click="onNewProject">
                        <icon-new width="17" height="17" />
                        {{$T("Insert New Project")}}
                    </div>
                    <div class="caption-menu-seperator-horizontal"></div>
                    <div class="caption-menu-row-multiitems">
                        <div class="caption-menu-item caption-multiitem-button delete-project-button" @click="onDeleteProject">
                            <icon-delete width="17" height="17" />
                            {{$T("Delete")}}
                        </div>
                        <div class="caption-menu-seperator-vertical"></div>
                        <div class="caption-menu-item caption-multiitem-button project-option-button" @click="$emit('enter-project-collection')">
                            <icon-db width="17" height="17" />
                            {{$T("Projects...")}}
                        </div>
                    </div>
                </div>
            </template>
        </drop-down-container>
    </div>
</template>

<style scoped>
    .title-panel {
        height: 32px;
        border-radius: 6px;
        border: solid 1px #ccc;
        background-color: #fff;
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        align-content: flex-start;
    }
    .caption-container {
        border-radius: 6px 0px 0px 6px;
        flex-grow: 1;
        flex-wrap: nowrap;
        height: 32px;
        display: flex;
        flex-direction: row;
        align-items: center;
        align-content: flex-start;
        border: solid 1px transparent;
        padding: 0px 2px 0px 0px;
    }
    .caption-tag {
        padding: 0px 6px;
    }
    .caption-container:hover {
        border-radius: 6px 0px 0px 6px;
        border: solid 1px #40a9ff;
    }
    .caption-container:hover > .caption-tag {
        color: #40a9ff;
    }
    .caption-text {
        padding: 0px 6px 0px 0px;
        flex-grow: 1;
    }
    .caption-input {
        flex-grow: 1;
        height: 26px;
        outline: none;
        text-align: center;
        cursor: text;
    }
    .caption-dropdown-button {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        align-content: center;
        border-left: solid 1px #ccc;
    }
    .caption-dropdown-button:hover > svg {
        fill: #40a9ff;
    }
    .caption-drop-menu-box {
        margin: 6px 0px;
        background-color: #fff;
        box-shadow: 0px 0px 6px rgba(128, 128, 128, 0.6);
        border: 0px;
        border-radius: 6px;
        padding: 0px 6px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    .caption-menu-item {
        white-space: nowrap;
        padding: 3px 0px;
        display: flex;
        flex-direction: row;
        align-content: center;
        align-items: center;
        justify-content: center;
        justify-items: center;
        width: 100%;
    }
    .caption-menu-item:hover {
        color: #40a9ff;
    }
    .caption-menu-row-multiitems {
        display: flex;
        flex-direction: row;
        align-content: flex-start;
        align-items: center;
    }
    .caption-menu-seperator-horizontal {
        border: 0px;
        border-top: 1px solid #ccc;
        height: 1px;
        width: 100%;
    }
    .caption-menu-seperator-vertical {
        border: 0px;
        border-left: 1px solid #ccc;
        width: 1px;
        height: 26px;
    }
    .project-list-box {
        overflow: auto;
        display: flex;
        flex-direction: column;
        align-content: flex-start;
        align-items: center;
        width: 100%;
    }
    .caption-multiitem-button {
        height: 26px;
        padding: 3px;
        min-width: 100px;
    }
    .delete-project-button {
        fill: red;
    }
    .delete-project-button:hover {
        color: #fff;
        background-color: red;
        fill: #fff;
    }
    .project-option-button {
        fill: #40a9ff;
    }
    .project-option-button:hover {
        color: #fff;
        background-color: #40a9ff;
        fill: #fff;
    }
</style>

<script>
import dropDownContainer from './dropDownContainer.vue';
import IconDb from './svg/iconDb.vue';
import IconDelete from './svg/iconDelete.vue';
import IconDraw from './svg/iconDraw.vue';
import IconExtend from "./svg/iconExtend.vue";
import IconNew from './svg/iconNew.vue';

const editEvents = ["", "caption-changed", "new-project"];

export default {
	components: { 
        dropDownContainer, 
        IconExtend,
        IconNew,
        IconDelete,
        IconDb,
IconDraw
    },
    props: {
        caption: {
            type: String
        },
        projectCollection: {
            type: Array
        }
    },
    data() {
        return {
            editCaptionMode: 0,
            windowHeight: 0
        }
    },
    computed: {
        dropMenuMaxHeight() {
            return this.windowHeight - 117;
        }
    },
    methods: {
        onStartEditCaption() {
            if (0 === this.editCaptionMode) {
                this.editCaptionMode = 1;
                this.$nextTick(() => {
                    const input = this.$el.querySelector("input.caption-input");
                    input && (input.focus(), input.value=this.caption);
                });
            }
        },
        onSubmitCaption() {
            const input = this.$el.querySelector("input.caption-input");
            input && (this.$emit(editEvents[this.editCaptionMode], String(input.value).trim()), this.editCaptionMode = 0);
        },
        onWindowResize() {
            this.windowHeight = window.innerHeight;
        },
        async onDeleteProject() {
            if (await this.$confirm(this.$T("Are you sure to delete the current project?"), "question", [this.$T("No"), this.$T("Yes")])) {
                this.$emit("delete-project");
            }
        },
        onNewProject() {
            if (0 === this.editCaptionMode) {
                this.editCaptionMode = 2;
                this.$nextTick(() => {
                    const input = this.$el.querySelector("input.caption-input");
                    input && (input.focus(), input.value=this.$T("New Project"), input.select());
                });
            }
        }
    },
    mounted() {
        window.addEventListener("resize", this.onWindowResize.bind(this));
        this.$nextTick(() => this.onWindowResize());
    }
}
</script>