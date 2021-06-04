<template>
    <div class="project-collection-panel">
        <div class="project-collection-container">
            <div class="project-item" v-for="(item, index) in projectCollection" :key="index" :d-select-flag="(selectList.indexOf(index) + 1) || undefined" @click.stop="onSelect(index)">
                <div class="project-item-image" :style="{backgroundImage: `url(${item.image || './logo.png'})`}"></div>
                <span class="project-item-caption">{{item.caption}}</span>
                <div class="project-item-open" @click.stop="$emit('change-view', 'detailEditor', index)">
                    <icon-open width="46" height="46" fill="rgba(255, 255, 255, 0.8)" stroke="#fff" stroke-width="1px" />
                </div>
                <span class="project-select-flag">{{selectList.indexOf(index) > 100 ? ".." : (selectList.indexOf(index) + 1)}}</span>
            </div>
            <div class="project-item project-add-button" @click.stop="$emit('change-view', 'detailEditor', projectCollection.length)">
                <icon-plus width="64" height="64" />
            </div>
        </div>
        <div class="project-collection-toolbar">
            <div class="tool-button projects-tool-button" d-tool-flag="danger" @click="onDelete">
                <icon-delete width="16" height="16" />
                {{$T("Delete")}}
            </div>
            <div class="tool-button projects-tool-button" @click="onCopy">
                <icon-copy width="16" height="16" />
                {{$T("Copy")}}
            </div>
            <div class="tool-button projects-tool-button" @click="onPaste">
                <icon-paste width="16" height="16" />
                {{$T("Paste")}}
            </div>
            <div class="tool-button projects-tool-button" @click="onDraw">
                <icon-draw width="16" height="16" />
                {{$T("Draw")}}
            </div>
        </div>
        <help-button width="16" height="16" class="project-help" />
    </div>
</template>

