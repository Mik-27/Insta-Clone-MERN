const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default: "",
    },
    photo: {
        type: String,
        required: true
    },
    location: {
        type: String,
        default: ""
    },
    likes: [{ 
        type:mongoose.Schema.Types.ObjectId, 
        ref:"User" 
    }],
    comments: [{
        text:String,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

module.exports = mongoose.model("Post", postSchema)