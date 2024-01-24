import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Hidden,
  IconButton,
} from "@material-ui/core";
import {
  MdAddBox,
  MdForwardToInbox,
  MdEditDocument,
  MdSettings,
  MdAddHome,
  MdExitToApp,
} from "react-icons/md";
import { FaGlobeAsia } from "react-icons/fa";
import { BiMessageSquareDots, BiSend } from "react-icons/bi";
import DescriptionIcon from "@mui/icons-material/Description";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import { logout } from "../../actions/auth";
const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    position: "fixed",
    top: 0,
    marginTop: 60,
    width: drawerWidth,
    border: "1px solid #ccc",
    backgroundColor: "#F5F5F5",
    height: "100vh",
    overflowY: "auto",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  content: {
    padding: theme.spacing(8),
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: theme.spacing(1),
  },
  ListItem: {
    borderRadius: "10px",
    marginTop: "10px",
    width: "80%",
    marginLeft: "20px",
  },
  icon: {
    fontSize: "20px",
    color: "black",
    marginLeft: "25px",
  },
  newdocumentList: {
    borderRadius: "10px",
    width: "80%",
    marginLeft: "20px",
    color: "white",
    backgroundColor: "#03A1D8",
    "&:hover": {
      backgroundColor: "#02abe6", // Keep the background color when hovering
    },
  },
  newdocumenticon: {
    marginLeft: "15px",
    fontSize: "1.4rem",
    color: "white",
  },
  selected: {
    backgroundColor: "#dee2e3",
    color: "black", // Text color of the ListItem
    "& svg": {
      color: "black", // Color of the icons inside the ListItem
    },
    "&:hover": {
      backgroundColor: "#dee2e3", // Keep the background color when hovering
    },
  },
}));

const SideNavbar = ({ logout }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [selectedButton, setSelectedButton] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleButtonClick = (buttonName) => {
    console.log("Button clicked:", buttonName);
    setSelectedButton(buttonName);
  };

  const logout_user = () => {
    logout();
    navigate("/login");
  };

  const drawer = (
    <div>
      <List>
        <Link to="/upload" className="rounded-md w-30 h-16">
          <ListItem
            className={`${classes.newdocumentList} ${
              selectedButton === "New Documents"
            }`}
            button
            onClick={() => handleButtonClick("New Documents")}
          >
            <ListItemIcon>
              <MdAddBox className={classes.newdocumenticon} />
            </ListItemIcon>
            <ListItemText primary="New Documents" />
          </ListItem>
        </Link>
        <Link to="/dashboard">
          <ListItem
            className={`${classes.ListItem} ${
              selectedButton === "Dashboard" ? classes.selected : ""
            }`}
            button
            onClick={() => handleButtonClick("Dashboard")}
          >
            <ListItemIcon>
              <MdAddHome className={classes.icon} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </Link>

        <Link to="/display-folders">
          <ListItem
            className={`${classes.ListItem} ${
              selectedButton === "Folders" ? classes.selected : ""
            }`}
            button
            onClick={() => handleButtonClick("Folders")}
          >
            <ListItemIcon>
              <MdForwardToInbox className={classes.icon} />
            </ListItemIcon>
            <ListItemText primary="Folders" />
          </ListItem>
        </Link>
 
        <Link to="/file-list">
          <ListItem
            className={`${classes.ListItem} ${
              selectedButton === "Documents" ? classes.selected : ""
            }`}
            button
            onClick={() => handleButtonClick("Documents")}
          >
            <ListItemIcon>
              <MdEditDocument className={classes.icon} />
            </ListItemIcon>
            <ListItemText primary="Documents" />
          </ListItem>
        </Link>
        <Link to="/inbox">
          <ListItem
            className={`${classes.ListItem} ${
              selectedButton === "Inbox" ? classes.selected : ""
            }`}
            button
            onClick={() => handleButtonClick("Inbox")}
          >
            <ListItemIcon>
              <BiMessageSquareDots className={classes.icon} />
            </ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItem>
        </Link>


        <Link to="/signed-doc">
          <ListItem
            className={`${classes.ListItem} ${
              selectedButton === "signed-doc" ? classes.selected : ""
            }`}
            button
            onClick={() => handleButtonClick("signed-doc")}
          >
            <ListItemIcon>
              <DescriptionIcon className={classes.icon} />
            </ListItemIcon>
            <ListItemText primary="Completed" />
          </ListItem>
        </Link>
        <Link to="/receive-doc">
          <ListItem
            className={`${classes.ListItem} ${
              selectedButton === "Sent" ? classes.selected : ""
            }`}
            button
            onClick={() => handleButtonClick("Sent")}
          >
            <ListItemIcon>
              <BiSend className={classes.icon} />
            </ListItemIcon>
            <ListItemText primary="Sent" />
          </ListItem>
        </Link>

        <Link to="/Userprofile">
          <ListItem
            className={`${classes.ListItem} ${
              selectedButton === "Settings" ? classes.selected : ""
            }`}
            button
            onClick={() => handleButtonClick("Settings")}
          >
            <ListItemIcon>
              <MdSettings className={classes.icon} />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </Link>
        <ListItem className={classes.ListItem} button onClick={logout_user}>
          <ListItemIcon>
            <MdExitToApp
              className={classes.icon}
              style={{ marginTop: "5px" }}
            />
            <ListItemText
              style={{ marginLeft: "10px", color: "black" }}
              primary="Logout"
            />
          </ListItemIcon>
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <Hidden smUp implementation="css">
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
      </Hidden>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={"left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()), // Map your logout action to props
});

export default connect(null, mapDispatchToProps)(SideNavbar);
