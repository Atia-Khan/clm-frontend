import React from 'react';
import {
  Container,
  CssBaseline,
  Typography,
  Button,
  styled,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Hidden,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../../../images/logo.png';

const HeaderContainer = styled(Container)({
  display: 'flex',
  justifyContent: 'space-between',
  // marginTop: '20px',
  // width: '90%',
});
const WhiteBackgroundAppBar = styled(AppBar)({
  backgroundColor: 'white',
  color:'black',
});
const LogoContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const NavigationContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  fontWeight:'bolder',
  fontSize:'1rem',
  '& Button': {
    margin: '0 10px', 
    '&:hover': {
      color: '#03a1d8',
  
    },

    
  },
});

const SignUpButton = styled(Button)({
  marginLeft: '16px',
  fontWeight: 'bolder',
  '&:hover': {
    color: 'white',

  },
  
});

const Header = () => {

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Home', href: '/home' },
    { text: 'Features', href: '/features' },
    { text: 'Pricing', href: '/pricing' },
    { text: 'Sign In', href: '/login' },
  ];

  return (
    <>
      <CssBaseline />
      <WhiteBackgroundAppBar position="static">
        <Toolbar>
          <Hidden mdUp>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            <List className='font-body'>
              {menuItems.map((item) => (
                <ListItem
                  button
                  key={item.text}
                  component="a"
                  href={item.href}
                >
                  <ListItemText primary={item.text} className='font-body'/>
                </ListItem>
              ))}
            </List>
          </Drawer>
          <HeaderContainer>
            <LogoContainer>
              <img src={logo} alt="Logo" width="50" height="30" marginRight = '15px'/>
              <Typography variant="h6" component="div" style={{marginLeft:'8px'}} className='font-body'>
                DocVault
              </Typography>
            </LogoContainer>
            <NavigationContainer className='font-body'>
              <Hidden smDown>
                {menuItems.map((item) => (
                  <Button color="inherit" key={item.text} href={item.href}>
                    {item.text}
                  </Button>
                ))}
              </Hidden>
              {/* <SignUpButton style={{backgroundColor:'#03a1d8'}}
                color="primary"
                variant="contained"
                href="/signup"
              >
                Sign Up
              </SignUpButton> */}
            <SignUpButton style={{ backgroundColor: '#03a1d8' }} color="primary" variant="contained" href="/signup">
            Sign Up
          </SignUpButton>

            </NavigationContainer>
          </HeaderContainer>
        </Toolbar>
      </WhiteBackgroundAppBar>
    </>
  );
};

export default Header;