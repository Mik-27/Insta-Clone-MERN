import React, {useState, useEffect} from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { Button } from '@material-ui/core'

const SignUp = () => {
    const history = useHistory()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

    useEffect(()=> {
        if(url) {
            uploadFields()
        }
    },[url])

    const uploadImage = () => {
        const data = new FormData()
        data.append("file", image)
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

    const uploadFields = () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({html: "Invalid Email", classes:"#c62828 red darken-3"})
            return
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=> {
            if(data.error) {
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
            } else {
                M.toast({html: data.message, classes: "#1de9b6 teal accent-3"})
                history.push('/login')
            }
        }).catch(err=> {
            console.log(err)
        })
    }

    const postData = () => {
        if(image) {
            uploadImage()
        } else {
            uploadFields()
        }
    }

    return(
        <div className="signupForm">
            <div className="loginCard input-field">
                <h1 id="loginHead">Instagram</h1>
                <h6 className="signupLine">Sign up to see photos and videos from your frinds</h6>
                <input type="text" placeholder="Name" value={name} onChange={e=>setName(e.target.value)}/>
                <input type="text" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
                {/* <div className="file-field input-field">
                    <div className="uploadImg btn #1e88e5 blue darken-1">
                        <span>Upload Image</span>
                        <input type="file" onChange={e=>setImage(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div> */}
                <Button 
                    className="signupButton"
                    variant="contained" 
                    color="primary" 
                    onClick={()=>postData()}>
                    Sign Up
                </Button>
            </div>
            <p>Already have an account? <Link className="links" to="/login">Login</Link></p>
        </div>
    )
}

export default SignUp