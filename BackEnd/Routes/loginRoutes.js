const express = require("express")
const router = express()
const model = require("../adminSchema")
const teamModel = require("../teamSchema")


router.post("/admin", async (req, res) => {
    const email = req.body.Email;
    const password = req.body.Password
    const users = await model.find();
    const user = await users.filter(data => ((data.Email === email) && (data.Password === password)))
    if (user.length > 0) {
        res.send(user[0])
    }
    else {
        res.status(404).json({
            success: false,
            message: "No user Found"
        });
    }
})
router.post("/member", async (req, res) => {
    const memberLogin =  await teamModel.find();
    const teamsFilter = await memberLogin.filter(data => (data.AdminName===req.body.AdminName && data.TeamName === req.body.TeamName))
    try{
        const memberFilter = await teamsFilter[0].TeamMembers.find(data => (data.AdminName===req.body.AdminName && data.TeamName === req.body.TeamName && data.Password===req.body.Password))
        if(memberFilter && memberFilter.AdminName===req.body.AdminName && memberFilter.TeamName === req.body.TeamName && memberFilter.Password === req.body.Password)
            {
                res.status(200).json({
                    success: true,
                    message: "Login Success",
                    data : memberFilter
                });
            }
            else{
                res.status(404).json({
                    success: false,
                    message: "No user Found"
                });
            }
    }
    catch(error){
        res.status(200).json({
            success: false,
            message: "No user Found",
            data : error
        });
        
    }

})

module.exports = router