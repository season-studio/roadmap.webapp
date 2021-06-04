import { ShareData } from "./shareData";
import { tip } from "../toolkits/src/tip";
import { $T } from "../toolkits/src/i18n";

function saveAction() {
    try {
        localStorage.setItem("projectCollection", JSON.stringify(ShareData.projects));
    } catch {
        tip($T("Fail in saving the data"), "error");
    }
}

function loadAction() {
    try {
        const json = localStorage.getItem("projectCollection");
        if (json) {
            const projects = JSON.parse(json);
            if (projects instanceof Array) {
                ShareData.projects = projects;
            }
        }
    } catch {
        tip($T("Fail in saving the data"), "error");
    }
}

export async function init() {
    await $T.setLocale(navigator.language);
    ShareData.initItem("$Save", saveAction);
    ShareData.initItem("$Load", loadAction);
}