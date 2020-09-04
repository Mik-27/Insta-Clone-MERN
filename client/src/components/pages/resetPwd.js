import React, { useState, useContext } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import M from 'materialize-css'

const ResetPwd = () => {
    const history = useHistory()
    const [password, setPassword] = useState("")
    const {token} = useParams()
    const postUserData = () => {
        fetch("/reset-password", {
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token
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

    return(
        <div className="loginForm">
            <div className="card loginCard input-field">
                <h1 id="loginHead">Reset Password</h1>
                <input type="password" placeholder="New Password" value={password} onChange={e=>setPassword(e.target.value)}/>
                <button className="btn waves-effect waves-light submitButton #1e88e5 blue darken-1" onClick={()=>postUserData()}>Reset</button>
            </div>
        </div>
    )
}

export default ResetPwd