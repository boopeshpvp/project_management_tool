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

router.post("/register", async (req, res) => {
    try {
        const store = await model.create(req.body)
        await res.status(201).json({
            success: true,
            message: "User created successfully",
            data: store,
        });
    }
    catch (error) {
        await res.send(`${error}`)
    }
})


router.use("/login", login)
router.use("/admin",admin)
router.use("/member",member)


module.exports = router