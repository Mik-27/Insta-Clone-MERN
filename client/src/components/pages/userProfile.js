// Other users' profile that can be viewed by the logged in user.

import React, {useEffect, useState, useContext} from 'react';
import { useParams } from "react-router-dom";
import { userContext } from "../../App";
import { makeStyles, Grid, Button } from '@material-ui/core';

const useStyles = makeStyles(theme=> ({
    profilePage: {
        paddingTop: '6rem'
    },
    postsConatainer: {
        padding: '0 2%',
        [theme.breakpoints.up('md')]: {
            padding: '0 10%'
        },
        [theme.breakpoints.up('lg')]: {
            padding: '0 18%'
        }
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    postDisplay: {
        width: '80%',
        height: '80%',        
    },
    gridList: {
        width: '100%',
        height: '100%'
    },
    itemPadding: {
        padding: '0px!important',
        [theme.breakpoints.up('md')]: {
            padding: '12px',
        },
    },
    userPadding: {
        marginLeft: '5%',
        textAlign: 'center',
        [theme.breakpoints.up('md')]: {
            marginLeft: '20%',
        }
    }
}))

const UserProfile = () => {
    const classes = useStyles()
    const [userProfile, setProfile] = useState(null)
    const {state, dispatch} = useContext(userContext)
    const {userId} = useParams()
    // Above logic is if the state following array contains user then let the variable be negation
    //  of the condition (i.e. false) otherwise true.
    
    useEffect(()=> {
        fetch(`/user/${userId}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=> {
            // console.log(result)        
            setProfile(result)
        })
    },[])

    const followUser = () => {
        fetch('/follow', {
            method:"put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userId
            })
        }).then(res=>res.json())
        .then(data=> {
            console.log(data)
            dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers}})
            localStorage.setItem("user", JSON.stringify(data))
            setProfile(prevState => {
                return {
                    // Expand the previous state
                    ...prevState,
                    // Update this previous state for the visited profile
                    // Here the state is updated retaining other previous state variables.
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers, data._id]
                    }
                }
            })
        })
    }

    const unfollowUser = () => {
        fetch('/unfollow', {
            method:"put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userId
            })
        }).then(res=>res.json())
        .then(data=> {
            dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers}})
            localStorage.setItem("user", JSON.stringify(data))
            setProfile(prevState => {
                // Creating new followers arrayby filtering out the logged in user.
                const updatedFollowers = prevState.user.followers.filter(item=> item !== data._id)
                return {
                    // Expand the previous state
                    ...prevState,
                    // Update this previous state for the visited profile
                    // Here the state is updated and the is not overwriting with the back eend code.
                    user:{
                        ...prevState.user,
                        followers: updatedFollowers
                    }
                }
            })
        })
    }

    return(
        <>
        {userProfile ?
        
        <div className={classes.profilePage}>
            <div className="profileTop">
                <div id="profileInfo">
                    <div>
                        <img className="profileImg" src={state ? state.pic : "Loading..."}></img>
                    </div>
                    <div className={classes.userPadding}>
                        <h4>{userProfile?userProfile.name:"loading"}</h4>
                        <div className="userInfo1">
                            <h6>{userProfile.posts===undefined? 0 : userProfile.posts.length} posts</h6>
                            <h6>{userProfile.user.following !== undefined ? userProfile.user.following.length : 0} following</h6>
                            <h6>{userProfile.user.followers !== undefined ? userProfile.user.followers.length : 0} followers</h6>
                        </div>
                        {/* {console.log(showFollow)} */}
                        {state.following.includes(userId) ?
                            <Button variant="contained" color="primary" onClick={()=>unfollowUser()} className="followButton">
                                Unfollow
                            </Button>
                            :
                            <Button variant="contained" color="primary" onClick={()=>followUser()} className="followButton">
                                Follow
                            </Button>
                        }
                    </div>
                </div>
            </div>
            
            <div className={classes.root, classes.postsConatainer}>
                <Grid container spacing={3} direction="row" className="postGallery">
                    {userProfile.posts.map(item=> {
                        return(
                            <Grid item justify="center" alignItems="center" xs={4} className={classes.itemPadding}>
                                <img className={classes.postDisplay} key={item._id} src={item.photo}></img>
                            </Grid>
                        )
                    })}
                </Grid>
            </div>
        </div>
        :
            <h2>No such User exists!</h2>
        }
        </>
    )

    return(
        <>
        {/* Check if the user exists in the userProfile. i.e. The id provided for the user is not valid. */}
        {userProfile ?
            
            <div className="profile">
                <div id="profileInfo">
                    <div>
                        <img className="profileImg" src={userProfile? userProfile.user.pic : "Loading..."}></img>
                    </div>
                    <div className="userInfo">
                        <h4>{userProfile.user.name}</h4>
                        <h4>{userProfile.user.email}</h4>
                        <div className="userInfo1">
                            <h6>{userProfile.posts===undefined? 0 : userProfile.posts.length} posts</h6>
                            <h6>{userProfile.user.following !== undefined ? userProfile.user.following.length : 0} following</h6>
                            <h6>{userProfile.user.followers !== undefined ? userProfile.user.followers.length : 0} followers</h6>
                        </div>
                        {/* Show button based on following or not */}

                        {state.following.includes(userId) ?
                            <button className="followButton btn waves-effect waves-light #1e88e5 blue darken-1" onClick={()=>followUser()}>Follow</button>
                            :
                            <button className="followButton btn waves-effect waves-light #1e88e5 blue darken-1" onClick={()=>unfollowUser()}>Unfollow</button>
                        }
                    </div>
                </div>
                <div className="gallery">
                    {userProfile.posts.map(item=> {
                        return(
                            <img key={item._id} className="item" src={item.photo} alt="Could not load image"></img>
                        )
                    })}

                    {/* <img className="item" src="https://images.unsplash.com/photo-1583297116753-703f5292bc28?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"></img> */}
                </div>
            </div>
        
        
        : <h2>No such user Exists</h2>}
        </>
    )
}

export default UserProfile