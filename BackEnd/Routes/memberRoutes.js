const { MongoClient } = require("mongodb");
const url = 'mongodb://localhost:27017/ProjectManagementTool';
const dbName = "teams";
const express = require("express");
const router = express()
const mongoose = require("mongoose")
const model = require("../adminSchema")
const teamModel = require("../teamSchema")
const login = require("../Routes/loginRoutes");
const admin = require("../Routes/adminRoutes");
const member = require("../Routes/memberRoutes")

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
router.get("/get/allteammembers/:AdminName/:TeamName/:InchargeName", async (req, res) => {
    
    try {
        const teamDetails = await teamModel.find();
        const filteredTeam = await teamDetails.find(data =>(req.params.TeamName=== data.TeamName && req.params.AdminName === data.AdminName && data.InchargeName === req.params.InchargeName))
        await res.status(200).json({
            success: true,
            message: "Team Details fetched Successfully..!",
            incharge_data: filteredTeam,
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

router.post("/add/task",async(req,res)=>{
    const teams = await teamModel.find();
    const filterTeam =  await teams.find(data =>(data.TeamName === req.body.TeamDetails.TeamName && data.InchargeName === req.body.TeamDetails.InchargeName && data.TeamMembers.AdminName === req.body.AdminName))
    const filteredMember = await filterTeam.TeamMembers.find(data => (req.body.MemberName === data.Email))
    const finalFilter = await filterTeam.TeamMembers.filter(data =>{
        if(data.Email === req.body.MemberName){
            return (filteredMember.task.backlog).push({
                TaskName: req.body.TaskName,
                TaskDescription : req.body.TaskDescription,
            })
        }
        return data
    })
    try {

        await mongoose.connect('mongodb://localhost:27017/ProjectManagementTool', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        const teamCreation = await teamModel.updateOne({ AdminName: req.body.TeamDetails.AdminName,InchargeName:req.body.TeamDetails.InchargeName,AdminName:req.body.TeamDetails.AdminName}, { $set: { TeamMembers: finalFilter } })
            .then(result => {
                res.status(201).json({
                    success: true,
                    message: "Task added successfully",
                });
            })
            .catch(error => {
                console.error('Error updating user:', error);
            });
    }
    catch (err) {
        res.send(err);

    }
})

router.post("/update/task",async(req,res)=>{
    const teams = await teamModel.find();
    const filterTeam =  await teams.find(data =>(data.TeamName === req.body?.TeamDetails?.TeamName && data.InchargeName === req.body?.TeamDetails?.InchargeName && data.TeamMembers.AdminName === req.body?.AdminName))
    const filteredMember = await filterTeam?.TeamMembers.find((data,index)=>(data.Email === req.body?.TeamDetails?.Email))
    const finalFilter = await filterTeam?.TeamMembers.filter(data =>{
        
        if(data.Email === req.body?.TeamDetails?.Email){
            const temp = {
                backlog : req.body.backlog,
                inProgress : req.body.inProgress,
                completed : req.body.completed
            }
            return filteredMember.task=temp      
            
        }
        return data
    })
    try {

        await mongoose.connect('mongodb://localhost:27017/ProjectManagementTool', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        const teamCreation = await teamModel.updateOne({ AdminName: req.body?.TeamDetails?.AdminName,InchargeName:req.body?.TeamDetails?.InchargeName,AdminName:req.body?.TeamDetails?.AdminName}, { $set: { TeamMembers: finalFilter } })
            .then(result => {
                res.status(201).json({
                    success: true,
                    message: "Task Updated successfully",
                });
            })
            .catch(error => {
                res.status(201).json({
                    success: false,
                    message: "Task Updation Failed",
                });
            });
    }
    catch (err) {
        res.send(err);

    }
})

module.exports = router