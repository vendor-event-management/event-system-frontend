import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';
import Chip from '@mui/material/Chip';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verify } from '../utils';
import { logout } from '../state/auth/authSlice';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    handleDrawerClose();
    dispatch(logout());
    Swal.fire({
      icon: 'success',
      title: 'Logout successful',
    }).then(() => navigate('/login', { replace: true }));
  };

  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <CssBaseline />
      <AppBar position='fixed' open={open}>
        <Toolbar>
          {verify() && (
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawerOpen}
              edge='start'
              sx={[
                {
                  mr: 2,
                },
                open && { display: 'none' },
              ]}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant='h6' noWrap component='div'>
            Event management system
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <Grid container spacing={2}>
          <Grid size={9}>
            <Stack
              direction='row'
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
              paddingTop={1}
              paddingBottom={1}
            >
              <Stack padding={1}>
                <Avatar src='/broken-image.jpg' />
              </Stack>
              <Stack direction={'column'} spacing={0.5} paddingLeft={0.5}>
                <Typography fontSize={15}>{`Halo, ${
                  verify().username
                }`}</Typography>
                {verify().role === 'Vendor' ? (
                  <Chip label='Vendor' color='success' size='small' />
                ) : (
                  <Chip label='HR' color='primary' size='small' />
                )}
              </Stack>
            </Stack>
          </Grid>
          <Grid
            item
            xs={3}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Divider />
        <List>
          <ListItem key='logout' onClick={() => handleLogout()} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary='Logout' />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
