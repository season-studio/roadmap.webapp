<template>
    <div class="task-list-container" @focusout="onFocusOut">
        <div v-for="(item, index) in list" :key="index" :d-task-type="(item instanceof Array) ? 'group' : 'item'" :d-task-sub-index="index">
            <div v-if="(item instanceof Array)" class="task-subgroup-panel">
                <task-list
                    v-for="(subItem, subIndex) in item" :key="subIndex"
                    :list="(subItem instanceof Array) ? subItem : (item[subIndex] = [subItem])" 
                    :d-task-group-index="subIndex"
                    @add-task-before="onAddTask(index)"
                    @add-task-after="onAddTask(index+1)"
                    @add-group-before="onAddSiblingTaskGroup(item, subIndex, index)"
                    @add-group-after="onAddSiblingTaskGroup(item, subIndex+1, index)"
                    @delete-group="onDeleteGroup(item, subIndex, index)"
                    @delete-group-collection="onDelete(index)" />
            </div>
            <div v-else class="task-item-panel" tabindex="0" @keydown.down="log" @focusin="onFocusIn(index)">
                <input v-if="showKey === index" class="task-text-input" :value="item.text" :placeholder="$T('input the caption of this task')" @change="onChangeValue(arguments[0].target.value, item, 'text')" />
                <div v-else class="task-text">{{String(item.text).trim()}}</div>
                <div v-if="showKey !== index" class="task-item-summary-panel">
                    <span v-for="(option, optIndex) in taskSummaryOptions" :key="optIndex" :style="taskSummaryStyle(item, option)" class="task-item-summary">
                        {{option.textContent ? taskSummaryValue(item, option) : ""}}
                    </span>
                </div>
                <div v-else class="task-item-option-panel">
                    <div v-for="(option, key) in taskOptions" :key="key" class="task-item-option">
                        {{$T(option.tip)}}:
                        <edit-item :type="option.type"
                            :list="option.values"
                            :canClear="false"
                            :height="20"
                            :value="Object.keys(item).includes(key) ? item[key] : (item[key] = option.default)"
                            @set-value="onChangeValue(arguments[0], item, key)" />
                    </div>
                </div>
                <div v-if="showKey === index" class="task-toolbar">
                    <div class="tool-button task-tool-button" @click="onAddTask(index+1)">
                        <icon-plus width="12" height="12" />
                        {{$T("Add Task")}}
                        <drop-down-container class="task-tool-dropdown-button" position="bottom-right" dropdown-class="task-tool-dropdown-box" :autoDropdown="false">
                            <icon-extend width="20" height="20" />
                            <template slot="drop-content">
                                <div @click="onAddTask(index)">{{$T("Before this task")}}</div>
                                <div @click="onAddTask(index+1)">{{$T("After this task")}}</div>
                                <div v-if="!isTopLevel" @click="$emit('add-task-before')">{{$T("Before this group collection")}}</div>
                                <div v-if="!isTopLevel" @click="$emit('add-task-after')">{{$T("After this group collection")}}</div>
                            </template>
                        </drop-down-container>
                    </div>
                    <div class="tool-button task-tool-button" @click="onAddSubTaskGroup(index+1)">
                        <icon-stack-paper width="12" height="12" />
                        {{$T("Add Task Group")}}
                        <drop-down-container class="task-tool-dropdown-button" position="bottom-right" dropdown-class="task-tool-dropdown-box" :autoDropdown="false">
                            <icon-extend width="20" height="20" />
                            <template slot="drop-content">
                                <div @click="onAddSubTaskGroup(index)">{{$T("Before this task")}}</div>
                                <div @click="onAddSubTaskGroup(index+1)">{{$T("After this task")}}</div>
                                <div v-if="!isTopLevel" @click="$emit('add-group-before')">{{$T("Before this group")}}</div>
                                <div v-if="!isTopLevel" @click="$emit('add-group-after')">{{$T("After this group")}}</div>
                            </template>
                        </drop-down-container>
                    </div>
                    <div class="tool-button task-tool-button" d-tool-flag="danger" @click="onDelete(index)">
                        <icon-delete width="12" height="12" />
                        {{$T("Delete")}}
                        <drop-down-container class="task-tool-dropdown-button" position="bottom-right" dropdown-class="task-tool-dropdown-box" :autoDropdown="false">
                            <icon-extend width="20" height="20" />
                            <template slot="drop-content">
                                <div @click="onDelete(index)">{{$T("This task")}}</div>
                                <div v-if="!isTopLevel" @click="$emit('delete-group')">{{$T("This group")}}</div>
                                <div v-if="!isTopLevel" @click="$emit('delete-group-collection')">{{$T("This group collection")}}</div>
                            </template>
                        </drop-down-container>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .task-list-container {
        border: none;
        padding: 6px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        position: relative;
    }
    .task-list-container::after {
        content: " ";
        height: 6px;
        width: 4px;
        background-color: #fff;
        position: absolute;
        bottom: 0px;
        left: -4px;
    }
    .task-list-container .task-list-container {
        border-left: solid 4px #ddd;
        padding: 3px 0px 9px 0px;
    }
    [d-task-type="item"] {
        border: solid 1px #d9d9d9;
    }
    [d-task-type="item"] + [d-task-type="item"] {
        border-top-width: 0px;
    }
    .task-item-panel {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        padding: 4px 0px;
        outline: none;
    }
    .task-list-container > [d-task-type]:nth-child(odd) .task-item-panel {
        background-color: #fcfcfc;
    }
    .task-list-container > [d-task-type]:nth-child(even) .task-item-panel {
        background-color: #f6f6f6;
    }
    .task-item-option {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        white-space: nowrap;
        margin: 4px 6px 0px 0px;
    }
    .task-item-option:last-child {
        margin-right: 0px;
    }
    .task-subgroup-panel {
        border-left: solid 4px #cbb;
        margin: 3px 0px 3px 1px;
        padding: 6px 0px 0px 0px;
    }
    .task-toolbar {
        display: flex;
        margin-top: 4px;
        padding: 3px 0px 3px 0px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
        background-color: rgba(128, 128, 128, 0.1);
    }
    .task-text {
        font-size: 15px;
    }
    .task-text:empty::after {
        content: "<?>";
    }
    .task-text-input {
        width: 100%;
        outline: none;
        border: 1px solid #ddd;
        text-align: center;
        font-size: 15px;
        cursor: text;
    }
    .task-text-input:hover {
        border: 1px solid #0272ce;
    }
    .task-text-input:focus {
        border: 1px solid #40a9ff;
    }
    .task-item-summary {
        padding: 3px 6px;
    }
    .task-item-summary:before {
        content: var(--before);
    }
    .task-item-summary:after {
        content: var(--after);
    }
    .task-item-panel:focus-within {
        background-color: #fff !important;
        box-shadow: 0px 0px 6px rgba(128, 128, 128, 0.6);
        margin: 0px 0px 0px 0px;
        z-index: 900;
    }
    .task-tool-button {
        font-size: 13px;
        height: 20px;
    }
    .task-tool-button + .task-tool-button {
        margin-left: 6px;
    }
    .task-tool-dropdown-button {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        align-content: center;
        border-left: solid 1px #ccc;
        margin-left: 3px;
    }
    .task-item-summary-panel {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        z-index: 700;
        flex-wrap: wrap;
        padding: 0px 3px;
        width: 100%;
    }
    .task-item-summary-panel * {
        font-size: 12px;
    }
