const { MongoClient } = require("mongodb");
const url = 'mongodb://localhost:27017/ProjectManagementTool';
const dbName = "teams";
const express = require("express");
const axios = require('axios');
const router = express()
const mongoose = require("mongoose")
const model = require("../adminSchema")
const teamModel = require("../teamSchema")
const inchargeModel = require("../inchargeSchema")
const login = require("../Routes/loginRoutes")

router.post("/create/incharge", async (req, res) => {
    try {
        const duplicate = await inchargeModel.find();
        const duplicateUsers = duplicate.filter(data => (data.Email === req.body.Email && data.AdminName === req.body.AdminName))
        if (duplicateUsers[0]) {
            await res.status(201).json({
                success: false,
                message: "Incharge creation Failed. Email already in Use"
            });

        }
        else {
            const createIncharge = await inchargeModel.create(req.body)
            await res.status(201).json({
                success: true,
                message: "Incharge created successfully",
                data: createIncharge,
            });

        }

    }
    catch (error) {
        await res.status(201).json({
            success: false,
            message: "Incharge creation Failed"
        });

    }
})

router.post("/create/team", async (req, res) => {
    try {
        const duplicate = await teamModel.find();
        const duplicateUsers = duplicate.filter(data => (data.TeamName === req.body.TeamName && data.AdminName === req.body.AdminName))
        if (duplicateUsers[0]) {
            await res.status(201).json({
                success: false,
                message: "Team creation Failed. Email already in Use"
            });

        }
        else {
            const adminMapping = await inchargeModel.find()
            const filteredAdminMapping = await adminMapping.find(data => (data.TeamName !== req.body.TeamName && data.AdminName === req.body.AdminName && data.InchargeName === req.body.InchargeName))
            const adminMappingObject = {
                MemberName: filteredAdminMapping.InchargeName,
                Email: filteredAdminMapping.Email,
                Password: filteredAdminMapping.Password,
                InchargeName: filteredAdminMapping.InchargeName,
                TeamName: req.body.TeamName,
                AdminName: req.body.AdminName,
                Role: "Admin(Me)",
                task: {
                    backlog: [],
                    inProgress: [],
                    completed: []
                }
            }
            const teamCreation = await teamModel.create(req.body)
            const response = await axios.post("http://localhost:8080/admin/create/member", adminMappingObject)
            if (response.data.success) {


                await res.status(201).json({
                    success: true,
                    message: "Team created successfully",
                    data: teamCreation,
                });
            }
        }
    }
    catch (error) {
        await res.status(200).json({
            success: false,
            message: "Team creation Failed",
            status: error
        });
    }
})

router.get("/get/incharge", async (req, res) => {
    try {
        const incharges = await inchargeModel.find();
        await res.status(200).json({
            success: true,
            message: "Incharge fetched Successfully..!",
            incharge_data: incharges,
        });
    }
    catch (err) {
        await res.status(200).json({
            success: false,
            message: "Incharge creation Failed",
            status: err
        });

    }
})
router.get("/get/teamdetails", async (req, res) => {
    try {
        const teamDetails = await teamModel.find();


        await res.status(200).json({
            success: true,
            message: "Team Details fetched Successfully..!",
            incharge_data: teamDetails,
        });
    }
    catch (err) {
        await res.status(200).json({
            success: false,
            message: "Incharge creation Failed",
            status: err
        });

    }
})
router.get("/get/teammembers", async (req, res) => {
    try {
        const teamDetails = await teamModel.find();


        await res.status(200).json({
            success: true,
            message: "Team Details fetched Successfully..!",
            incharge_data: teamDetails,
        });
    }
    catch (err) {
        await res.status(200).json({
            success: false,
            message: "Incharge creation Failed",
            status: err
        });

    }
})

router.patch("/create/member", async (req, res) => {
    const teamData = await teamModel.find()
    const team = await teamData.filter(data => (data.InchargeName === req.body.InchargeName && data.AdminName === req.body.AdminName && data.TeamName === req.body.TeamName))


    const tempMembers = team[0].TeamMembers
    const duplicate = await tempMembers.find(data => data.Email === req.body.Email)
    if (duplicate) {
        res.status(200).json({
            success: false,
            message: "Member with this Mail ID already Exists",
        });
    }

    else {

        try {
            tempMembers.push(req.body)
            await mongoose.connect('mongodb://localhost:27017/ProjectManagementTool', {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            });
            const teamCreation = await teamModel.updateOne({ AdminName: req.body.AdminName, InchargeName: req.body.InchargeName, TeamName: req.body.TeamName }, { $set: { TeamMembers: tempMembers } })
                .then(result => {
                    res.status(201).json({
                        success: true,
                        message: "Member added successfully",
                    });
                })
                .catch(error => {
                    console.error('Error updating user:', error);
                });
        }
        catch (err) {
            res.send(err);

        }
    }


});
router.post("/create/member", async (req, res) => {
    const teamData = await teamModel.find()
    const team = await teamData.filter(data => (data.InchargeName === req.body.InchargeName && data.AdminName === req.body.AdminName && data.TeamName === req.body.TeamName))
    const tempMembers = team[0].TeamMembers
    const duplicate = await tempMembers.find(data => data.Email === req.body.Email)
    if (duplicate) {
        res.status(200).json({
            success: false,
            message: "Member with this Mail ID already Exists",
        });
    }
    else {

        try {
            tempMembers.push(req.body)
            await mongoose.connect('mongodb://localhost:27017/ProjectManagementTool', {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            });
            const teamCreation = await teamModel.updateOne({ AdminName: req.body.AdminName, InchargeName: req.body.InchargeName, TeamName: req.body.TeamName }, { $set: { TeamMembers: tempMembers } })
                .then(result => {
                    res.status(201).json({
                        success: true,
                        message: "Member added successfully",
                    });
                })
                .catch(error => {
                    res.send('Error updating user:', error);
                });
        }
        catch (err) {
            res.send(err);

        }
    }


});

module.exports = router