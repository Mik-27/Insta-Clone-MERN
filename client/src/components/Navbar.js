import React, {useContext, Fragment, useRef, useEffect, useState} from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom'
import { userContext } from '../App';
import M from 'materialize-css'
import { Container } from '@material-ui/core';

const NavBar = () => {
    const searchModal = useRef(null)
    const [search, setSearch] = useState("")
    const [userDetails, setUserDetails] = useState([])      // User details of the searched users
    const history = useHistory()
    const location = useLocation()
    const {state, dispatch} = useContext(userContext)
    console.log(state)
    useEffect(()=> {
        M.Modal.init(searchModal.current)
    }, [])
    const renderList = () => {
        if(state) {
            return [
                <Fragment>
                    <li key="search" data-target="searchModal" className="modal-trigger">Search</li>,
                    <li key="profile"><Link to="/profile">Profile</Link></li>,
                    <li key="createPost"><Link to="/createPost">Create Post</Link></li>
                    <li key="followingPost"><Link to="/followingPosts">Posts</Link></li>
                    <li key="logout" className="logout">
                        <Link onClick={()=> {
                                localStorage.clear()
                                dispatch({type:"CLEAR"})
                                {history.push('/login')}
                        }}>Logout</Link>
                    </li>
                </Fragment>
            ]
        } 
    }

    const fetchUsers = (searchQuery) => {
        setSearch(searchQuery)
        fetch('/search-user', {
            method: "post",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                searchQuery
            })
        })
        .then(res=> res.json())
        .then(users=> {
            setUserDetails(users.user)
        })
    }

    // Hiding Navbar at Login Page
    if(location.pathname === '/login' || location.pathname === '/signup') {
        return null
    }

    return(   
        <nav>
            <Container>
                <div className="nav-wrapper white">
                    <Link to={state?"/":"/login"} className="brand-logo">Instagram</Link>
                    <ul id="nav-mobile" className="right">
                        {renderList()}
                    </ul>
                </div>
                {/* Search Modal */}
                <div id="searchModal" className="modal" ref={searchModal}>
                    <div className="modal-content">
                        <input type="text" placeholder="Search User" value={search} onChange={e=> setSearch(e.target.value)}/>
                        <ul className="collection">
                            {userDetails.map(item => {
                                return <Link to={item._id === state._id ? "/profile" : "/user/"+item._id} onClick={()=> {
                                    M.Modal.getInstance(searchModal.current).close()
                                }}><li className="collection-item">{item.name}</li></Link>
                            })}
                            
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <button className="modal-close waves-effect waves-green btn-flat" onClick={()=> setSearch('')}>Close</button>
                    </div>
                </div>
            </Container>
            
        </nav>
        
    )
}

export default NavBar