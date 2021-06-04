import { ShareData } from "./shareData";
import { tip } from "../toolkits/src/tip";
import { $T } from "../toolkits/src/i18n";

function insertAction(_data) {
    return new Promise(r => {
        try {
            const dataPos = _data.image.indexOf("base64,");
            const imageData = _data.image.substr(dataPos + 7);
            Office.context.document.setSelectedDataAsync(imageData, {
                coercionType: Office.CoercionType.Image,
                // imageWidth: _data.width,
                // imageHeight: _data.height
            }, ar => r((ar.status === Office.AsyncResultStatus.Failed) ? ar.error.message : undefined));
        } catch (error) {
            r(error);
        }
    });
}

let saveTimerID = undefined;
const saveTimerInterval = 3000;

function onSaveTimer() {
    Office.context.document.settings.saveAsync(ar => {
        if (ar.status === Office.AsyncResultStatus.Failed) {
            tip($T("Fail in saving the data"), "error");
            saveTimerID = setTimeout(onSaveTimer, saveTimerInterval);
        } else {
            saveTimerID = undefined;
        }
    });
}

function saveAction(_immedidately) {
    try {
        Office.context.document.settings.set("projectCollection", ShareData.projects);
        if (_immedidately) {
            saveTimerID && clearTimeout(saveTimerID);
            saveTimerID = setTimeout(onSaveTimer, 0);
        } else {
            (saveTimerID === undefined) && (saveTimerID = setTimeout(onSaveTimer, saveTimerInterval));
        }
    } catch {
        tip($T("Fail in saving the data"), "error");
    }
}

function loadAction() {
    return new Promise(r => {
        try {
            Office.context.document.settings.refreshAsync(ar => {
                if (ar.status !== Office.AsyncResultStatus.Failed) {
                    const projects = Office.context.document.settings.get("projectCollection");
                    if (projects instanceof Array) {
                        ShareData.projects = projects;
                    }
                }
                r(ar.status);
            });
        } catch(error) {
            r(error);
        }
    });
}

function checkOfficeReady() {
    const checker = function (resolve) {
        Office ? Office.onReady(resolve) : setTimeout(checker, 500, resolve);
    }
    return new Promise(checker);
}

export async function init() {
    await checkOfficeReady();
    await $T.setLocale(Office.context.displayLanguage);
    ShareData.initItem("$Insert", insertAction);
    ShareData.initItem("$Save", saveAction);
    ShareData.initItem("$Load", loadAction);
}