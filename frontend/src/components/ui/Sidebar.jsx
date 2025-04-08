import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
  Box,
  Typography,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import InsightsIcon from '@mui/icons-material/Insights';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ExtensionIcon from '@mui/icons-material/Extension';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import InsertChartIcon from '@mui/icons-material/InsertChart';

import { AuthContext } from '../../contextData/AuthContextData';

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const { user } = useContext(AuthContext);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleMenu = (label) => {
    setExpandedMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const menuItems = [
    { label: 'Dashboard', to: '/home', icon: <DashboardIcon sx={{ color: '#facc15' }} /> },
    {
      label: 'Learn',
      icon: <SchoolIcon sx={{ color: '#38bdf8' }} />,
      children: [
        { label: 'Video Lessons', to: '/learn/videos', icon: <VideoLibraryIcon sx={{ color: '#a78bfa' }} /> },
        { label: 'Practice', to: '/learn/practice', icon: <ExtensionIcon sx={{ fontSize: 20, color: '#f472b6' }} /> },
        { label: 'Read Books', to: '/learn/books', icon: <MenuBookIcon sx={{ fontSize: 20, color: '#34d399' }} /> },
      ],
    },
    {
      label: 'Tests',
      icon: <AssignmentTurnedInIcon sx={{ color: '#fb923c' }} />,
      children: [
        { label: 'Quiz', to: '/tests/quiz', icon: <AssignmentTurnedInIcon sx={{ fontSize: 20, color: '#f87171' }} /> },
        { label: 'Leaderboard', to: '/tests/leaderboard', icon: <EmojiEventsIcon sx={{ fontSize: 20, color: '#60a5fa' }} /> },
      ],
    },
    {
      label: 'Admin Panel',
      icon: <AdminPanelSettingsIcon sx={{ color: '#facc15' }} />,
      children: [
        { label: 'Content Management', to: '/admin/content', icon: <MenuBookIcon sx={{ fontSize: 20, color: '#fcd34d' }} /> },
        { label: 'User Management', to: '/admin/users', icon: <SupervisedUserCircleIcon sx={{ fontSize: 20, color: '#60a5fa' }} /> },
        { label: 'Reports', to: '/admin/reports', icon: <InsertChartIcon sx={{ fontSize: 20, color: '#4ade80' }} /> },
        { label: 'View Contributions', to: '/admin/contributions', icon: <VolunteerActivismIcon sx={{ fontSize: 20, color: '#fb7185' }} /> },
      ],
    },
    { label: 'Store', to: '/store', icon: <StorefrontIcon sx={{ color: '#f97316' }} /> },
    { label: 'Contribute', to: '/contribute', icon: <VolunteerActivismIcon sx={{ color: '#ec4899' }} /> },
    { label: 'Performance', to: '/performance', icon: <InsightsIcon sx={{ color: '#22d3ee' }} /> },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', backgroundColor: '#1f2937', color: 'white' }}>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          sx={{ fontWeight: 'bold', color: '#facc15', width: '100%', textAlign: 'center' }}
        >
          EduTech
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: '#374151' }} />

      <Box sx={{ py: 1 }}>
        <ListItemButton onClick={() => setOpenProfileMenu(!openProfileMenu)}>
          <ListItemIcon>
            <Avatar
              src="https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_640.png"
              sx={{ width: 32, height: 32 }}
            />
          </ListItemIcon>
          <ListItemText primary={user.name} />
          {openProfileMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openProfileMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="Edit Profile" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon sx={{ color: 'inherit' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Collapse>
      </Box>

      <Divider sx={{ borderColor: '#374151' }} />

      <List>
        {menuItems.map((item) => (
          item.children ? (
            <React.Fragment key={item.label}>
              <ListItemButton onClick={() => toggleMenu(item.label)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
                {expandedMenus[item.label] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={expandedMenus[item.label]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItem key={child.label} disablePadding>
                      <NavLink
                        to={child.to}
                        style={({ isActive }) => ({
                          textDecoration: 'none',
                          color: isActive ? '#facc15' : 'white',
                          backgroundColor: isActive ? '#374151' : 'transparent',
                          width: '100%',
                        })}
                      >
                        <ListItemButton sx={{ pl: 5 }}>
                          <ListItemIcon>{child.icon}</ListItemIcon>
                          <ListItemText primary={child.label} />
                        </ListItemButton>
                      </NavLink>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ) : (
            <ListItem key={item.label} disablePadding>
              <NavLink
                to={item.to}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? '#facc15' : 'white',
                  backgroundColor: isActive ? '#374151' : 'transparent',
                  width: '100%',
                })}
              >
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </NavLink>
            </ListItem>
          )
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
