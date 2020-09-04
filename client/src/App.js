import React, {useEffect, createContext, useReducer, useContext} from 'react';
import NavBar from './components/Navbar'
import './App.css'
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom'
import HomePosts from './components/pages/homePosts'
import Profile from './components/pages/profile';
import Login from './components/pages/login';
import SignUp from './components/pages/signup';
import CreatePost from './components/pages/createPost';
import UserProfile from './components/pages/userProfile';
import { reducer, initialState } from './reducers/userReducer';
import ForgotPwd from './components/pages/forgotPwd';
import ResetPwd from './components/pages/resetPwd';
import PrimarySearchAppBar from './components/Appbar';
import Explore from './components/pages/explore';

export const userContext = createContext()

const Routing = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(userContext)
  
  useEffect(()=> {
    const user = JSON.parse(localStorage.getItem("user"))

    if(user) {
      // console.log(user)
      dispatch({type:"USER", payload:user})
    } else {
      if(!history.location.pathname.startsWith('/reset')){
        history.push('/login')
      }
    }
  },[])

  return(
    <Switch>
      <Route exact path="/">
        {/* <Home/> */}
        <HomePosts/>
      </Route>
      <Route exact path="/profile">
        <Profile/>
      </Route>
      <Route path="/login">
        <Login/>
      </Route>
      <Route path="/signup">
        <SignUp/>
      </Route>
      <Route path="/createPost">
        <CreatePost/>
      </Route>
      <Route path="/user/:userId">
        <UserProfile/>
      </Route>
      <Route path="/explore">
        <Explore/>
      </Route>
      <Route path="/forgot-password">
        <ForgotPwd/>
      </Route>
      <Route path="/reset-password/:token">
        <ResetPwd/>
      </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <userContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <PrimarySearchAppBar/>
        {/* <NavBar/> */}
        <Routing/>
      </BrowserRouter>
    </userContext.Provider>
    
  );
}

export default App;
