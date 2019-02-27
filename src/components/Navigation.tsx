import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import BarChartIcon from '@material-ui/icons/BarChart';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import ListAltIcon from '@material-ui/icons/ListAlt';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { auth } from '../firebase';
import { routes } from '../routes';

  interface NavigationProps extends RouteComponentProps {
  classes: any;
  theme: any;
}

interface DispatchMappedProps { }

interface SignUpMergedProps extends
  DispatchMappedProps,
  NavigationProps {}

interface NavigationState {
  expanded: boolean;
  open: boolean;
}

class DisconnectedNavigation extends React.Component<SignUpMergedProps, NavigationState> {
  public readonly state: NavigationState = {
    expanded: true,
    open: false
  }

  public render() {
    const { classes } = this.props;
    const { expanded, open } = this.state;

    const links = [
      {label: 'Dashboard', route: routes.dashboard, icon: <HomeIcon />},
      {label: 'Transactions', route: routes.dashboard, icon: <CreditCardIcon />},
      {label: 'Accounts', route: routes.dashboard, icon: <AccountBoxIcon />},
      {label: 'Reports', route: routes.dashboard, icon: <BarChartIcon />},
      {label: 'Categories', route: routes.dashboard, icon: <ListAltIcon />},
      {label: 'Settings', route: routes.dashboard, icon: <SettingsIcon />}
    ]

    const navList = (
      <div className="navList">
        <div className="navList_icon fa-stack fa-2x">
          <i className="navList_circle fas fa-circle fa-stack-2x" />
          <i className="navList_icon fa-stack-1x fas fa-university " />
        </div>
        <List>
          {links.slice(0, 4).map((link) => (
            <ListItem
              button={true}
              key={link.label}
              onClick={() => this.navigateTo(link.route)}
              onKeyDown={(e) => this.handleKey(e, link.route)}
            >
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {links.slice(4).map((link) => (
            <ListItem
              button={true}
              key={link.label}
              onClick={() => this.navigateTo(link.route)}
              onKeyDown={(e) => this.handleKey(e, link.route)}
            >
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItem>
          ))}
          <ListItem button={true} onClick={this.logout} onKeyDown={this.handleKeyLogout}>
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </div>
    )

    return (
      <div className="nav">
          <Drawer
            variant="permanent"
            className={classNames(classes.drawer,
              'show-medium', {
              [classes.drawerOpen]: expanded,
              [classes.drawerClose]: !expanded,
            })}
            classes={{
              paper: classNames('show-medium', {
                [classes.drawerOpen]: expanded,
                [classes.drawerClose]: !expanded,
              }),
            }}
            open={expanded}
          >
            {navList}
            <div className={classes.toolbar}>
              <IconButton onClick={() => this.setState({ expanded: !expanded })}>
                {expanded ? 
                <svg style={{width:'24px', height:'24px'}} viewBox="0 0 24 24">
                <path fill="#000000" d="M18.41,7.41L17,6L11,12L17,18L18.41,16.59L13.83,12L18.41,7.41M12.41,7.41L11,6L5,12L11,18L12.41,16.59L7.83,12L12.41,7.41Z" />
            </svg> :
                <svg style={{width:'24px', height:'24px'}} viewBox="0 0 24 24">
                <path fill="#000000" d="M5.59,7.41L7,6L13,12L7,18L5.59,16.59L10.17,12L5.59,7.41M11.59,7.41L13,6L19,12L13,18L11.59,16.59L16.17,12L11.59,7.41Z" />
                  </svg>}
              </IconButton>
            </div>
          </Drawer>
        <div className="header show-small">
          <AppBar position="fixed" >
            <Toolbar disableGutters={true}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={() => this.setState({ open: !open })}
              >
                {!open && <MenuIcon />}
              </IconButton>
              <Typography variant="h6" color="inherit" noWrap={true}>
                Mini variant drawer
              </Typography>
            </Toolbar>
            <SwipeableDrawer
              open={open}
              onClose={() => this.setState({ open: false })}
              onOpen={() => this.setState({ open: true })}
            >
              {navList}
            </SwipeableDrawer>
          </AppBar>
        </div>
      </div>
    )
  }

  private navigateTo = (link: string) => {
    this.props.history.push(link);
    this.setState({ open: false });
  }

  private handleKey = (e: React.KeyboardEvent<HTMLElement>, link: string) => {
    if (e.keyCode === 13) {
      this.navigateTo(link)
      this.setState({ open: false });
    }
  }

  private handleKeyLogout = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.keyCode === 13) {
      this.logout()
      this.setState({ open: false });
    }
  }

  private logout = () => {
    auth.doSignOut()
    .then(() => {
      console.log('Logged out')
      this.props.history.push(routes.landing);
    })
    .catch((error: any) => {
      console.error('Error logging out', error)
    });
  }
}

const drawerWidth = 200;

const styles = (theme: any) => ({
  drawer: {
    flexShrink: 0,
    whiteSpace: 'nowrap',
    width: drawerWidth,
  },
  drawerClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp,
    }),
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 7.5 + 1,
    },
  },
  drawerOpen: {
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.sharp,
    }),
    width: drawerWidth,
  },
  toolbar: {
    alignItems: 'flex-end',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
});

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchMappedProps => ({ dispatch });

export const Navigation = compose(
  withRouter,
  withStyles(styles as any, { withTheme: true }),
  connect(null, mapDispatchToProps)
)(DisconnectedNavigation);
