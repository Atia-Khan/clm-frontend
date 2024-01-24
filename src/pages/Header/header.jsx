import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { FaBell, FaAngleDown } from 'react-icons/fa';
import pics from './../../images/download.png';
import { useEffect, useState } from 'react';
import { Image } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firestore/firestore';
import { Divider } from '@mui/material';
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#F5F5F5',
    border: '1px solid #ccc',
    padding: theme.spacing(2),
    display: 'flex',
    height: '60px',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'center',
      flexDirection: 'row',
      height: '60px',
      width: 'auto'
    },
  },
  fixedHeader: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // Adjust the z-index as needed
    backgroundColor: '#F5F5F5',
    border: '1px solid #ccc',
    padding: theme.spacing(2),
    display: 'flex',
    height: '60px',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      height: '60px',
      width: '100%',
    },
  },
  profileImage: {
    width: '50px',
    height: '30px',
    borderRadius: 'none'
  },
  logo: {
    width: '50px',
    height: '30px',
    borderRadius: 'none',
    marginTop: '-38px',
    marginLeft: theme.spacing(60)
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Left-align content horizontally
    marginLeft: theme.spacing(2),
    color: '#888',
    fontSize: '15%',
    marginTop: '10px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      marginTop: '10px',
      display: 'none'
    },
  },
  
  menuIcon: {
    color: '#888',
    fontSize: '24px',
    marginTop: '20px',
    marginLeft: theme.spacing(70),
    [theme.breakpoints.up('md')]: {
      marginTop: '35px',
      marginLeft: '125px',
      display: 'none'
    },
  },
  settings: {
    color: '#888',
    marginTop: '-30px',
    fontSize: '20px',
    marginLeft: theme.spacing(80),
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      marginTop: '10px',
      display: 'none'
    },
  },
  bellIcon: {
    color: '#888',
    fontSize: '28px',
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      marginTop: '2px',
    },

    '&:hover': {
      color: '#0d6efd',
    },
  },
  notificationsCount: {
    position: 'absolute',
    top: 0,
    right: 19,
    fontSize:16,
    color: 'black',
  },
  notificationsDropdown: {
    position: 'absolute',
    top: '70px',
    right: 70,
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius:30,
    borderTopRightRadius:0,
    borderBottomLeftRadius:0,
    padding: '10px',
    zIndex: 1000,
    '& :hover': {

      color: '#0d6efd',
      cursor: 'pointer',
    },
  },
  notificationItem: {
    margin: 10,
    fontSize: 17,
    marginTop:10,
    height:20,
    '&:hover': {
      color: '#0d6efd',
    },
  },
}));
function Header() {
  const img = 'https://cdn.production.dochub.com/assets/img/logo/wordmark-v2-93b801ca7bef5ba79595ffd512209088.svg';
  const img2 = 'https://cdn.production.dochub.com/assets/img/logo/wordmark-v2-93b801ca7bef5ba79595ffd512209088.svg';
  const classes = useStyles();
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setuser] = useState({});
  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("user"));
    console.log('agyaa', obj);
    if (obj) {
      setuser(obj);
    }
    const fetchNotifications = async () => {
      try {
        const notificationsCollection = collection(firestore, 'notification');
        const notificationsSnapshot = await getDocs(notificationsCollection);
        const notificationsData = notificationsSnapshot.docs.map((doc) => doc.data());
        console.log(notificationsData,'dasds')
        setNotifications(notificationsData);
        setNotificationsCount(notificationsData.length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);
  const handleBellIconClick = () => {
    setIsDropdownOpen((prevIsDropdownOpen) => !prevIsDropdownOpen);
    if (!isDropdownOpen) {
      setNotificationsCount(0);
    }
  };
  return (
    <Paper className={`${classes.root} ${classes.fixedHeader}`} elevation={4}>
      <div style={{ flex: 1 }}>
        <div className={classes.menuItem}>
          <Typography variant="body2">
            Personal Dashboard
          </Typography>
          <Typography variant="body2" style={{ color: '#333', margin: '3px', marginTop: '2px' }}>
            {`${user.first_name} ${user.last_name}`}
          </Typography>
          <FaAngleDown className={classes.menuIcon} />
        </div>
      </div>
      {/* <IconButton onClick={handleBellIconClick}> */}
            {/* <FaBell className={classes.bellIcon} />
            {notificationsCount > 0 && (
              <div className={classes.notificationsCount}>{notificationsCount}</div>
            )}
          </IconButton>
          {isDropdownOpen && (
            <div className={classes.notificationsDropdown}>
              {notifications.map((notification, index) => (
                <React.Fragment key={index}>
                  <Typography className={classes.notificationItem}>{notification.message}</Typography>
                  {index !== notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </div>
          )} */}
      <Link to="/Userprofile" style={{ textDecoration: 'none' }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style={{ width: '40px', height: '40px' }}>
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </Link>
    </Paper>
  );
}
export default Header;