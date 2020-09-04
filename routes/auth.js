const express = require('express');
      mongoose = require('mongoose');
      bcrypt = require('bcrypt');
      jwt = require('jsonwebtoken')
      crypto = require('crypto')
      router = express.Router();
      User = require('../models/user');
      verifyToken = require('../middleware/token')
      nodemailer = require('nodemailer')

// const {JWT_KEY} = require('../keys');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transport = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:process.env.SENDGRID_KEY
    }
}))

router.post("/login", (req, res) => {
    const {email, password} = req.body
    if(!email || !password) {
        return res.status(422).json({error:"Please enter email and password"})
    }
    User.findOne({email:email})
    .then(savedUser => {
        if(!savedUser) {
            return res.status(422).json({error: "Invalid email or password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch=> {
            if(doMatch){
                // res.json({message: "Successfully Logged In"})
                const token = jwt.sign({_id: savedUser._id}, process.env.JWT_KEY)
                res.json({token, user:savedUser})
            } else {
                return res.status(422).json({error: "Incorrect Password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=> {
        console.log(err)
    })
})

router.get("/signup", (req, res) => {
    res.send("Registration Page");
});

router.post("/signup", (req, res) => {
    console.log(req.body)
    const {name, email, password, pic} = req.body
    if(!email || !name || !password) {
        return res.status(422).json({error: "Please add all fields."});
    }
    User.findOne({email : email})
    .then((savedUser) => {
        if(savedUser) {
            return res.status(422).json({error: "User already exists!"});
        }
        bcrypt.hash(password, 15)
        .then(hashedPassword => {
            const user = new User({
                email,
                name,
                password: hashedPassword,
                pic
            });
            user.save()
            .then(user => {
                // This code is async and will next instruction will be executed without finishing this task.
                transport.sendMail({
                    to: user.email,
                    from: "Instagram",
                    subject: "Account created Successfully",
                    html: "<h1>Welcome to Instagram</h1>"
                })
                res.json({message: "Successfully Signed up"});
            })
            .catch(err => {
                console.log(err);
            })
        })
    })
    .catch(err => {
        console.log(err);
    })
})

router.post('/forgot-password', (req,res)=> {
    crypto.randomBytes(32, (err,buffer)=> {
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email: req.body.email})
        .then(user=> {
            if(!user) {
                return res.status(422).json({error: "User doesn't exist."})
            }
            user.resetPasswrodToken = token
            user.resetPasswordExpiry = Date.now() + 3600000
            user.save()
            .then(result=> {
                transport.sendMail({
                    to: user.email,
                    from: "Instagram",
                    subject: "Reset Password",
                    html:`
                        <p>You have requested for password reset on Instagram</p>
                        <h5>Click on the link to reset password:</h5>
                        <a href="http://localhost/3000/reset-password/${token}">Reset Password</a>

                        <p>If this is not you, then please ignore the message and check your Instagram Account for security.</p>
                    `
                })
                res.json({message: "Check your e-mail."})
            })
        })
    })
})

router.post('/reset-password', (req,res)=> {
    const newPassword = req.body.password
    const resetToken = req.body.token
    User.findOne({resetPasswrodToken: resetToken, resetPasswordExpiry: {$gt: Date.now()}})
    .then(user=> {
        if(!user) {
            return res.status(422).json({error:"User not found."})
        }
        bcrypt.hash(newPassword, 15).then(hashedPassword=> {
            user.passsword = hashedPassword
            user.resetPasswrodToken = undefined
            user.resetPasswordExpiry = undefined
            user.save().then(savedUser=> {
                res.json({message:"Password Updated"})
            })
        })
    }).catch(err=> console.log(err))
})

module.exports = router;