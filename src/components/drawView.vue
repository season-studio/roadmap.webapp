<template>
    <div class="draw-view-panel">
        {{$T("Select a Template")}}
        <div class="draw-view-container">
            <!-- {{projectIndex}} -->
            <div v-if="templateList === undefined">
                <p style="margin-bottom: 6px">
                    <loader-animate d-style-background="80px/80px url('./logo.png')" d-style-width="7px" d-style-height="80px" />
                </p>
                <p>{{$T("Loading")}}...</p>
            </div>
            <div v-else v-for="(item, index) in templateList" :key="index" class="template-item" :d-template-desc="item.desc" @click="onSelect(item)">
                <div class="template-thumb" :style="{backgroundImage: `url('${item.thumb || 'logo.png'}')`}"></div>
                <div class="template-name">{{item.name}}</div>
            </div>
        </div>
        <div class="tool-button draw-return-button" @click="onReturn">
            <icon-return width="16" height="16" />
            {{$T("Return")}}
        </div>
    </div>
</template>

<style scoped>
    .draw-view-panel {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        background-color: #eee;
        padding: 6px;
    }
    .draw-return-button {
        position: absolute;
        top: 5px;
        left: 0px;
        height: 22px;
        padding: 3px;
    }
    .draw-view-container {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        padding: 6px;
        margin: 6px 0px 0px;
        background-color: #fff;
        border-radius: 6px;
        overflow: auto;
    }
    .template-item {
        position: relative;
        padding: 3px;
        margin: 3px;
        border: solid 3px transparent;
        border-radius: 6px;
        background-color: #fff;
        box-shadow: 0px 0px 2px #aaa;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    .template-item:hover {
        box-shadow: 0px 0px 6px #40a9ff;
    }
    .template-item:active {
        border: solid 3px #40a9ff;
    }
    .template-thumb {
        width: 100px;
        height: 75px;
        background-size: auto 100%;
        background-repeat: no-repeat;
    }
    .template-name {
        padding: 6px 0px;
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100px;
    }
    .template-item:hover::after {
        content: attr(d-template-desc);
        position: absolute;
        bottom: -7px;
        left: 50%;
        transform: translate(-50%, 100%);
        border: solid 0.5px #aaa;
        background-color: rgba(255, 255, 210, 0.9);
        color: #666;
        font-size: 10px;
        padding: 2px;
        min-width: 130px;
        white-space: normal;
    }
</style>

<script>
import loaderAnimate from './loaderAnimate.vue'
import IconReturn from './svg/iconReturn.vue';
export default {
	components: { loaderAnimate, IconReturn },
    props: {
        projectIndex: [Array, Number]
    },
    data() {
        return {
            templateList: undefined
        }
    },
    methods: {
        onSelect(_template) {
            this.$emit("change-view", "drawResultView", {
                projects: this.projectIndex,
                templateURL: _template.url
            });
        },
        onReturn() {
            this.$emit("change-view", "projectsView", this.projectIndex);
        }
    },
    mounted() {
        this.$nextTick(() => 
            fetch("./templates/list.json")
                .then(response => response.json())
                .then(json => this.templateList = json)
                .catch((reason) => {
                    console.error("[Fail in fetch template list]", reason);
                    this.$tip(this.$T("Fail in loading the templates"), {
                        type: "error",
                        closable: true,
                        onclose: () => {
                            this.$emit("change-view", "projectsView", this.projectIndex);
                        }
                    })
                }),
        );
    }
}
</script>