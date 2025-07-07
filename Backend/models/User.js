const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    
    firstname: {
          type: String,
          required: true,
          trim:true,
    },

    contact: {
        type:String,
        required:true,
        trim:true,
    },

    email: {
        type:String,
        required:true,
        unique:true
    },

    password: {
        type:String,
        required:true
    }
}, {timestamps:true});

module.exports = mongoose.model("User",userSchema);