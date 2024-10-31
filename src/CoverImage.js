const sharp = require("sharp");
const path = require('path');
const fs = require('fs');
const { getFileMetadata } = require("./util/ImageUtil");
const { getTxt,getTemp1 } = require("./util/TemplateUtil");


const setTags = (files = [], complete) => {
    let fetch = files.map(file => new Promise((resolve, reject) => {
        try {
            getFileMetadata(file.path || "").then(async (metadata) => {
                file.tags = metadata;
                resolve(metadata)
            })
        } catch (e) {
            reject(e);
        }
    }));
    Promise.all(fetch).then(value => {
        complete(files)
    })
}


async function addOnImage(file, callback) {
    console.debug("=====================addTextOnImage");
    // console.debug(file);
    // return;


    const metadata = file.tags;
    file.metadata = file.tags;

    const url = file.path || ""
    if (!metadata.ImageWidth) {
        return;
    }

    try {
        getTemp1(file).then(({buff, divHeight = 0, divWidth = 0}) => {
            sharp({
                create: {
                    width: file.metadata.ImageWidth,
                    height: file.metadata.ImageHeight + divHeight,
                    channels: 3,
                    background: { r: 255, g: 255, b: 255, alpha: 1 }
                }
            }).composite([
                { input: file.path, gravity: 'northwest' },
                { input: buff, gravity: 'southeast', top: file.metadata.ImageHeight, left: 0 },
            ]).jpeg({}).toBuffer().then((data) => {
                let h = file.metadata.ImageHeight + divHeight;
                let w = divWidth;
                /*if (divWidth > 4000) {
                    w = 4000
                } else */if (divWidth > 2000) {
                    w = 2000
                } else if (divWidth > 1080) {
                    w = 1080
                }
                console.log(`(divHeight=${h}/1080)=` + (h / 1080));
                sharp(data).resize(w, undefined).jpeg({quality: 60,}).toFile(file.path + '.combined.jpg').then(r => {
                    callback(file.path + '.combined.jpg')
                });
            });
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    coverImage: addOnImage,
    setTags,
}