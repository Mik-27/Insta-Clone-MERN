import React, { useContext } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom'
import { fade, makeStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar, IconButton, Typography, Badge, Menu, MenuItem, Avatar, Button} from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import MoreIcon from '@material-ui/icons/MoreVert';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ExploreOutlinedIcon from '@material-ui/icons/ExploreOutlined';
import AddIcon from '@material-ui/icons/Add';
import { userContext } from '../App';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'block',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  appbarConatainer: {
      padding: '0 2%',
      [theme.breakpoints.up('md')]: {
          padding: '0 18%'
      }
  }
}));

export default function PrimarySearchAppBar() {
    const classes = useStyles();
    const {state, dispatch} = useContext(userContext)
    const location = useLocation()
    const history = useHistory()
    console.log(state)

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
        <MenuItem>Profile</MenuItem>
        <MenuItem>My account</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
        <MenuItem>
            <IconButton color="inherit">
                <Badge color="secondary">
                    <AddIcon />
                </Badge>
            </IconButton>
            <p>New Post</p>
        </MenuItem>
        <MenuItem>
            <IconButton color="inherit">
                <Badge color="secondary">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <p>Notifications</p>
        </MenuItem>
        <MenuItem>
            <IconButton color="inherit">
                <Badge color="secondary">
                    <ExploreOutlinedIcon />
                </Badge>
            </IconButton>
            <p>Explore</p>
        </MenuItem>
        <MenuItem>
        <div className="dropdown">
            <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
            className="dropbtn"
            >
                <Avatar alt={state?state.name:"Noname"} src={state?state.pic:"https://res.cloudinary.com/mik277/image/upload/v1597301628/noimage_u1q3ju.png"} />
                {/* <AccountCircle/> */}
            </IconButton>
            <div className="dropdown-content">
                <Link to="/profile">Profile</Link>
                <Link onClick={()=> {
                    localStorage.clear()
                    dispatch({type:"CLEAR"})
                    {history.push('/login')}
                }}>Logout</Link>
            </div> 
        </div>
        </MenuItem>
        </Menu>
    );

    if(location.pathname === '/login' || location.pathname === '/signup') {
        return null
    }

    
    return (
    <div>
        <AppBar position="fixed" color="#fff">
            <Toolbar className={classes.appbarConatainer}>
            <Link to="/">
                <Typography className={classes.title} variant="h4">
                    Instagram
                </Typography>
            </Link>    
            <div style={{flexGrow: 1}}/>
            <div className={classes.sectionDesktop}>
                <IconButton color="inherit">
                    <Link to="/createPost">
                        <Badge color="secondary">
                            <AddIcon />
                        </Badge>
                    </Link>
                </IconButton>
                {/* <IconButton color="inherit">
                    <Badge color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </IconButton> */}
                <IconButton color="inherit">
                    <Link to='/explore'>
                        <Badge color="secondary">
                            <ExploreOutlinedIcon />
                        </Badge>
                    </Link>    
                </IconButton>
                <div className="dropdown">
                    <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    color="inherit"
                    className="dropbtn"
                    >
                        <Avatar alt={state?state.name:"Noname"} src={state?state.pic:"https://res.cloudinary.com/mik277/image/upload/v1597301628/noimage_u1q3ju.png"} />
                            {/* <AccountCircle/> */}
                    </IconButton>
                    <div className="dropdown-content">
                        <Link to="/profile">Profile</Link>
                        <Link onClick={()=> {
                            localStorage.clear()
                            dispatch({type:"CLEAR"})
                            {history.push('/login')}
                        }}>Logout</Link>
                    </div>
                </div>
            </div>
            <div className={classes.sectionMobile}>
                <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                color="inherit"
                >
                    <MoreIcon />
                </IconButton>
            </div>
            </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
    </div>
    );
    
  
}
