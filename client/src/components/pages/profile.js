import React, {useEffect, useState, useContext} from 'react';
import { userContext } from "../../App";
import { makeStyles, Grid } from '@material-ui/core';

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
        // [theme.breakpoints.up('sm')]: {
        //     width: '180px',
        //     height: '180px'
        // },
        // [theme.breakpoints.up('md')]: {
        //     width: '220px',
        //     height: '220px'
        // },
        // [theme.breakpoints.up('lg')]: {
        //     width: '80%',
        //     height: '80%'
        // },
        
        // [theme.breakpoints.up('xl')]: {
        //     width: '300px',
        //     height: '300px'
        // },
        
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

const Profile = () => {
    const classes = useStyles()
    const [myposts, setPosts] = useState([])
    const {state, dispatch} = useContext(userContext)
    const [image, setImage] = useState("")
    useEffect(()=> {
        fetch('/myposts', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=> {
            setPosts(result.myposts)
        })
    },[])

    useEffect(()=> {
        if(image){
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "insta_clone")
            data.append("cloud_name", "mik277")
            fetch("https://api.cloudinary.com/v1_1/mik277/image/upload", {
                method: "post",
                body:data
            }).then(res=>res.json())
            .then(data=>{

                fetch('/updatepic', {
                    method:'put',
                    headers:{
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem("jwt")
                    },
                    body: JSON.stringify({
                        pic:data.url
                    })
                }).then(res=> res.json())
                .then(result=> {
                    console.log(result)
                    localStorage.setItem("user", JSON.stringify({...state, pic:result.pic}))
                    dispatch({type:"UPDATEPIC", payload:result.pic})
                    // window.location.reload()
                })

                
            })
            .catch(err=>{
                console.log(err)
            })
        } 
    },[image])

    const updatePhoto = (file) => {
        setImage(file)
    }

    return(
        <div className={classes.profilePage}>
            <div className="profileTop">
                <div id="profileInfo">
                    <div>
                        <img className="profileImg" src={state ? state.pic : "Loading..."}></img>
                    </div>
                    <div className={classes.userPadding}>
                        <h4>{state?state.name:"loading"}</h4>
                        <div className="userInfo1">
                            {/* {console.log(state)} */}
                            <h6>{myposts ? myposts.length : 0} posts</h6>
                            <h6>{state? state.followers.length : 0} followers</h6>
                            <h6>{state? state.following.length : 0} following</h6>
                        </div>
                    </div>
                </div>
                {/* <button className="btn waves-effect waves-light submitButton #1e88e5 blue darken-1" onClick={()=> {updatePhoto()}}>Upload Photo</button> */}
                {/* <div className="file-field input-field updatePic">
                    <div className="btn #1e88e5 blue darken-1">
                        <span>Upload Image</span>
                        <input type="file" onChange={e=>updatePhoto(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div> */}
            </div>
            
            <div className={classes.root, classes.postsConatainer}>
                <Grid container spacing={3} direction="row" className="postGallery">
                    {myposts.map(item=> {
                        return(
                            <Grid item justify="center" alignItems="center" xs={4} className={classes.itemPadding}>
                                <img className={classes.postDisplay} key={item._id} src={item.photo}></img>
                            </Grid>
                        )
                    })}
                </Grid>
            </div>
        </div>
    )
}

export default Profile