import { Typography } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { withAuthorization } from '../auth/withAuthorization';
import { DropdownMenu, Layout } from '../components';
import { ApplicationState } from '../store/createStore';
import { User } from '../types';

export interface DashboardPageProps {}

interface DispatchMappedProps {
  dispatch: Dispatch<any>;
}

interface StateMappedProps {
  currentUser: User | null;
}

interface DashboardMergedProps
  extends RouteComponentProps<any>,
    StateMappedProps,
    DispatchMappedProps,
    DashboardPageProps {}

const DisconnectedDashboardPage: React.SFC<DashboardMergedProps> = props => {
  const [selected, setSelected] = React.useState<number>(0);

  const menuItems = [
    { label: 'This Week', value: 0 },
    { label: 'Last Week', value: 1 },
    { label: 'This Month', value: 2 },
    { label: 'Last Month', value: 3 },
    { label: 'Custom Range', value: 4 }
  ];

  const handleMenu = (e: any) => {
    setSelected(e.currentTarget.attributes.getNamedItem('data-value').value);
  };

  return (
    <Layout>
      <div className="dashboard_header">
        <div className="dashboard_headerContent">
          <Typography className="dashboard_title" variant="h3">
            Dashboard
          </Typography>
          <DropdownMenu selected={menuItems[selected].label} menuItems={menuItems} onClose={handleMenu} />
        </div>
        <hr className="dashboard_divider" />
      </div>
      <div className="show-small">
        <DropdownMenu
          className="dashboard_mobileButton"
          menuListClass="dashboard_mobileMenuList"
          selected={menuItems[selected].label}
          menuItems={menuItems}
          onClose={handleMenu}
        />
      </div>
      <Typography>{props.currentUser ? props.currentUser.firstName : 'None'}</Typography>
    </Layout>
  );
};

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({ dispatch });

const mapStateToProps = (state: ApplicationState) => ({
  currentUser: state.sessionState.currentUser
});

export const DashboardPage = compose(
  withRouter,
  withAuthorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedDashboardPage);
