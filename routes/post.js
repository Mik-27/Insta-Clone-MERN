const express = require('express')
      mongoose = require('mongoose')
      verifyToken = require('../middleware/token')
      Post = require('../models/post')

const router = express.Router()

router.get('/explore', verifyToken, (req, res)=> {
    Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name pic")
    .sort("-createdAt")        // Sort the posts in descending order based on timestamp
    .then(posts=> {
        res.json({posts})
    })
    .catch(err=> {
        console.log(err)
    })
})

router.get('/home', verifyToken, (req, res)=> {
    // Find the posts that are posted by the user who is in the logged user's following array.
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then(posts=> {
        res.json({posts})
    })
    .catch(err=> {
        console.log(err)
    })
})

router.post('/posts/new', verifyToken, (req, res) => {
    const {caption, photo, location} = req.body
    if(!photo) {
        return res.status(422).json({error: "Please add a photo to be posted."})
    }
    req.user.password = undefined
    const post = new Post({
        caption,
        photo,
        location,
        postedBy: req.user
    })
    post.save().then(savedPost=> {
        res.json({post: savedPost})
    })
    .catch(err=> {
        console.log(err)
    })
})

router.get("/myposts",  verifyToken, (req, res)=>{
    Post.find({postedBy: req.user._id}).populate("postedBy", "name _id")
    .then(myposts=> {
        res.json({myposts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put("/like", verifyToken, (req, res)=> {
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{likes:req.user._id}
    }, {
        new: true
    }).exec((err,result)=> {
        if(err) {
            return res.status(422).json({error:err})
        } else {
            res.json(result)
        }
    })
})

router.put("/unlike", verifyToken, (req, res)=> {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull:{likes:req.user._id}
    }, {
        new: true
    }).exec((err,result)=> {
        if(err) {
            return res.status(422).json({error:err})
        } else {
            res.json(result)
        }
    })
})

router.put("/post-comment", verifyToken, (req, res)=> {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{comments: comment}
    }, {
        new: true
    })
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err,result)=> {
        if(err) {
            return res.status(422).json({error:err})
        } else {
            res.json(result)
        }
    })
})

router.delete('/delete-post/:postId', verifyToken, (req,res) => {
    Post.findOne({_id:req.params.postId})
    .populate("postedBy", "_id")
    .exec((err, post)=>{
        if(err || !post) {
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()) {
            post.remove()
            .then(result=> {
                res.json({result})
            }).catch(err=>console.log(err))
        }
    })
})

module.exports = router