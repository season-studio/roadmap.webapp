<template>
    <component :is="activeView" class="app" :projectIndex="projectIndex"
        @change-view="onChangeView"
        />
</template>

<style>
    .app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin: 0px;
        padding: 0px;
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        background-color: #fff;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Chrome/Safari/Opera */
        -khtml-user-select: none; /* Konqueror */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently not supported by any browser */
        min-width: 360px;
    }
</style>

<script>
import detailEditor from '../../components/detailEditor.vue';
import projectsView from '../../components/projectsView.vue';
import drawView from '../../components/drawView.vue';
import drawResultView from '../../components/drawResultView.vue';
import waitLoadingView from '../../components/waitLoadingView.vue';

import * as OfficeKit from '../../js/officeKit';
import * as BrowserKit from '../../js/browserKit';

const startViewTag = "projectsView";

export default {
	components: { detailEditor, projectsView, drawView, drawResultView, waitLoadingView },
    data() {
        return {
            activeView: waitLoadingView,
            projectIndex: undefined
        }
    },
    methods: {
        onChangeView(_viewTag, _index) {
            this.projectIndex = _index;
            this.activeView = _viewTag;
        },
        async onInit() {
            try {
                const hostKit = (window["$$Office$Addin$$SeasonStudio"] ? OfficeKit : BrowserKit);
                await hostKit.init();
                await this.$Share().$Load();
                const response = await fetch("./templates/options.json");
                if (response.ok) {
                    const json = await response.json();
                    ["$SummaryOptions", "$TaskOptions"].forEach(key => {
                        const target = this.$Share()[key];
                        const source = json[key];
                        if (source) {
                            for (let item in source) {
                                target[item] = source[item];
                            }
                        }
                    });
                    const $TaskSummaryOptions = this.$Share().$TaskSummaryOptions;
                    json.$TaskSummaryOptions && $TaskSummaryOptions.push.apply($TaskSummaryOptions, json.$TaskSummaryOptions);
                }
            } catch (error) {
                this.$tip(this.$T("Fail in initializing"), "error");
                this.$tip(error, {closable: true});
                console.error("Fail in initializing", error);
            }
            this.activeView = startViewTag;
        }
    },
    mounted() {
        this.onInit();
    }
}
</script>