const { Schema, model } = require('mongoose');

const schema = new Schema({
    FirstName: {
        type: String,
        required: true,
        maxLength: 25
    },
    LastName: {
        type: String,
        required: true,
        maxLength: 25
    },
    Email: {
        type: String,
        unique: true,
        required: true,
    },
    Password:
    {
        type: String,
        required: true,
        maxLength: 30
    },
    Role :
    {
        type: String,
        required: true,
        maxLength: 10
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const adminSchema = model("User Details", schema);


module.exports = adminSchema