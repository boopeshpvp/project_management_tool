const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv')
dotenv.config();
const port = process.env.port
const mongooose = require("mongoose")
const cors = require("cors")
const router = require("./Routes/registerRoutes")

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());

mongooose.connect(process.env.URI).then(()=>{
    console.log("MongoDB Connected");
    
}).catch((err)=>{
    console.log("MongoDb connection Error ",err);
    
})

app.use("/",router)

app.listen(port,()=>{
    console.log(`Server running on Port ${port}`);
    
})