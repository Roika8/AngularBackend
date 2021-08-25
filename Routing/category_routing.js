const express = require('express');
const router = express.Router();
const categoryService = require('../Services/category_service');
router.get('/', async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.send(categories);
    }
    catch (e) {
        console.log(e);
        res.status(404).send(e);
    }
})

router.post('/add', async (req, res) => {
    try {
        const response = await categoryService.addNewCategory(req.body.name);
        res.send(response);
    }
    catch (e) {
        console.log(e);
        res.status(404).send(e);
    }

})
router.delete('/delete/:name', async (req, res) => {
    try {
        const response = await categoryService.deleteCategory(req.params.name);
        res.send(response);
    }
    catch (e) {
        console.log(e);
        res.status(404).send(e);
    }
})
module.exports = router;