const express = require('express');
const userService = require('../Services/user_service');
const router = express.Router();
router.post('/set', (req, res) => {
    try {
        userService.setUserDetails(req.body);
        res.status(202).send('Data Set');
    }
    catch (e) {
        console.log(e);
        res.status(404).send(e);
    }
})
router.get('/firstTime', async (req, res) => {
    try {
        const isFirstTime = await userService.isUserFirstTime();
        res.send(isFirstTime);
    }
    catch (e) {
        res.status(404).send(e);
    }
})
router.get('/', async (req, res) => {
    try {
        const data = await userService.getUserDetails();
        res.send(data);
    }
    catch (e) {
        res.status(404).send(e);
    }
})
module.exports = router;