import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css'

const ForgotPwd = () => {
    const history = useHistory()
    const [email, setEmail] = useState("")

    const sendMail = () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({html: "Invalid Email", classes:"#c62828 red darken-3"})
            return
        }
        fetch("/forgot-password", {
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email
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
                <h1 id="loginHead">Login</h1>
                <input type="text" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
                <button className="btn waves-effect waves-light submitButton #1e88e5 blue darken-1" onClick={()=>sendMail()}>Send Mail</button>
            </div>
            <p><Link className="links" to="/login">Back</Link></p>
        </div>
    )
}

export default ForgotPwd