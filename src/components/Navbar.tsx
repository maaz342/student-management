import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import useMediaQuery from '@mui/material/useMediaQuery';

const NavBar: React.FC = () => {
  const { isAdmin } = useAuth(); // Get isAdmin state from context
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)'); // Example breakpoint for small screens

  const toggleDrawer = (open: boolean) => () => {
    setIsDrawerOpen(open);
  };

  const adminDrawerRoutes = (
    <>
      <ListItem button component={Link} to="/fee-voucher" onClick={toggleDrawer(false)}>
        <ListItemText primary="Fee Voucher" />
      </ListItem>
      <ListItem button component={Link} to="/exam-add" onClick={toggleDrawer(false)}>
        <ListItemText primary="Exam Add" />
      </ListItem>
      <ListItem button component={Link} to="/students" onClick={toggleDrawer(false)}>
        <ListItemText primary="Students List" />
      </ListItem>
      <ListItem button component={Link} to="/students/add" onClick={toggleDrawer(false)}>
        <ListItemText primary="Add Student" />
      </ListItem>
      <ListItem button component={Link} to="/subject-list" onClick={toggleDrawer(false)}>
        <ListItemText primary="List Subject" />
      </ListItem>
      <ListItem button component={Link} to="/fee-add" onClick={toggleDrawer(false)}>
        <ListItemText primary="Add Fees" />
      </ListItem>
      <ListItem button component={Link} to="/subject-add" onClick={toggleDrawer(false)}>
        <ListItemText primary="Add Subject" />
      </ListItem>
      <ListItem button component={Link} to="/syllabus-add" onClick={toggleDrawer(false)}>
        <ListItemText primary="Add Syllabus" />
      </ListItem>
      <ListItem button component={Link} to="/add-teacher" onClick={toggleDrawer(false)}>
        <ListItemText primary="Add Teacher" />
      </ListItem>
    </>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        {isSmallScreen ? (
          <>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              School Management System
            </Typography>
          </>
        ) : (
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            School Management System
          </Typography>
        )}
        <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
          <List>
            <ListItem button component={Link} to="/fee-structure" onClick={toggleDrawer(false)}>
              <ListItemText primary="Fee Structure" />
            </ListItem>
            <ListItem button component={Link} to="/syllabus-list" onClick={toggleDrawer(false)}>
              <ListItemText primary="Syllabus List" />
            </ListItem>
            <ListItem button component={Link} to="/class-list" onClick={toggleDrawer(false)}>
              <ListItemText primary="Class List" />
            </ListItem>
            <ListItem button component={Link} to="/exam-schedule" onClick={toggleDrawer(false)}>
              <ListItemText primary="Exam Schedule" />
            </ListItem>
            {isAdmin && adminDrawerRoutes}
          </List>
        </Drawer>
        {/* Buttons visible on large screens */}
        {!isSmallScreen && (
          <>
            <Button color="inherit" component={Link} to="/fee-structure">
              Fee Structure
            </Button>
            <Button color="inherit" component={Link} to="/syllabus-list">
              Syllabus List
            </Button>
            <Button color="inherit" component={Link} to="/class-list">
              Class List
            </Button>
            <Button color="inherit" component={Link} to="/exam-schedule">
              Exam Schedule
            </Button>
            {isAdmin && (
              <>
                <Button color="inherit" component={Link} to="/fee-voucher">
                  Fee Voucher
                </Button>
                <Button color="inherit" component={Link} to="/exam-add">
                  Exam Add
                </Button>
                <Button color="inherit" component={Link} to="/students">
                  Students List
                </Button>
                <Button color="inherit" component={Link} to="/students/add">
                  Add Student
                </Button>
                <Button color="inherit" component={Link} to="/subject-list">
                  List Subject
                </Button>
                <Button color="inherit" component={Link} to="/fee-add">
                  Add Fees
                </Button>
                <Button color="inherit" component={Link} to="/subject-add">
                  Add Subject
                </Button>
                <Button color="inherit" component={Link} to="/syllabus-add">
                  Add Syllabus
                </Button>
                <Button color="inherit" component={Link} to="/add-teacher">
                  Add Teacher
                </Button>
              </>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
