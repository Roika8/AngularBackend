const fs = require('fs');
const path = require('path');

decodeBase64Image = async (base64url) => {
    const matches = base64url.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};
    if (matches == null || matches.length !== 3) {
        throw new Error('Invalid input string');
    }
    response.type = (String(matches[1]).split('/')[1]);
    response.data = (Buffer.from(matches[2], 'base64'));
    return response;
}
const getFileContent = (directory, file) => {
    return new Promise((res, rej) => {
        fs.readFile(directory + "/" + file, async (err, content) => {
            if (err) {
                return console.log(err);
            }
            let contentAsJson = JSON.parse(content)
            contentAsJson.imageUrl = await getImageByPath(contentAsJson.imagePath);
            res(contentAsJson);
        })
    });
}
const getImageByPath = async (imagePath) => {
    return new Promise((res, rej) => {
        fs.readFile(imagePath, { encoding: 'base64' }, (err, file) => {
            if (err) {
                rej('Invalid images')
            }
            else {
                res(file);
            }
        })
    })
}
const saveImage = async (imageUrl) => {
    try {
        //Convert to base 64
        let imageBuffer = await decodeBase64Image(imageUrl);
        //Set the image path as the datetime (ID) with type
        const path = `Images/${new Date().getTime()}.${imageBuffer.type}`;
        fs.writeFile(path, imageBuffer.data, 'binary', function (err) {
            if (err) {
                console.log('This is error' + err);
                return undefined;
            }
        })
        return path;
    }
    catch (e) {
        throw new Error(e);
    }
}
const saveImageDetails = (details, imagePath) => {
    const imageName = imagePath.split('/')[1].split('.')[0];
    details.imagePath = imagePath;
    details.imageID = imageName;
    delete details.imageUrl;
    fs.writeFile(`ImagesDetails/${imageName}`, JSON.stringify(details), (err) => {
        if (err) {
            throw new Error(err);
        }
    })
    return details;
}

const getAllImages = async (isFavorite, isPrivate) => {
    const directory = 'imagesDetails'
    return new Promise((res, rej) => {
        let data = {};
        fs.readdir(directory, async (err, files) => {
            if (files.length === 0) res(data)
            const filesCount = files.length;
            let counter = 0;
            files.forEach(async (file) => {
                const content = await getFileContent(directory, file);
                //Get all favorite public images
                if (isFavorite && !isPrivate) {
                    if (content.isFavorite && !content.isPrivate) {
                        data[file] = content;
                    }
                }
                if (isFavorite && isPrivate) {
                    if (content.isFavorite && content.isPrivate) {
                        data[file] = content;
                    }
                }
                if (!isFavorite && isPrivate) {
                    if (!content.isFavorite && content.isPrivate) {
                        data[file] = content;
                    }
                }
                if (!isFavorite && !isPrivate) {
                    if (!content.isFavorite && !content.isPrivate) {
                        data[file] = content;
                    }
                }

                counter++;
                if (counter == filesCount) {
                    res(data);
                }
            }
            );
        })
    })
}

const updateImage = async (imageDetails, imageID) => {
    const directory = 'imagesDetails'
    const imageContent = await new Promise((res, rej) => {
        fs.readFile(`${directory}/${imageID}`, async (err, file) => {
            if (!err) {
                let content = JSON.parse(file);
                content.isFavorite = imageDetails.isFavorite;
                content.isPrivate = imageDetails.isPrivate;
                content.category = imageDetails.category;
                content.title = imageDetails.title;
                content.location = imageDetails.location;
                content.description = imageDetails.description;
                res(content);
            }
            if (err) {
                rej(err);
            }
        })
    })
    fs.writeFile(`${directory}/${imageID}`, JSON.stringify(imageContent), (err) => {
        if (err)
            console.log(err);
    })
}


module.exports = { saveImage, saveImageDetails, getAllImages, updateImage };