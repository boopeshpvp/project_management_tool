const { Schema, model } = require('mongoose');

const schema = new Schema({
    TeamName: {
        type: String,
        required: true,
        maxLength:50
    },
    InchargeName: {
        type: String,
        required: true,
        maxLength: 25
    },
    TeamMembers: {
        type: Array,
        maxLength: 25
    },
    AdminName:{
        type : String,
        required:true,
        maxLength:50
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const teamSchema = model("teamDetails", schema);


module.exports = teamSchema