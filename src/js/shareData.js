export const ShareData = {
    $SummaryOptions: {
        state: {
            type: "select",
            tip: "Project State",
            default: "normal",
            values: [{
                value: "normal",
                tip: "Normal",
                color: "#40a9ff"
            }, {
                value: "warn",
                tip: "Warn",
                color: "red"
            }, { 
                value: "finished",
                tip: "Finished",
                color: "green"
            }, {
                value: "cancelled",
                tip: "Canelled",
                color: "#ccc"
            }, {
                value: "suspend",
                tip: "Suspend",
                color: "#999"
            }]
        },
        image: {
            type: "image",
            tip: "Project Photo",
        }
    },
    $TaskOptions: {
        start: {
            type: "date",
            tip: "Start Date",
            default: new Date(),
            adjust(_value, _item) {
                if ((new Date(_item.end).getTime() - new Date(_value).getTime()) < 1000 * 60 * 60 * 24) {
                    _item.end = new Date(new Date(_item.start).getTime() + 1000 * 60 * 60 * 24);
                    return "The end date must be one day later then the start date at least";
                }
            }
        },
        end: {
            type: "date",
            tip: "End Date",
            default: new Date(Date.now() + 1000 * 60 * 60 * 24),
            adjust(_value, _item) {
                if ((new Date(_value).getTime() - new Date(_item.start).getTime()) < 1000 * 60 * 60 * 24) {
                    _item.end = new Date(new Date(_item.start).getTime() + 1000 * 60 * 60 * 24);
                    return "The end date must be one day later then the start date at least";
                }
            }
        },
        state: {
            type: "select",
            tip: "State",
            default: "",
            values: [{
                value: "",
                tip: "Standby",
                color: "#ccc"
            },{
                value: "normal",
                tip: "Normal",
                color: "#40a9ff"
            }, {
                value: "delay",
                tip: "Delay",
                color: "red"
            }, { 
                value: "finish",
                tip: "Finish",
                color: "green"
            }]
        },
        progress: {
            type: "percent",
            tip: "Progress",
            default: 0,
            adjust(_value, _item) {
                if (_value < 0) {
                    _item.progress = 0;
                    return "The progress can not be less than 0";
                } else if (_value > 100) {
                    _item.progress = 100;
                    return "The progress can not be greater than 100";
                }
            }
        },
        /* mileStone: {
            type: "switch",
            tip: "Milestone",
            default: false
        } */
    },
    $TaskSummaryOptions: [{
        key: "state",
        valueMap: {
            undefined: "#ccc",
            "": "#ccc",
            "normal": "#40a9ff",
            "delay": "red",
            "finish": "green"
        },
        style: {
            width: "20px",
            height: "16px",
            border: "solid 1px #fff",
            paddingRight: "16px",
            backgroundColor: null
        }
    }, {
        key: "start",
        valueMap(_val) {
            const date = new Date(_val);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${date.getFullYear()}-${month < 10 ? ("0" + month) : month}-${day < 10 ? ("0" + day) : day}`;
        },
        textContent: true,
        style: {
            "--before": '"["',
        }
    }, {
        value: "~",
        textContent: true,
        style: {
            padding: "0px"
        }
    }, {
        key: "end",
        valueMap(_val) {
            const date = new Date(_val);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${date.getFullYear()}-${month < 10 ? ("0" + month) : month}-${day < 10 ? ("0" + day) : day}`;
        },
        textContent: true,
        style: {
            "--after": '"]"'
        }
    }, {
        key: "progress",
        textContent: true,
        style: {
            "--after": '"%"'
        }
    }],
    projects: [{
        caption: "Sample 1",
        state: "normal",
        image: "./logo.png",
        items: [
            { text: "DR1", start: "2021/01/10", end: "2021/01/20", state: "finish", progress: 100 }, 
            { text: "DR2", start: "2021/01/20", end: "2021/02/01", state: "finish", progress: 100 }, 
            { text: "DR3", start: "2021/02/01", end: "2021/04/15", state: "normal", progress: 50 }, 
            [
                [
                    { text: "DR4", start: "2021/04/15", end: "2021/04/30", state: "", progress: 10 }, 
                    { text: "DR5", start: "2021/05/07", end: "2021/06/10", state: "" },
                    { text: "DR6", start: "2021/06/10", end: "2021/07/05", state: "" }
                ],
                [
                    { text: "tender", start: "2021/06/24", end: "2021/06/26", state: "" },
                    { text: "experimental", start: "2021/06/30", end: "2021/08/17", state: "" }
                ]
            ],
            { text: "be online", start: "2021/09/01", end: "2021/09/02", state: "" }
        ]
    }, {
        caption: "Sample 2",
        state: "warn",
        image: "./logo.png",
        items: [
            { text: "DR1", start: "2021/03/08", end: "2021/03/30", state: "finish", progress: 100 },
            { text: "DR2", start: "2021/03/30", end: "2021/04/10", state: "finish", progress: 100 },
            { text: "DR3", start: "2021/04/10", end: "2021/05/26", state: "delay", progress: 20 },
            { text: "DR4", start: "2021/06/01", end: "2021/06/15", state: "", progress: 0 },
            [
                [
                    { text: "DR5", start: "2021/06/17", end: "2021/07/15", state: "", progress: 0 },
                    { text: "DR6", start: "2021/07/20", end: "2021/08/10", state: "", progress: 0 }
                ],
                { text: "DEMO", start: "2021/06/26", end: "2021/07/07", state: "", progress: 0 }
            ]
        ]
    }]
};

Object.defineProperties(ShareData, {
    initItem: {
        value: function (_name, _value) {
            (!Object.keys(this).includes(_name)) && (this[_name] = _value);
        },
        writable: false,
        enumerable: false,
        configurable: false
    },
    newTaskByDefault: {
        value: function(_opt) {
            const newTask = { text:"" };
            const taskOptions = ShareData.$TaskOptions;
            for (let key in taskOptions) {
                newTask[key] = taskOptions[key].default;
            }
            Object.assign(newTask, _opt);
            return newTask;
        },
        writable: false,
        enumerable: false,
        configurable: false
    },
});

export default {
    install(Vue) {
        if (!Vue) return;

        Vue.prototype.$Share = () => ShareData;
    }
};
