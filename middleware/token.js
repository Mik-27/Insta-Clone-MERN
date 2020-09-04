const jwt = require('jsonwebtoken')
const {JWT_KEY} = require('../keys')
const mongoose = require('mongoose')
const User = require('../models/user')

module.exports = (req, res, next) => {
    const {authorization} = req.headers

    if(!authorization) {
        return res.status(401).json({error: "You must be logged in !"})
    }
    const token = authorization.replace("Bearer ", "")
    console.log(token)
    jwt.verify(token, JWT_KEY, (err, payload)=> {
        if(err) {
            return res.status(401).json({error: "You must be logged in !"})
        }
        User.findById(payload._id).then(userData=> {
            req.user = userData
            next()
        })
    })
}
