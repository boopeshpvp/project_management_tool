const { Schema, model } = require('mongoose');

const schema = new Schema({
    InchargeName: {
        type: String,
        required: true,
        maxLength: 25
    },
    Email: {
        type: String,
        required: true,
    },
    AdminName:{
        type : String,
        required:true,
        maxLength:50
    },
    Password:
    {
        type: String,
        required: true,
        maxLength: 30
    },
    TeamName:
    {
        type:Array,
        maxLength: 10
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const inchargeSchema = model("Incharge Details", schema);


module.exports = inchargeSchema