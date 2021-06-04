<template>
    <div class="draw-result-background">
        <div v-if="image===undefined" class="draw-result-panel draw-result-wait-panel">
            <loader-animate d-style-background="80px/80px url('./logo.png')" d-style-width="7px" d-style-height="80px" />
            <div>{{$T(workTip)}}...</div>
        </div>
        <div v-else class="draw-result-panel">
            <div class="draw-result-toolbar-top">
                <div class="draw-prime-year">
                    {{$T("Prime Year")}}:
                    <input type="number" v-model="currentPrimeYear" />
                </div>
                <div class="draw-fixed-size" @click="onFixedSize">
                    <icon-fixed-size witdh="20" height="20" />
                </div>
            </div>
            <div class="draw-result-container" @mousewheel="onZoomWheel" :style="containerStyle" ref="container">
                <div class="draw-result" :style="resultStyle"></div>
            </div>
        </div>
        <div v-if="image" class="draw-result-toolbar-bottom">
            <div class="tool-button draw-result-tool-button" @click="onReturn">
                <icon-return width="16" height="16" />
                {{$T("Return")}}
            </div>
            <div class="tool-button draw-result-tool-button" @click="onSave">
                <icon-download width="16" height="16" />
                {{$T($Share().$Insert ? "Insert" : "Save")}}
            </div>
            <div class="tool-button draw-result-tool-button" d-tool-flag="danger" @click="onClose">
                <icon-exit width="16" height="16" />
                {{$T("Close")}}
            </div>
        </div>
        <div class="draw-work-frame" ref="workFrame"></div>
    </div>
</template>

