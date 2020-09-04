import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { userContext } from "../../App";
import M from 'materialize-css'
import { Button, Grid, GridList, GridListTile, Snackbar } from '@material-ui/core';
import { MuiAlert } from '@material-ui/lab'

const Login = () => {
    const tileData = [
        {
            https:"https://res.cloudinary.com/mik277/image/upload/v1597770326/SiteImages/photo-1567436670499-8d4129485548_nm95wh.jpg"
        },
        {
            https:"https://res.cloudinary.com/mik277/image/upload/v1597770323/SiteImages/photo-1587496714146-3790b9d257cc_mgglp0.jpg"
        },
        {
            https:"https://res.cloudinary.com/mik277/image/upload/v1597770321/SiteImages/photo-1587466317255-083616f2fcd5_di1hjm.jpg"
        },
        {
            https:"https://res.cloudinary.com/mik277/image/upload/v1597770684/SiteImages/photo-1482192505345-5655af888cc4_fc5nvq.jpg",
            cols:2
        },
        {
            https:"https://res.cloudinary.com/mik277/image/upload/v1597770752/SiteImages/photo-1583502977892-b0cecdb574fd_y5wyba.jpg"
        },
        {
            https:"https://res.cloudinary.com/mik277/image/upload/v1597772554/SiteImages/photo-1525268771113-32d9e9021a97_qvxca1.jpg"
        },
        {
            https:"https://res.cloudinary.com/mik277/image/upload/v1597772555/SiteImages/photo-1562157697-74f3f1deab4f_jgzmxr.jpg",
            cols: 2
        },
        {
            https:"https://res.cloudinary.com/mik277/image/upload/v1597773051/SiteImages/photo-1541503673344-d5081408437b_txzqku.jpg",
            cols: 2
        },
        {
            https:"https://res.cloudinary.com/mik277/image/upload/v1597773049/SiteImages/photo-1534787146155-0104a27a2da5_fihukj.jpg"
        }
        
    ]
    const {state, dispatch} = useContext(userContext)
    const history = useHistory()
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const postUserData = () => {
        // Regex to check valid email address
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({html: "Invalid Email", classes:"#c62828 red darken-3"})
            return
        }
        fetch("/login", {
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=> {
            if(data.error) {
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
            } else {
                localStorage.setItem("jwt", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))
                dispatch({type:"USER", payload: data.user})
                M.toast({html: "Logged in successfully", classes: "#1de9b6 teal accent-3"});
                // <Snackbar open={open} autoHideDuration={6000}>
                //     <Alert severity="success">
                //         This is a success message!
                //     </Alert>
                // </Snackbar>
                history.push('/')
            }
        }).catch(err=> {
            console.log(err)
        })
    }

    return(
        <Grid container spacing={3}>
            <Grid item sm={6} display={{xs:'none', sm:'block'}} className="imageGrid">
                <GridList cellHeight={170} cols={3}>
                    {tileData.map((tile) => (
                        <GridListTile key={tile.https} cols={tile.cols || 1}>
                            {console.log(tile.https)}
                            <img src={tile.https}/>
                        </GridListTile>
                    ))}
                </GridList>
            </Grid>
            {/* Login Form */}
            <Grid item xs={12} sm={6}>
                <div className="loginForm">
                    <div className="loginCard input-field">
                        <h1 id="loginHead">Instagram</h1>
                        <input type="text" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
                        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
                        {/* <button className="btn waves-effect waves-light submitButton #1e88e5 blue darken-1" onClick={()=>postUserData()}>Log In</button> */}
                        <Button 
                            className="loginButton"
                            variant="contained" 
                            color="primary" 
                            onClick={()=>postUserData()}>
                            Log In
                        </Button>
                        <p><Link className="links" to="/forgot-password">Forgot Password?</Link></p>
                    </div>
                    <div className="signup-link">
                        <p>New to Instagram? <Link className="links" to="/signup">Sign Up</Link></p>  
                    </div>   
                </div>
            </Grid>
        </Grid>
        
    )
}

export default Login