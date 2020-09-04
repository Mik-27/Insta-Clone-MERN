import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'
import {Button, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import PublishIcon from '@material-ui/icons/Publish';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    input: {
      display: 'none',
    },
    uploadButton: {
        margin: '20px 5% 20px auto',
        right: '20%'    
    },
    previewImg: {
        height: '55px',
        width: '55px',
        position: 'absolute',
    },
    postBtn: {
        marginTop: '15px',
        width: '100%'
    },
    heading: {
        color: 'gray',
        marginBottom: '15px'
    }
  }));

const CreatePost = () => {
    const classes = useStyles()
    const history = useHistory()
    const [ caption,setCaption ] = useState("")
    const [ location, setLocation ] = useState("")
    const [ photo, setPhoto ] = useState("")
    const [ url, setUrl ] = useState("")
    const [ tempUrl, setTempUrl] = useState("")

    useEffect(()=> {            //This is executed when the url changes
        if(url) {
            fetch("/posts/new", {
                method: "post",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    caption,
                    location,
                    photo:url
                })
            }).then(res=>res.json())
            .then(data=> {
                if(data.error) {
                    M.toast({html: data.error, classes:"#c62828 red darken-3"})
                } else {
                    M.toast({html: "Post Uploaded", classes: "#1de9b6 teal accent-3"})
                    history.push('/')
                }
            }).catch(err=> {
                console.log(err)
            })
        }
    }, [url])

    const postData = () => {
        const data = new FormData()
        data.append("file", photo)
        data.append("upload_preset", "insta_clone")
        data.append("cloud_name", "mik277")
        fetch("https://api.cloudinary.com/v1_1/mik277/image/upload", {
            method: "post",
            body:data
        }).then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    return(
        
        <div className="card createCard input-field">
            <Typography variant="h3" className={classes.heading}>
                    POST
            </Typography>
            <input type="text" placeholder="Caption" value={caption} onChange={e=>setCaption(e.target.value)}/>
            <input type="text" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)}/>
            <div className={classes.root}>
                <input
                    accept="image/*"
                    className={classes.input}
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={e=>{
                        setPhoto(e.target.files[0])
                        setTempUrl(URL.createObjectURL(e.target.files[0]))
                        }}
                />
                <label htmlFor="contained-button-file" className={classes.uploadButton}>
                    <Button variant="contained" color="default" component="span" className={classes.uploadButton} startIcon={<PublishIcon/>}>
                        Upload Photo
                    </Button>
                </label>
                <img src={photo? tempUrl:null} className={classes.previewImg}></img>
            </div>
            <Button variant="contained" color="primary" className={classes.postBtn} onClick={()=>postData()}>Post</Button>
        </div>
    )
}

export default CreatePost