<style scoped>
    .draw-result-background {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        background-color: #eee;
        z-index: 100;
    }
    .draw-result-panel {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        padding: 6px;
        margin: 6px;
        background-color: #fff;
        border-radius: 6px;
        overflow: auto;
        z-index: 101;
    }
    .draw-result-wait-panel {
        justify-content: center !important;
        align-items: center !important;
    }
    .draw-result-container {
        /* --width: calc(100vw - 46px);
        width: var(--width);
        height: calc(var(--width) * 3 / 4); */
        flex-grow: 1;
        border: solid 1px #ccc;
        overflow: auto;
        display: inline-grid;
        justify-content: center;
        align-items: center;
    }
    .draw-result-toolbar-top {
        padding: 0px 6px 6px 6px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .draw-prime-year * {
        font-size: 15px;
        outline: none;
    }
    .draw-prime-year > input {
        border: solid 1px #ccc;
        width: 60px;
        cursor: text;
    }
    .draw-result-toolbar-bottom {
        padding: 0px 0px 6px 0px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .draw-result {
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
    }
    .draw-fixed-size {
        padding: 1px;
        width: 24px;
        height: 24px;
        border-radius: 3px;
        border: solid 1px transparent;
        background-color: rgba(255, 255, 255, 0.3);
        box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
        stroke: rgba(0, 0, 0, 0.6);
        z-index: 102;
    }
    .draw-fixed-size:hover {
        background-color: rgba(255, 255, 255, 0.6);
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.3);
        stroke: #008cff;
    }
    .draw-fixed-size:active {
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0px 0px 6px #008cff;
        stroke: #008cff;
        border: solid 1px #008cff;
    }
    .draw-result-tool-button {
        height: 26px;
        padding: 3px 6px;
    }
    .draw-work-frame {
        z-index: -1;
        position: absolute;
        padding: 1px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    }
</style>

<script>
import LoaderAnimate from './loaderAnimate.vue';
import IconDownload from './svg/iconDownload.vue';
import IconExit from './svg/iconExit.vue';
import iconFixedSize from './svg/iconFixedSize.vue';
import IconReturn from './svg/iconReturn.vue';
import JSZip from "jszip";
import Roadmap from "../../../roadmap.svg.js";
import { dynInvokeLink } from "../toolkits/src/domKits";

export default {
	components: { iconFixedSize, IconReturn, IconDownload, IconExit, LoaderAnimate },
    props: {
        projectIndex: {
            type: Object,
            required: true
        }
    },
    computed: {
        resultSize() {
            return {
                width: this.imageWidth * this.ratio / 10 - 2,
                height: this.imageHeight * this.ratio / 10 - 2
            };
        },
        resultStyle() {
            const { width, height } = this.resultSize;
            return {
                backgroundImage: `url("${this.image}")`,
                width: `${width}px`,
                height: `${height}px`
            }
        },
        containerStyle() {
            const { width:resultWidth, height:resultHeight } = this.resultSize;
            const containerStyle = {};
            const container = this.$refs.container;
            if (container) {
                const { width, height } = container.getClientRects()[0];
                (resultWidth >= width) && (containerStyle.justifyContent = "unset");
                (resultHeight >= height) && (containerStyle.alignItems = "unset");
            }
            return containerStyle;
        }
    },
    data() {
        return {
            workTip: "",
            image: undefined,
            imageWidth: 200,
            imageHeight: 200,
            ratio: 10,
            currentPrimeYear: 2021
        }
    },
    watch: {
        currentPrimeYear(_val) {
            this.processDrawing(_val);
        }
    },
    mounted() {
        this.processDrawing();
    },
    methods: {
        processDrawing(_primeYear) {
            console.log(`Using roadmap.svg.js = ${Roadmap.VERSION}_${Roadmap.STAMP}`);
            this.image = undefined;
            this.workTip = "Loading template";
            fetch(this.projectIndex.templateURL)
                .then(response => response.blob())
                .then(blob => this.parseRtpx(blob))
                .then(() => setTimeout(() => this.drawRoadmap(_primeYear), 0))
                .catch(reason => this.showError("Fail in loading the template", reason));
        },
        async parseRtpx(_blob) {
            try {
                this.workTip = "Parsing template";
                const workFrame = this.$refs.workFrame;
                const zip = await (new JSZip()).loadAsync(_blob);
                const templateXML = await zip.file("template.svg").async("string");
                workFrame.innerHTML = "";
                workFrame.insertAdjacentHTML("afterbegin", templateXML);
            } catch (error) {
                this.showError("Fail in parsing template", error);
            }
        },
        async drawRoadmap(_primeYear) {
            try {
                this.workTip = "Drawing roadmap";
                const workFrame = this.$refs.workFrame;
                const templateSVG = workFrame.querySelector("svg");
                const roadmap = new Roadmap(workFrame, templateSVG);
                const projects = [];
                this.projectIndex.projects.forEach(projectIndex => projects.push(this.$Share().projects[projectIndex]));
                (_primeYear === undefined) && (_primeYear = Roadmap.inferPrimeYear.apply(Roadmap, projects));
                (this.currentPrimeYear != _primeYear) && (this.currentPrimeYear = _primeYear);
                roadmap.setPrimeDate(`${_primeYear}/01/01`);
                roadmap.showProjects(projects);
                const imageData = await roadmap.toImageData();
                this.imageWidth = imageData.width;
                this.imageHeight = imageData.height;
                this.image = imageData.data;
                this.ratio = 10;
                setTimeout(() => this.onFixedSize(), 0);
            } catch (error) {
                this.showError("Fail in drawing roadmap", error);
            }
        },
        showError(_tip, _detail) {
            console.error(_tip, _detail);
            this.$tip(this.$T(_tip), {
                type: "error",
                closable: true,
                onclose: () => this.onReturn()
            });
        },
        onZoomWheel(_e) {
            if (_e.deltaY > 0) {
                (this.ratio >= 2) && (this.ratio -= 1);
            } else if (_e.deltaY < 0) {
                (this.ratio < 20) && (this.ratio += 1);
            }
        },
        onFixedSize() {
            const container = this.$refs.container;
            if (container) {
                const { width, height } = container.getClientRects()[0];
                let ratio = ((width / height) > (this.imageWidth / this.imageHeight)) 
                                ? (height / this.imageHeight)
                                : (width / this.imageWidth);
                ratio = ratio * 10;
                this.ratio = (ratio === this.ratio) ? 10 : ratio;
            }
        },
        onReturn() {
            this.$emit("change-view", "drawView", this.projectIndex.projects);
        },
        onClose() {
            this.$emit("change-view", "projectsView");
        },
        async onSave() {
            try {
                const insertFn = this.$Share().$Insert;
                const ret = await ((typeof insertFn === "function") ? insertFn({ 
                    image: this.image, 
                    width: this.imageWidth, 
                    height: this.imageHeight
                }) : dynInvokeLink(this.image, { download: "roadmap.png" }));
                ret && this.showError("Fail in saving image", ret);
            } catch (error) {
                this.showError("Fail in saving", error);
            }
        }
    }
}
</script>