const glob = require("glob");
const fs = require("fs");
const path = require("path");
const homedir = require('os').homedir();

//配置pages多页面获取当前文件夹下的html和js
function getPages(..._paths) {
    const pages = {};

    for (let pathItem of _paths) {
        glob.sync(`${pathItem}/*/`).forEach(item => {
            const itemName = item.split("/").splice(-2)[0];
            const entry = `${item}index.js`;
            if (fs.existsSync(entry)) {
                const template = `${item}index.html`;
                pages[itemName] = fs.existsSync(template) ? {
                    entry,
                    template,
                    filename: `${itemName}.html`
                } : {
                    entry,
                    filename: `${itemName}.html`
                }
            }
        });
    }
    
    const pagesTip = ["\x1b[44;37m PAGES \x1b[0m"];
    for (let item in pages) {
        pagesTip.push("\x1b[32m " + item + " \x1b[0m");
    }
    console.log.apply(console, pagesTip);
    console.log();

    return pages;
}

const pages = getPages("./src/pages");

module.exports = {
    publicPath: "./",
    pages,
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            extraResources: [
                "public/splash.html"
            ],
            outputDir: '.dist',
            electronDownload: {
                arch: "x86"
            },
            builderOptions: {
                win: {
                    icon: "main.ico",
                    target: [{
                        "target": "nsis",
                        "arch": [ 
                            "ia32"
                        ]
                    }]
                },
                nsis: {
                    "oneClick": false,
                    "allowToChangeInstallationDirectory": true,
                }
            }
        }
    },
    devServer: {
        port: 3000,
        https: true,
        key: fs.readFileSync(path.resolve(`${homedir}/.office-addin-dev-certs/localhost.key`)),
        cert: fs.readFileSync(path.resolve(`${homedir}/.office-addin-dev-certs/localhost.crt`)),
        ca: fs.readFileSync(path.resolve(`${homedir}/.office-addin-dev-certs/ca.crt`)),
        transportMode: 'ws'
    }
}