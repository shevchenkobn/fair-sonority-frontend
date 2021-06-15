import {
  Button,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@material-ui/core';
import React from 'react';
import { map } from 'rxjs/operators';
import { useAppSelector } from './app/hooks';
import { logger } from './app/logger';
import { getState$, store } from './app/store';
import { selectAppBarTitle, selectDocumentTitle } from './app/titlesSlice';
import { isLoggedIn, logoutAction } from './features/account/accountSlice';
import { Nullable } from './lib/types';
import { Helmet } from 'react-helmet';
import './App.scss';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import MailIcon from '@material-ui/icons/Mail';
import { AppRoutes } from './AppRoutes';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexGrow: 1,
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    title: {
      flexGrow: 1,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);

function App() {
  logger.debug('exec app');
  const classes = useStyles();
  const theme = useTheme();

  const [appBarTitle, setAppBarTitle] = React.useState(
    useAppSelector(selectAppBarTitle)
  );
  getState$().pipe(map(selectAppBarTitle)).subscribe(setAppBarTitle);

  const [documentTitle, setDocumentTitle] = React.useState(
    useAppSelector(selectDocumentTitle)
  );
  getState$().pipe(map(selectDocumentTitle)).subscribe(setDocumentTitle);

  const [auth, setAuth] = React.useState(useAppSelector(isLoggedIn));
  getState$().pipe(map(isLoggedIn)).subscribe(setAuth);

  const [anchorEl, setAnchorEl] = React.useState<Nullable<HTMLElement>>(null);
  const open = Boolean(anchorEl);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    logger.info('menue open', event);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    store.dispatch(logoutAction());
    handleClose();
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;

  return (
    <div className={classes.root}>
      <Helmet>
        <title>{documentTitle}</title>
      </Helmet>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {appBarTitle}
          </Typography>
          {auth ? (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <Button color="inherit">Login</Button>
          )}
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <AppRoutes />
        {/*<Typography paragraph>*/}
        {/*  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do*/}
        {/*  eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus*/}
        {/*  dolor purus non enim praesent elementum facilisis leo vel. Risus at*/}
        {/*  ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum*/}
        {/*  quisque non tellus. Convallis convallis tellus id interdum velit*/}
        {/*  laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed*/}
        {/*  adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies*/}
        {/*  integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate*/}
        {/*  eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo*/}
        {/*  quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat*/}
        {/*  vivamus at augue. At augue eget arcu dictum varius duis at consectetur*/}
        {/*  lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien*/}
        {/*  faucibus et molestie ac.*/}
        {/*</Typography>*/}
        {/*<Typography paragraph>*/}
        {/*  Consequat mauris nunc congue nisi vitae suscipit. Fringilla est*/}
        {/*  ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar*/}
        {/*  elementum integer enim neque volutpat ac tincidunt. Ornare suspendisse*/}
        {/*  sed nisi lacus sed viverra tellus. Purus sit amet volutpat consequat*/}
        {/*  mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis*/}
        {/*  risus sed vulputate odio. Morbi tincidunt ornare massa eget egestas*/}
        {/*  purus viverra accumsan in. In hendrerit gravida rutrum quisque non*/}
        {/*  tellus orci ac. Pellentesque nec nam aliquam sem et tortor. Habitant*/}
        {/*  morbi tristique senectus et. Adipiscing elit duis tristique*/}
        {/*  sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis*/}
        {/*  eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla*/}
        {/*  posuere sollicitudin aliquam ultrices sagittis orci a.*/}
        {/*</Typography>*/}
      </main>
    </div>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
