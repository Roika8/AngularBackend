const fs = require('fs');
const path = require('path')
const setUserDetails = async (data) => {
    getUserDetails()
        //Update
        .then(() => {
            fs.writeFile('./user-data/userDataJson', JSON.stringify(data), (err) => {
                if (err) {
                    console.log(err);
                }
            })
        })
        //Create if not exist
        .catch(() => fs.writeFile('./user-data/userDataJson', JSON.stringify(data), (err) => {
            if (err) {
                console.log(err);
            }
        }));
}
const getUserDetails = async () => {
    return new Promise((res, rej) =>
        fs.readFile('user-data/userDataJson', async (err, data) => {
            if (err) {
                rej(err)
            }
            else {
                res(JSON.parse(data));
            }
        })
    )

}
const isUserFirstTime = async () => {
    try {
        const res = await getUserDetails();
        //If res exist, its not user first time
        return res ? false : true;
    }
    catch (e) {
        return true;
    }
}
module.exports = { setUserDetails, getUserDetails, isUserFirstTime }