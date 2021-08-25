const express = require('express');
const imageService = require('../Services/Image_service');
const router = express.Router();

router.get('/public', async (req, res) => {
    try {
        const nonFavoritePublic = await imageService.getAllImages(false, false);
        const favoritePublic = await imageService.getAllImages(true, false);
        const data = { ...nonFavoritePublic, ...favoritePublic }
        res.send(data);
    }
    catch (e) {
        console.log(e);
        res.status(404).send(e);
    }
})
router.get('/private', async (req, res) => {
    try {
        const FavoritePrivate = await imageService.getAllImages(true, true);
        const nonFavoritePrivate = await imageService.getAllImages(false, true);
        const data = { ...nonFavoritePrivate, ...FavoritePrivate }
        res.send(data);
    }
    catch (e) {
        console.log(e);
        res.status(404).send(e);
    }
})
router.get('/favorite-private', async (req, res) => {
    try {
        const data = await imageService.getAllImages(true, true);
        res.send(data);
    }
    catch (e) {
        console.log(e);
        res.status(404).send(e);
    }
})
router.get('/favorite-public', async (req, res) => {
    try {
        const data = await imageService.getAllImages(true, false);
        res.send(data);
    }
    catch (e) {
        console.log(e);
        res.status(404).send(e);
    }
})


router.post('/add-image', async (req, res) => {
    try {
        const imagePath = await imageService.saveImage(req.body.imageUrl);
        if (imagePath) {
            imageService.saveImageDetails(req.body, imagePath);
            res.send(req.body);
        }
        else
            throw new Error('Invalid image')

    }
    catch (e) {
        console.log(e);
        res.status(404).send(e);
    }
})
router.put('/edit-image', async (req, res) => {
    try {
        imageService.updateImage(req.body, req.body.id)
        res.send(req.body);
    }
    catch (e) {
        console.log(e);
        res.status(404).send(e);
    }
})
module.exports = router;