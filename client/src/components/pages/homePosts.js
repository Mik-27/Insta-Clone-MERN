import React, {useState, useContext, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {userContext} from '../../App'
import { Icon, Input, Button, Link } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import CommentModal from '../commentModal';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    width: '50%',
    margin: '20px auto',
    border: '1px solid lightgray'
  },
  media: {
    height: 0,
    paddingTop: '70%', // 16:9
    backgroundSize: 'contain',
    backgroundColor: '#f7f7f7',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  liked: {
      color: '#ff1744',
  }
}));

export default function HomePosts() {
    const [data, setData] = useState([])
    const {state, dispatch} = useContext(userContext)
    const [expanded, setExpanded] = useState(false);
    const classes = useStyles();

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(()=> {
        fetch('/home', {
            headers:{
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=> {
            console.log(result)
            setData(result.posts)
        })
    },[])

    // Like and Unlike post
    const likePost = (id) => {
        fetch('/like', {
            method:"put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.map(item=> {
                if(item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setData(newData)
        }).catch(err=>console.log(err))
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method:"put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=> {
                if(item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setData(newData)
        }).catch(err=>console.log(err))
    }

    // Comment on a post
    const makeComment = (text, postId) => {
        fetch('/post-comment', {
            method:"put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                text,
                postId
            })
        }).then(res=>res.json())
        .then(result=> {
            console.log(result) 
            const newData = data.map(item=> {
                if(item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setData(newData)
            text = null
        }).catch(err=> console.log(err))
    }

    const deletePost = (postId) => {
        fetch(`/delete-post/${postId}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=> {
            console.log(result)
            const newData = data.filter(item=> {
                return item._id !== result._id
            })
            setData(newData)
            window.location.reload()
        })
    }


    return (
        <div className="home">
            {
            data.map(post=> {
                return(
                    <Card className={classes.root}>
                        <CardHeader className="user-name"
                            avatar={
                                <Avatar aria-label="user-avatar" className="currentUserAvatar">
                                    {post.postedBy.pic? post.postedBy.pic : null}
                                </Avatar>
                            }
                            action={
                                state._id === post.postedBy._id?
                                <IconButton aria-label="settings" onClick={()=>deletePost(post._id)}>
                                    <DeleteIcon/>
                                </IconButton>
                                :
                                null
                            }
                            title={<a href={post.postedBy._id !== state._id ? "/user/"+post.postedBy._id : "/profile"}>{post.postedBy.name}</a>}
                        />
                        <CardMedia
                        className={classes.media}
                        image={post.photo}
                        title={post.caption}
                        />
                        {/* <CardContent>
                            <Typography variant="body2" color="textSecondary" component="p">
                                <span className="user-name">{post.postedBy.name}</span> {post.caption}
                            </Typography>
                        </CardContent> */}
                        <CardActions disableSpacing>
                            <IconButton aria-label="add to favorites">
                                {post.likes.includes(state._id) ?
                                    <FavoriteIcon className={classes.liked} onClick={()=> {unlikePost(post._id)}}/>
                                    :
                                    <FavoriteBorderIcon className="changeColor" onClick={()=> {likePost(post._id)}}/>
                                }
                            </IconButton>
                            {/* <IconButton>
                                <Icon className="far fa-comment changeColor"/>
                            </IconButton> */}
                            {/* <IconButton
                                className={clsx(classes.expand, {
                                [classes.expandOpen]: expanded,
                                })}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </IconButton> */}
                            <CommentModal data={post.comments}/>
                        </CardActions>
                        <p className="likedBy">Liked By <strong>{post.likes.length}</strong></p>
                        <CardContent>
                            <Typography variant="body2" color="textSecondary" component="p">
                                <span className="user-name">{post.postedBy.name}</span> {post.caption}
                            </Typography>
                        </CardContent>

                        <form id="comment" className="commentForm" autoComplete="off"
                        onSubmit={e=> {
                            e.preventDefault()
                            if(e.target[0].value) {
                                makeComment(e.target[0].value, post._id)
                                e.target.reset()
                            }     
                        }}>
                            <input placeholder="Add Comment..." type="text"/>
                            <button color="primary">Post</button>
                        </form>
                    </Card>
                )
                })
            }
        </div>
      
    );
}