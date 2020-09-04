import React, {useState, useEffect, useContext} from 'react';
import { userContext } from '../../App';
import { Link } from "react-router-dom";

const Home = () => {
    const [data, setData] = useState([])
    const {state, dispatch} = useContext(userContext)

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
        })
    }

    return(
        <div className="home">
            {
            data.map(item=> {
                return(
                    <div key={item._id} className="card home-card">
                        <h6 className="card-title"><Link to={item.postedBy._id !== state._id ? "/user/"+item.postedBy._id : "/profile"}>{item.postedBy.name}</Link></h6>
                        <div className="card-image">
                            <img src={item.photo} alt="Could not load image."></img>
                        </div>
                        <div className="card-content">
                            {item.likes.includes(state._id) ?
                                <i className="material-icons unlike" style={{color:"red"}} onClick={()=> {unlikePost(item._id)}}>favorite</i>
                                :
                                <i className="material-icons like" onClick={()=> {likePost(item._id)}}>favorite_border</i>
                            }
                            <h6>{item.likes.length} likes</h6>
                            <p>{item.caption}</p>
                            {/* Display Comments */}
                            {item.comments.map(comment=> {
                                return(
                                    <h6 key={comment._id}><span style={{fontWeight:"bold"}}>{comment.postedBy.name}</span> <span>{comment.text}</span></h6>
                                )
                            })}
                            <form className="commentForm" onSubmit={e=> {
                                e.preventDefault()
                                // console.log(e.target[0].value, item._id)
                                if(e.target[0].value) {
                                    makeComment(e.target[0].value, item._id)
                                }
                            }}>
                                <input type="text" placeholder="Add a comment"/>
                                <button><i className="material-icons">keyboard_arrow_right</i></button>
                            </form>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Home