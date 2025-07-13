import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ onMenuClick }) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: 1201, backgroundColor: '#1f2937' }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h5"
          noWrap
          component="div"
          sx={{
            color: '#facc15',
            fontWeight: 800,
            letterSpacing: 1,
            cursor: 'pointer',
          }}
        >
          Upgradist
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
