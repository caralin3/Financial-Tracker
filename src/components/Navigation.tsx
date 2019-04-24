import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Typography,
  withStyles
} from '@material-ui/core';
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
import { theme } from '../appearance';
import { auth } from '../firebase';
import { routes } from '../routes';
import { sessionState } from '../store';
import { ApplicationState } from '../types';
import { DoubleLeftChevronIcon, DoubleRightChevronIcon } from './';

interface NavigationProps {
  classes: any;
  theme: any;
}

interface DispatchMappedProps {
  setDrawerExpanded: (open: boolean) => void;
}

interface StateMappedProps {
  drawerExpanded: boolean;
}

interface NavigationMergedProps extends RouteComponentProps, StateMappedProps, DispatchMappedProps, NavigationProps {}

interface NavigationState {
  open: boolean;
  selected: string;
}

class DisconnectedNavigation extends React.Component<NavigationMergedProps, NavigationState> {
  public readonly state: NavigationState = {
    open: false,
    selected: ''
  };

  public componentDidMount() {
    const { pathname } = this.props.location;
    this.setState({ selected: pathname });
  }

  public render() {
    const { classes, drawerExpanded, setDrawerExpanded } = this.props;
    const { open, selected } = this.state;

    const links = [
      { label: 'Dashboard', route: routes.dashboard, icon: <HomeIcon /> },
      {
        icon: <CreditCardIcon />,
        label: 'Transactions',
        route: routes.transactions
      },
      { label: 'Accounts', route: routes.accounts, icon: <AccountBoxIcon /> },
      { label: 'Reports', route: routes.reports, icon: <BarChartIcon /> },
      { label: 'Categories', route: routes.categories, icon: <ListAltIcon /> },
      { label: 'Settings', route: routes.settings, icon: <SettingsIcon /> }
    ];

    let title: string = selected.split('/')[1];
    if (title) {
      title = `${title.slice(0, 1).toUpperCase()}${title.slice(1)}`;
    }

    const navList = (
      <div className={classNames('navList', classes.navBar)}>
        <div
          className={classNames('navList_icon fa-stack fa-2x', {
            ['navList_closed']: !drawerExpanded || (!drawerExpanded && !open)
          })}
        >
          <i className="navList_circle fas fa-circle fa-stack-2x" />
          <i className="navList_symbol fa-stack-1x fas fa-university " />
        </div>
        <List>
          {links.slice(0, 4).map(link => (
            <li key={link.label}>
              <ListItem
                className={classNames(classes.activeItem, classes.text, {
                  [classes.selectedItem]: selected.startsWith(link.route)
                })}
                button={true}
                onClick={() => this.navigateTo(link.route)}
                onKeyDown={e => this.handleKey(e, link.route)}
                selected={selected === link.route}
              >
                <ListItemIcon>{link.icon}</ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItem>
            </li>
          ))}
        </List>
        <Divider variant="middle" />
        <List>
          {links.slice(4).map(link => (
            <li key={link.label}>
              <ListItem
                className={classNames(classes.activeItem, classes.text, {
                  [classes.selectedItem]: selected === link.route
                })}
                button={true}
                key={link.label}
                onClick={() => this.navigateTo(link.route)}
                onKeyDown={e => this.handleKey(e, link.route)}
              >
                <ListItemIcon>{link.icon}</ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItem>
            </li>
          ))}
          <li>
            <ListItem
              className={classNames(classes.activeItem, classes.text)}
              button={true}
              onClick={this.logout}
              onKeyDown={this.handleKeyLogout}
            >
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </li>
        </List>
      </div>
    );

    return (
      <div>
        <Drawer
          variant="permanent"
          className={classNames(classes.drawer, 'show-medium', {
            [classes.drawerExpanded]: drawerExpanded,
            [classes.drawerClose]: !drawerExpanded
          })}
          classes={{
            paper: classNames(classes.navBar, 'show-medium', {
              [classes.drawerExpanded]: drawerExpanded,
              [classes.drawerClose]: !drawerExpanded
            })
          }}
          open={drawerExpanded}
        >
          {navList}
          <div className={classes.toolbar}>
            <IconButton aria-label="expander" onClick={() => setDrawerExpanded(!drawerExpanded)}>
              {drawerExpanded ? <DoubleLeftChevronIcon /> : <DoubleRightChevronIcon />}
            </IconButton>
          </div>
        </Drawer>
        <div className="show-small">
          <AppBar position="fixed" className={classes.navBar}>
            <Toolbar disableGutters={true}>
              <IconButton color="inherit" aria-label="Open drawer" onClick={() => this.setState({ open: !open })}>
                {!open && <MenuIcon />}
              </IconButton>
              <Typography className="navList_heading" variant="h6" color="inherit" noWrap={true}>
                {title}
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
    );
  }

  private navigateTo = (link: string) => {
    this.props.history.push(link);
    this.setState({
      open: false,
      selected: link
    });
  };

  private handleKey = (e: React.KeyboardEvent<HTMLElement>, link: string) => {
    if (e.keyCode === 13) {
      this.navigateTo(link);
      this.setState({ open: false });
    }
  };

  private handleKeyLogout = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.keyCode === 13) {
      this.logout();
      this.setState({ open: false });
    }
  };

  private logout = () => {
    auth
      .doSignOut()
      .then(() => {
        console.log('Logged out');
        this.props.history.push(routes.landing);
      })
      .catch((error: any) => {
        console.error('Error logging out', error);
      });
  };
}

const drawerWidth = 200;

const styles = {
  activeItem: {
    '&:hover, &:active, &:focus': {
      '& *': {
        color: `${theme.palette.primary.dark} !important`
      },
      backgroundColor: `${theme.palette.primary.light} !important`
    }
  },
  drawer: {
    flexShrink: 0,
    whiteSpace: 'nowrap',
    width: drawerWidth
  },
  drawerClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp
    }),
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 7.5 + 1
    }
  },
  drawerExpanded: {
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.sharp
    }),
    width: drawerWidth
  },
  navBar: {
    background: theme.palette.primary.main
  },
  selectedItem: {
    '& *': {
      color: `${theme.palette.primary.dark} !important`
    },
    backgroundColor: `${theme.palette.primary.light} !important`
  },
  text: {
    '& *': {
      color: theme.palette.common.white,
      fontFamily: 'FrancoisOne, sans-serif',
      fontWeight: 'bold'
    }
  },
  toolbar: {
    alignItems: 'flex-end',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  }
};

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchMappedProps => ({
  setDrawerExpanded: (open: boolean) => dispatch(sessionState.setDrawerExpanded(open))
});

const mapStateToProps = (state: ApplicationState) => ({
  drawerExpanded: state.sessionState.drawerExpanded
});

export const Navigation = compose(
  withRouter,
  withStyles(styles as any, { withTheme: true }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedNavigation);
