<template>
    <div class="edit-main-panel">
        <div class="project-info-panel">
            <project-title style="z-index: 999;"
                :caption="project.caption" :projectCollection="projectCollection"
                @caption-changed="setSummaryItem('caption', arguments[0])" 
                @new-project="onNewProject" 
                @delete-project="onDeleteProject" 
                @select-project="currentProjectIndex = arguments[0]" 
                @enter-project-collection="$emit('change-view', 'projectsView')"
                @draw-project="$emit('change-view', 'projectsView', currentProjectIndex)" />
            <div class="project-summary-panel">
                <div @click="showSummary = !showSummary" class="project-summary-tip">
                    {{$T("Summary")}}
                    <svg v-if="showSummary" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M19.3 11 76.7 48 19.3 85Z"/></svg>
                    <svg v-else viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><g><path d="M47.979 10C27.0038 10 10 27.0038 10 47.979 10 68.9542 27.0038 85.958 47.979 85.958 68.9542 85.958 85.958 68.9542 85.958 47.979 85.9674 27.0132 68.9788 10.0094 48.013 10 48.0017 10 47.9903 10 47.979 10ZM47.979 83.958C28.1083 83.958 12 67.8497 12 47.979 12 28.1083 28.1083 12 47.979 12 67.8497 12 83.958 28.1083 83.958 47.979 83.9354 67.8403 67.8403 83.9354 47.979 83.958Z"/><path d="M49 35 41 35 41 37 47 37 47 67 40 67 40 69 56 69 56 67 49 67 49 35Z"/><circle cx="46.814" cy="26.5" r="2.25"/></g></svg>
                </div>
                <div class="project-summary-list" v-if="showSummary">
                    <div v-for="(item, key, index) in projectSummaries" :key="key" class="project-summary-item" :style="{zIndex:799-index}">
                        <span>{{$T(item.tip)}}:</span>
                        {{item.$index}}
                        <edit-item
                            :type="item.type"
                            :list="item.values"
                            :value="project[key]"
                            @set-value="setSummaryItem(key, arguments[0])"
                            @clear="clearSummaryItem(key)" />
                    </div>
                    <drop-down-container v-if="emptySummaries && (Object.keys(emptySummaries).length > 0)" class="project-summary-add" position="bottom-right" :autoDropdown="false" dropdown-class="project-summary-add-list">
                        <icon-plus />
                        {{$T("Add")}}
                        <template slot="drop-content">
                            <div v-for="(item, key) in emptySummaries" :key="key" class="project-summary-add-item" @click="addSummaryItem(key, item)">
                                {{$T(item.tip)}}
                            </div>
                        </template>
                    </drop-down-container>
                </div>
            </div>
        </div>
        <div class="project-tasks-caption">
            <span @click="log(JSON.stringify(project))">{{$T("Tasks")}}:</span>
            <help-button width="14" height="14" />
        </div>
        <div class="project-tasks-panel">
            <task-list :list="project.items" />
        </div>
    </div>
</template>

<style>
    .edit-main-panel {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
    }
    .project-info-panel {
        z-index: 999;
        background-color: rgba(196,196,196,0.15);
        border-radius: 6px;
        margin: 6px;
        padding: 6px;
    }
    .project-summary-panel {
        padding: 6px 0px 0px 6px;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        align-content: flex-start;
        width: 100%;
        z-index: 899;
    }
    .project-summary-panel * {
        font-size: 13px;
        color: #666;
    }
    .project-summary-tip {
        white-space: nowrap;
        display: flex;
        flex: row;
        align-items: center;
        stroke: #666;
        fill: #666;
        stroke-width: 2px;
        cursor: pointer;
    }
    .project-summary-tip > svg {
        margin: 0px 6px 0px 3px;
    }
    .project-summary-tip:hover {
        color: #40a9ff;
        stroke: #40a9ff;
        fill: #40a9ff;
    }
    .project-summary-list {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        background-color: rgba(196, 196, 196, 0.1);
        padding: 6px;
        border-radius: 6px;
    }
    .project-summary-item {
        margin-bottom: 6px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
    }
    .project-summary-item > span {
        padding-right: 6px;
        white-space: nowrap;
    }
    .project-summary-add {
        width: 100%;
        max-width: 170px;
        border: dashed 1px #999;
        color: #333;
        fill: #333;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 6px;
        z-index: 700;
    }
    .project-summary-add > svg {
        width: 12px;
        height: 12px;
        margin-right: 6px;
    }
    .project-summary-add:hover {
        border-color: #40a9ff;
        color: #40a9ff;
        fill: #40a9ff;
    }
    .project-summary-add-list {
        background-color: #fff;
        box-shadow: 0px 0px 6px rgba(128, 128, 128, 0.6);
        border: 0px;
        border-radius: 6px;
        padding: 3px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
    }
    .project-summary-add-item {
        padding: 3px;
    }
    .project-summary-add-item:hover {
        color: #40a9ff;
    }
    .project-tasks-caption {
        padding: 0px 6px;
        margin: 0px 5px;
        text-align: left;
        border-bottom: dashed 1px #ccc;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .project-tasks-caption * {
        font-size: 14px;
    }
    .project-tasks-panel {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        justify-content: flex-start;
        overflow: auto;
    }
