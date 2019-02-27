import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
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
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
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
  open: boolean;
}

class DisconnectedNavigation extends React.Component<SignUpMergedProps, NavigationState> {
  public readonly state: NavigationState = {
    open: true
  }

  public render() {
    const { classes } = this.props;

    const links = [
      {label: 'Dashboard', route: routes.dashboard, icon: <HomeIcon />},
      {label: 'Transactions', route: routes.dashboard, icon: <CreditCardIcon />},
      {label: 'Accounts', route: routes.dashboard, icon: <AccountBoxIcon />},
      {label: 'Reports', route: routes.dashboard, icon: <BarChartIcon />},
      {label: 'Categories', route: routes.dashboard, icon: <ListAltIcon />},
      {label: 'Settings', route: routes.dashboard, icon: <SettingsIcon />},
      {label: 'Logout', route: routes.landing, icon: <ExitToAppIcon />},
    ]

    return (
      <div className="nav">
          <Drawer
            variant="permanent"
            className={classNames(classes.drawer,
              'show-medium', {
              [classes.drawerOpen]: this.state.open,
              [classes.drawerClose]: !this.state.open,
            })}
            classes={{
              paper: classNames('show-medium', {
                [classes.drawerOpen]: this.state.open,
                [classes.drawerClose]: !this.state.open,
              }),
            }}
            open={this.state.open}
          >
            <List>
              {links.slice(0, 4).map((link, index) => (
                <ListItem button={true} key={link.label}>
                  <Link className="navLink" to={link.route}>
                    <ListItemIcon>{link.icon}</ListItemIcon>
                    <ListItemText primary={link.label} />
                  </Link>
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {links.slice(4).map((link, index) => (
                <ListItem button={true} key={link.label}>
                  <Link className="navLink" to={link.route}>
                    <ListItemIcon>{link.icon}</ListItemIcon>
                    <ListItemText primary={link.label} />
                  </Link>
                </ListItem>
              ))}
            </List>
            <div className={classes.toolbar}>
              <IconButton onClick={this.handleDrawer}>
                {this.state.open ? 
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
            <Toolbar disableGutters={!this.state.open}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawer}
                className={classNames(classes.menuButton, {
                  [classes.hide]: this.state.open,
                })}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" noWrap={true}>
                Mini variant drawer
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
        {/* <div className="sidebar show-medium">
          <span className="sidebar__icon fa-stack fa-2x">
            <i className="sidebar__circle fas fa-circle fa-stack-2x" />
            <i className="sidebar__symbol fas fa-university fa-stack-1x fa-inverse" />
          </span>
          <NavLink path={routes.dashboard} label="Dashboard" icon="fa-newspaper" />
          <NavLink path={routes.dashboard} label="Transactions" icon="fa-credit-card" />
          <NavLink path={routes.dashboard} label="Accounts" icon="fa-money-check" />
          <NavLink path={routes.dashboard} label="Reports" icon="fa-chart-line" />
          <NavLink path={routes.dashboard} label="Categories" icon="fa-list" />
          <NavLink path={routes.dashboard} label="Settings" icon="fa-cog" />
          <NavLink path={routes.dashboard} label="Logout" icon="fa-sign-out-alt" />
        </div> */}

        {/* Mobile Menu */}
        {/* <div className="header show-small">
          <i className="header__menu--open fas fa-bars" />
          <i className="header__menu--close fas fa-times" />
        </div> */}
      </div>
    )
  }

  private handleDrawer = () => {
    this.setState({ open: !this.state.open });
  };
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
      width: theme.spacing.unit * 9 + 1,
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
    alignItems: 'center',
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

// interface NavLinkProps {
//   icon: string;
//   label: string;
//   path: string;
// }

// const NavLink: React.SFC<NavLinkProps> = ({icon, label, path}) => (
//   <Link className="navLink" to={path}>
//     <i className={`navLink__icon fas ${icon}`} />
//     <span className="navLink__label">{label}</span>
//   </Link>
// )
