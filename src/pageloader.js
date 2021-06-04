import Vue from "vue";

import "./assets/global.css";

import { i18n, tipkit } from "./toolkits";
import "./toolkits/src/tip/default-style.css";

import ShareData from "./js/shareData";

/*
import { assert } from "../common/assert";
import seasonTip from "./utilities/season-tip";
import config from "./utilities/config";

import "./assets/season-tip-style.css";
*/

export default async function (_mainVueComponent, _opt) {
    // assert(_mainVueComponent, "must assign the main vue component");
    _opt || (_opt = {});

    if (process.env.NODE_ENV === "development") {
        i18n.enableRecord = true;
        window["$i18n"] = i18n;
    }
    Vue.use(i18n, { loader: "./locales/" });
    await i18n.setLocale(navigator.language);
    
    Vue.use(tipkit);
    Vue.use(ShareData);
    Vue.use({
        install(_v) {
            _v.prototype.log = (process.env.NODE_ENV === "development") ? console.log : function () {};
        }
    })

    /*
    await config.load();

    i18n.enableRecord = true;
    window["$i18n"] = i18n;
    Vue.use(i18n, { loader: "/locales/" });
    Vue.use(seasonTip);
    */

    Vue.config.productionTip = false;

    // await i18n.setLocale(String(navigator.language).toLowerCase());

    (typeof _opt.onInitialize === "function") && _opt.onInitialize();

    new Vue({
        render: h => h(_mainVueComponent),
    }).$mount(_opt.domContainer || "#app");
}