<style scoped>
    .project-collection-panel {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        background-color: #eee;
    }
    .project-help {
        position: absolute;
        right: 6px;
        top: 6px;
    }
    .project-collection-container {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        padding: 6px;
        margin: 6px;
        background-color: #fff;
        border-radius: 6px;
        overflow: auto;
    }
    .project-item {
        padding: 6px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        border: solid 3px transparent;
        border-radius: 6px;
    }
    .project-item-image {
        width: 100px;
        height: 100px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .project-item-caption {
        font-size: 15px;
        height: 26px;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100px;
        white-space: nowrap;
        padding: 3px;
        display: block;
    }
    .project-item-open {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: none;
        justify-content: center;
        align-items: center;
        background-color: rgba(128, 128, 128, 0.2);
        border-radius: 6px;
        /* box-shadow: 0px 0px 6px #000; */
    }
    .project-select-flag {
        position: absolute;
        top: 0px;
        left: 0px;
        transform: translate(-50%, -50%);
        display: none;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 10px;
        color: #fff;
        background-color: red;
        width: 20px;
        height: 20px;
        box-shadow: 0px 0px 6px #666;
        border-radius: 10px;
    }
    .project-item[d-select-flag] {
        border-color: #40a9ff;
    }
    .project-item[d-select-flag] > .project-select-flag {
        display: flex;
    }
    .project-item:hover {
        background-color: #fff;
        box-shadow: 0px 0px 6px #40a9ff;
    }
    .project-item:hover > .project-item-open {
        display: flex;
    }
    .project-item-open:hover {
        border: solid 1px #fff;
        box-shadow: 0px 0px 6px #aaa;
    }
    .project-add-button {
        border: dashed 1px #40a9ff;
        padding: 6px;
        height: 126px;
        width: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        fill: #40a9ff;
    }
    .project-add-button:hover {
        border: solid 3px #40a9ff;
    }
    .project-collection-toolbar {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 6px 0px 12px 0px;
    }
    .projects-tool-button {
        height: 26px;
        padding: 3px 6px;
        font-size: 15px;
    }
</style>

<script>
import HelpButton from './helpButton.vue';
import IconCopy from './svg/iconCopy.vue';
import IconDelete from './svg/iconDelete.vue';
import IconDraw from './svg/iconDraw.vue';
import IconOpen from './svg/iconOpen.vue';
import IconPaste from './svg/iconPaste.vue';
import IconPlus from './svg/iconPlus.vue';

export default {
	components: { IconOpen, HelpButton, IconPlus, IconDelete, IconDraw, IconCopy, IconPaste },
    props: ["projectIndex"],
    computed: {
        projectCollection() {
            let projects = this.$Share().projects;
            if (!projects || (0 >= projects.length)) {
                projects = (this.$Share().projects = [
                    this.newProjectByDefault()
                ]);
            }
            return this.$Share().projects;
        }
    },
    data() {
        return {
            selectList: []
        }
    },
    mounted() {
        if (typeof this.projectIndex === "number") {
            this.selectList.push(this.projectIndex);   
        } else if (this.projectIndex instanceof Array) {
            this.selectList.push.apply(this.selectList, this.projectIndex);
        }
    },
    methods: {
        onSelect(_index) {
            const pos = this.selectList.indexOf(_index);
            if (pos >= 0) {
                this.selectList.splice(pos, 1);
            } else {
                this.selectList.push(_index);
            }
            this.$set(this.selectList, "$lastChange", _index);
        },
        async onDelete() {
            const selectList = this.selectList;
            if (selectList.length > 0) {
                if (await this.$confirm(this.$T("Are you sure to delete the selected projects?"), "question", [this.$T("No"), this.$T("Yes")])) {
                    selectList.sort((a, b) => b - a);
                    for (let index of selectList) {
                        this.projectCollection.splice(index, 1);
                    }
                    selectList.splice(0);
                    this.$Share().$Save(true);
                    this.$delete(this.selectList, "$lastChange");
                    //this.$forceUpdate();
                }
            } else {
                this.$tip(this.$T("Select any project first"), "error");
            }
        },
        onDraw() {
            this.$Share().$Save(true);
            const selectList = [...this.selectList];
            if (selectList.length > 0) {
                this.$emit("change-view", "drawView", selectList);
            } else {
                this.$tip(this.$T("Select any project first"), "error");
            }
        },
        async onCopy() {
            const failState = {};
            try {
                if (this.selectList.length <= 0) {
                    failState.message = "Select any project first";
                    throw failState;
                }
                const { state: permissionState } = navigator.permissions.query ? (await navigator.permissions.query({name: "clipboard-write"})) : { state: "granted" };
                if ((permissionState !== "granted") && (permissionState !== "prompt")) {
                    failState.message = "Can't access the clipboard";
                    throw failState;
                }
                if (!navigator.clipboard || !navigator.clipboard.writeText) {
                    failState.message = "Not support clipboard API";
                    throw failState;
                }
                const selectProjects = [];
                this.selectList.forEach(projectIndex => {
                    selectProjects.push(this.projectCollection[projectIndex])
                });
                const data = JSON.stringify({ "season-roadmap-projects": selectProjects });
                navigator.clipboard.writeText(data).then(
                    () => this.$tip(this.$T("Projects has been copied to clipboard"), "info"),
                    () => this.$tip(this.$T("Fail in copying the projects"), "error")
                );
            } catch (error) {
                if (error === failState) {
                    this.$tip(this.$T(error.message), "error");
                } else {
                    this.$tip(this.$T("Fail in copying to clipboard"), "error");
                    console.error(error);
                }
            }
        },
        async onPaste() {
            const failState = {};
            try {
                const { state: permissionState } = navigator.permissions.query ? (await navigator.permissions.query({name: "clipboard-read"})) : { state: "granted" };
                if ((permissionState !== "granted") && (permissionState !== "prompt")) {
                    failState.message = "Can't access the clipboard";
                    throw failState;
                }
                if (!navigator.clipboard || !navigator.clipboard.readText) {
                    failState.message = "Not support clipboard API";
                    throw failState;
                }
                const clipboardData = await navigator.clipboard.readText();
                const { "season-roadmap-projects": projects } = JSON.parse(clipboardData);
                if (projects instanceof Array) {
                    Array.prototype.push.apply(this.projectCollection, projects);
                    this.$forceUpdate();
                }
            } catch (error) {
                if (error === failState) {
                    this.$tip(this.$T(error.message), "error");
                } else {
                    this.$tip(this.$T("Fail in pasting from clipboard"), "error");
                    console.error(error);
                }
            }
        }
    }
}
</script>