</style>

<style>
    .task-item-option-panel {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        z-index: 700;
        flex-wrap: wrap;
        padding: 0px 3px;
        width: 100%;
    }
    .task-item-option-panel * {
        font-size: 12px;
    }
    .task-tool-dropdown-box {
        background-color: #fff;
        box-shadow: 0px 0px 6px rgba(128, 128, 128, 0.6);
        border-radius: 6px;
        padding: 3px 6px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    .task-tool-dropdown-box * {
        padding: 2px 6px;
        color: #666;
        font-size: 13px;
        width: 100%;
        white-space: nowrap;
    }
    .task-tool-dropdown-box > div:hover {
        background: #40a9ff;
        color: #fff;
    }
    .task-tool-dropdown-box > div:active {
        background: #0272ce;
        color: #fff;
    }
    [d-tool-flag="danger"] .task-tool-dropdown-box > div:hover {
        background: #f00;
        color: #fff;
    }
    [d-tool-flag="danger"] .task-tool-dropdown-box > div:active {
        background: #e00;
        color: #fff;
    }
</style>

<script>
import dropDownContainer from './dropDownContainer.vue'
import IconDelete from './svg/iconDelete.vue'
import IconExtend from './svg/iconExtend.vue'
import IconPlus from './svg/iconPlus.vue'
import IconStackPaper from './svg/iconStackPaper.vue'
import editItem from './editItems';

function peekTimeRangeIterator(_arrayItem) {
    if (_arrayItem instanceof Array) {
        _arrayItem.forEach(peekTimeRangeIterator, this);
    } else {
        const start = new Date(_arrayItem.start).getTime();
        const end = new Date(_arrayItem.end).getTime();
        if (this.start > start) {
            this.start = start;
        }
        if (this.end < end) {
            this.end = end;
        }
    }
}

function peekTimeRange(_src) {
    if (_src instanceof Array) {
        const ret = {start: 100000000*24*60*60*1000, end: -100000000*24*60*60*1000};
        _src.forEach(peekTimeRangeIterator, ret);
        return ret;
    } else {
        return { 
            start: new Date(_src.start).getTime(),
            end: new Date(_src.end).getTime()
        };
    }
}

export default {
	components: { dropDownContainer, IconPlus, IconExtend, IconStackPaper, IconDelete, editItem },
    name: "task-list",
    props: {
        list: {
            type: Array,
            required: true
        },
    },
    computed: {
        taskOptions() {
            return this.$Share().$TaskOptions;
        },
        taskSummaryOptions() {
            return this.$Share().$TaskSummaryOptions;
        },
        isTopLevel() {
            return this.$attrs["d-task-group-index"] === undefined;
        }
    },
    data() {
        return {
            showKey: undefined,
            focusElement: undefined
        }
    },
    methods: {
        taskSummaryValue(_item, _option) {
            const key = _option.key;
            const value = (key === undefined) ? _option.value 
                                : (Object.keys(_item).includes(key) ? _item[key] : (this.taskOptions[key] ? this.taskOptions[key].default : ""));
            try {
                let map = _option.valueMap;
                (typeof map === "string") && (map = new Function("value", map));
                return (typeof map === "function") ? map(value)
                            : (map ? map[value] : value);
            } catch {
                return value;
            }
        },
        taskSummaryStyle(_item, _option) {
            const style = {};
            const styleMap = _option.style;
            for (let key in styleMap) {
                const val = styleMap[key];
                style[key] = (val === null ? this.taskSummaryValue(_item, _option) : val);
            }
            return style;
        },
        onChangeValue(_value, _item, _key) {
            _item[_key] = _value;
            let adjustFn = this.taskOptions[_key].adjust;
            (typeof adjustFn === "string") && (adjustFn = new Function("value", "item", adjustFn));
            const adjustTip = (typeof adjustFn === "function") && adjustFn(_value, _item);
            adjustTip && this.$tip(this.$T(adjustTip), "warn");
            this.$Share().$Save();
            this.$forceUpdate();
        },
        onAddTask(_index) {
            const refTime = (_index > 0 ? peekTimeRange(this.list[_index - 1]).end : peekTimeRange(this.list[_index]).start);
            this.list.splice(_index, 0, this.$Share().newTaskByDefault({
                start: refTime,
                end: refTime + 1000 * 60 * 60 * 24
            }));
            this.$Share().$Save();
            this.$forceUpdate();
            this.$nextTick(() => {
                const element = this.$el.querySelector(`:scope > [d-task-type][d-task-sub-index="${_index}"] .task-item-panel`);
                element && element.focus();
            });
        },
        onAddSubTaskGroup(_index) {
            const refTime = (_index > 0 ? peekTimeRange(this.list[_index - 1]).end : peekTimeRange(this.list[_index]).start);
            this.list.splice(_index, 0, [[this.$Share().newTaskByDefault({
                start: refTime,
                end: refTime + 1000 * 60 * 60 * 24
            })]]);
            this.$Share().$Save();
            this.$forceUpdate();
            this.$nextTick(() => {
                const element = this.$el.querySelector(`:scope > [d-task-type="group"][d-task-sub-index="${_index}"] .task-item-panel`);
                element && element.focus();
            });
        },
        onAddSiblingTaskGroup(_list, _index, _groupIndex) {
            const refTime = peekTimeRange(_list).start;
            _list.splice(_index, 0, [this.$Share().newTaskByDefault({
                start: refTime,
                end: refTime + 1000 * 60 * 60 * 24
            })]);
            this.$Share().$Save();
            this.$forceUpdate();
            this.$nextTick(() => {
                const element = this.$el.querySelector(`:scope > [d-task-type="group"][d-task-sub-index="${_groupIndex}"] > .task-subgroup-panel > [d-task-group-index="${_index}"] .task-item-panel`);
                element && element.focus();
            });
        },
        onDelete(_index) {
            if (this.list.length <= 1) {
                if (this.isTopLevel) {
                    this.list[0] = this.$Share().newTaskByDefault();
                    this.$Share().$Save();
                    this.$forceUpdate();
                } else {
                    this.$emit("delete-group");
                }
            } else {
                this.list.splice(_index, 1);
                this.$Share().$Save();
                this.$forceUpdate();
            }
        },
        onDeleteGroup(_list, _index, _groupIndex) {
            if (_list.length <= 1) {
                if (this.isTopLevel && this.list.length <= 1) {
                    this.list[0] = this.$Share().newTaskByDefault();
                } else {
                    this.list.splice(_groupIndex, 1);
                }
            } else {
                _list.splice(_index, 1);
            }
            this.$Share().$Save();
            this.$forceUpdate();
        },
        onFocusIn(_index) {
            this.showKey = _index;
            this.focusElement = this.$el.querySelector(`:scope > [d-task-sub-index="${_index}"] > .task-item-panel`);
        },
        onFocusOut(_event) {
            const relatedTarget = _event.relatedTarget;
            if (!relatedTarget || !(this.focusElement && this.focusElement.contains(relatedTarget))) {
                this.showKey = undefined;
            }
        }
    }
}
</script>