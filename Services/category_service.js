const fs = require('fs');

const getAllCategories = () => {
    return new Promise((res, rej) => {
        fs.readFile('Categories/categoriesList', async (err, file) => {
            if (err)
                res(undefined)
            if (file) {
                if (file.length > 0) {
                    const categories = JSON.parse(file);
                    res(categories)
                }
                else res('')
            }
            else
                res(undefined)

        })

    })
}
const addNewCategory = async (name) => {
    try {
        let allCategories = await getAllCategories();
        let lastID;
        if (allCategories) {
            lastID = allCategories.length + 1;
            const foundCategory = allCategories.find(category => category.name === name);
            if (foundCategory) {
                return false
            }
        }
        else {
            lastID = 1
            allCategories = []
        }
        //Get the categories as array and push new category
        allCategories.push({ id: lastID, name: name })
        if (name) {
            fs.writeFile('Categories/categoriesList', JSON.stringify(allCategories), function (err) {
                if (err)
                    console.log('This is error' + err);
            })
            return true;
        }
    }
    catch (e) {
        console.log(e);
    }
}
const deleteCategory = async (name) => {
    try {
        let allCategories = await getAllCategories();
        const foundCategory = allCategories.find(category => category.name === name);
        if (foundCategory) {
            const filterdCategories = allCategories.filter(category => category.id !== foundCategory.id);
            fs.writeFile('Categories/categoriesList', JSON.stringify(filterdCategories), function (err) {
                if (err)
                    console.log('This is error' + err);
            })
            console.log(filterdCategories);
            return true
        }
        else {
            return false
        }
    }
    catch (e) {
        console.log(e);
    }
}
module.exports = { getAllCategories, addNewCategory, deleteCategory }