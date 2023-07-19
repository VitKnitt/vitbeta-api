const mongoose = require('mongoose')
const { Schema, model} = require('mongoose')

const UserSchema = new Schema({
    name:{
        type: String,
        required: true,
        min: 3,
        unique: true
    },
    password:{
        type: String,
        required: true,
        min: 6
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: String,
    role:{
        type: String,
        default:'user'
    }
})

const UserModel = model("User", UserSchema);

module.exports = UserModel;