</style>

<script>
import DropDownContainer from './dropDownContainer.vue';
import EditItem from './editItems';
import HelpButton from './helpButton.vue';
import projectTitle from './projectTitle.vue';
import IconPlus from './svg/iconPlus.vue';
import TaskList from './taskList.vue';

export default {
	components: { 
        projectTitle,
        EditItem,
        IconPlus,
        DropDownContainer,
        TaskList,
        HelpButton
    },
    props: {
        projectIndex: {
            type: Number,
            default: 0
        }
    },
    computed: {
        projectCollection() {
            let projects = this.$Share().projects;
            if (!projects || (0 >= projects.length)) {
                projects = (this.$Share().projects = [
                    this.newProjectByDefault()
                ]);
            }
            return this.$Share().projects;
        },
        project() {
            let index = this.currentProjectIndex;
            (index < 0) && (index = 0);
            const projectCollection = this.projectCollection;
            while (index >= projectCollection.length) {
                projectCollection.push(this.newProjectByDefault());
            }
            const project = projectCollection[index];
            if (!project.items || (0 >= project.items.length)) {
                project.items = [this.$Share().newTaskByDefault()];
            }
            return project;
        }
    },
    data() {
        return {
            currentProjectIndex: 0,
            showSummary: false,
            projectSummaries: undefined,
            emptySummaries: undefined
        }
    },
    watch: {
        currentProjectIndex() {
            this.$Share().$Save(true);
        }
    },
    mounted() {
        this.currentProjectIndex = Number(this.projectIndex) || 0;
        this.prepareSummaryList();
    },
    methods: {
        newProjectByDefault(_caption) {
            return {
                caption: (_caption || `<${this.$T("Nonamed Project")}>`),
                items: [this.$Share().newTaskByDefault()]
            }
        },
        prepareSummaryList() {
            const summaryOptions = this.$Share().$SummaryOptions;
            const projectKeys = Object.keys(this.project);
            const projectSummaries = (this.projectSummaries = {});
            const emptySummaries = (this.emptySummaries = {});
            for (let key in summaryOptions) {
                if (projectKeys.includes(key)) {
                    projectSummaries[key] = summaryOptions[key];
                } else {
                    emptySummaries[key] = summaryOptions[key];
                }
            }
        },
        setSummaryItem(_key, _value) {
            this.project[_key] = _value;
            this.$Share().$Save();
            this.$forceUpdate();
        },
        clearSummaryItem(_key) {
            delete this.project[_key];
            this.$Share().$Save();
            this.prepareSummaryList();
        },
        addSummaryItem(_key, _option) {
            this.project[_key] = _option.default;
            this.$Share().$Save();
            this.prepareSummaryList();
        },
        onNewProject(_caption) {
            this.projectCollection.push(this.newProjectByDefault(_caption));
            this.currentProjectIndex = this.projectCollection.length - 1;
        },
        onDeleteProject() {
            let index = this.currentProjectIndex;
            this.projectCollection.splice(this.currentProjectIndex, 1);
            if (index >= this.projectCollection.length) {
                index -= 1;
            }
            if (index < 0) {
                this.projectCollection.push(this.newProjectByDefault());
                index = 0;
            }
            this.currentProjectIndex = -1;
            this.$nextTick(() => this.currentProjectIndex = index);
        }
    }
}
</script>