const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
    pic: {
        type: String,
        default: "https://res.cloudinary.com/mik277/image/upload/v1597301628/noimage_u1q3ju.png"
    },
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }]
});

module.exports = mongoose.model("User", userSchema);