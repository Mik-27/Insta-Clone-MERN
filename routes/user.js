const express = require('express')
      mongoose = require('mongoose')
      verifyToken = require('../middleware/token')
      Post = require('../models/post')
      User = require('../models/user')

const router = express.Router()

router.get('/user/:userId', verifyToken, (req,res)=> {
    User.findById(req.params.userId)
    .select("-password")            // For not sending password
    .then(user=> {
        console.log(user)
        Post.find({postedBy:req.params.userId})
        .populate("postedBy", "_id name")           // Populate the postedBy from Post model
        .exec((err,posts)=> {
            if(err) {
                return res.status(422).json({error:err})
            }
            res.json({user, posts})
        })
    }).catch(err=>{
        return res.status(404).json({error:"User not found."})
    })
})

// Follow a User
router.put('/follow', verifyToken, (req,res)=> {
    console.log(req.user._id)
    // Logged in user is following another user
    User.findByIdAndUpdate(req.body.followId, {
        //Update followers array for the user that is followed by logged in User.
        $push: {followers: req.user._id} 
    },{
        new:true
    }, (err, result)=> {
        if(err){
            return res.status(422).json({error:err})
        }
        // Update following array for the logged in user
        User.findByIdAndUpdate(req.user._id, {
            $push: {following: req.body.followId}
        }, {
            new: true
        }).select("-password")
        .then(result=> {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({error:err})
        })
    })
})

// Unfollow User
router.put('/unfollow', verifyToken, (req,res)=> {
    // Logged in user is unfollowing another user
    User.findByIdAndUpdate(req.body.unfollowId, {
        //Update followers array as the user is unfollowed by logged in User.
        $pull: {followers: req.user._id} 
    },{
        new:true
    }, (err, result)=> {
        if(err){
            return res.status(422).json({error:err})
        }
        // Update following array for the logged in user. 
        // Remove a followed User.
        User.findByIdAndUpdate(req.user._id, {
            $pull: {following: req.body.unfollowId}
        }, {
            new: true
        }).select("-password")
        .then(result=> {
            res.json(result)
        }).catch(err => {
            return res.status(422).json({error:err})
        })
    })
})

router.put('/updatepic', verifyToken, (req,res)=> {
    User.findByIdAndUpdate(req.user.id, {
        $set:{pic: req.body.pic}
    }, {new:true}, (err, updatedUser)=> {
        if(err){
            return res.status(422).json({error:err})
        }
        res.json(updatedUser)
    })
})

router.post('/search-user', (req, res)=> {
    let searchPattern = new RegExp("^" + req.body.searchQuery)
    User.find({name:{$regex:searchPattern}})
    .select("_id name email")
    .then(user=> {
        res.json({user})
    }).catch(err=> console.log(err))
})

module.exports = router