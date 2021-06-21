import {
  Button,
  LinearProgress,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@material-ui/core';
import { Assignment, ExitToApp } from '@material-ui/icons';
import React, { CSSProperties, useEffect } from 'react';
import { concat, of } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { authorizedError$ } from './app/api';
import { useAppSelector } from './app/hooks';
import { logger } from './app/logger';
import { clearOrders } from './features/orders/ordersSlice';
import { AppSnackbar } from './features/snackbar/AppSnackbar';
import { showSnackbar } from './features/snackbar/snackbarSlice';
import { AppTitle } from './features/title/AppTitle';
import { DocumentTitle } from './features/title/DocumentTitle';
import { getState$, store } from './store';
import {
  fetchAccount,
  isLoggedIn,
  logout,
  logout$,
} from './features/account/accountSlice';
import { asEffectReset } from './lib/rx';
import { Nullable } from './lib/types';
import './styles.scss';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PersonAdd from '@material-ui/icons/PersonAdd';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import MailIcon from '@material-ui/icons/Mail';
import { AppRoutes } from './routes/AppRoutes';
import logo from './logo.svg';
import { Link } from 'react-router-dom';
import { isSame, Route } from './routes/lib';
import { dispatchWithError } from './store/lib';

const drawerWidth = 240;

const appBarHeight: CSSProperties = {
  maxHeight: 64,
};

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
      ...appBarHeight,
      justifyContent: 'flex-end',
    },
    // necessary for content to be below app bar
    toolbar: {
      ...theme.mixins.toolbar,
      ...appBarHeight,
    },
    logo: {
      width: '100%',
      maxWidth: '100%',
      ...appBarHeight,
      objectFit: 'cover',
    },
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
  const classes = useStyles();
  const theme = useTheme();

  const [auth, setAuth] = React.useState(useAppSelector(isLoggedIn));
  const [loading, setLoading] = React.useState(false);
  useEffect(
    () =>
      asEffectReset(
        concat(
          of(isLoggedIn(store.getState())),
          getState$().pipe(map(isLoggedIn))
        )
          .pipe(distinctUntilChanged())
          .subscribe((loggedIn) => {
            setAuth(loggedIn);
            if (loggedIn) {
              setLoading(true);
              dispatchWithError(fetchAccount())
                .catch((error) => {
                  store.dispatch(
                    showSnackbar({
                      content: 'Failed to load profile: ' + error.message,
                      severity: 'error',
                    })
                  );
                })
                .finally(() => setLoading(false));
            }
          })
      ),
    []
  );
  useEffect(
    () =>
      asEffectReset(
        authorizedError$
          .pipe(filter(() => isLoggedIn(store.getState())))
          .subscribe(() => {
            store.dispatch(logout());
            store.dispatch(
              showSnackbar({
                content: 'Your session expired, please, log in again.',
                severity: 'error',
              })
            );
          })
      ),
    []
  );
  useEffect(
    () =>
      asEffectReset(
        logout$.subscribe(() => {
          store.dispatch(clearOrders());
        })
      ),
    []
  );

  const [anchorEl, setAnchorEl] = React.useState<Nullable<HTMLElement>>(null);
  const open = Boolean(anchorEl);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    store.dispatch(logout());
    handleClose();
  };

  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <img src={logo} alt="FairSonority" className={classes.logo} />
      </div>
      <Divider />
      <List>
        {auth ? (
          <>
            <ListItem
              component={Link}
              button
              to={Route.MyOrders}
              selected={isSame(Route.MyOrders)}
            >
              <ListItemIcon>
                <Assignment />
              </ListItemIcon>
              <ListItemText> My Orders</ListItemText>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem
              component={Link}
              button
              to={Route.Login}
              selected={isSame(Route.Login)}
            >
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText> Login</ListItemText>
            </ListItem>
            <ListItem
              component={Link}
              button
              to={Route.Register}
              selected={isSame(Route.Register)}
            >
              <ListItemIcon>
                <PersonAdd />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;

  return (
    <div className={classes.root}>
      <DocumentTitle />
      <CssBaseline />
      <AppSnackbar />
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
            <AppTitle />
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
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <Button color="inherit" component={Link} to={Route.Login}>
              Login
            </Button>
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
        <LinearProgress className={loading ? '' : 'hidden'} />
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
