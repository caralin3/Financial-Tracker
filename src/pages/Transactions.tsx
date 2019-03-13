import { Theme, withStyles } from '@material-ui/core';
// import Add from '@material-ui/icons/Add';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { withAuthorization } from '../auth/withAuthorization';
import { DataTable, Layout } from '../components';
import { ApplicationState } from '../store/createStore';
import { User } from '../types';

export interface TransactionsPageProps {
  classes: any;
}

interface DispatchMappedProps {
  dispatch: Dispatch<any>;
}

interface StateMappedProps {
  currentUser: User | null;
}

interface TransactionsMergedProps
  extends RouteComponentProps<any>,
    StateMappedProps,
    DispatchMappedProps,
    TransactionsPageProps {}

const DisconnectedTransactionsPage: React.SFC<TransactionsMergedProps> = props => {
  return (
    <Layout>
      <DataTable />
    </Layout>
  );
};

const styles = (theme: Theme) => ({
  title: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    [theme.breakpoints.down('sm')]: {
      fontSize: 22
    }
  }
});

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({ dispatch });

const mapStateToProps = (state: ApplicationState) => ({
  currentUser: state.sessionState.currentUser
});

export const TransactionsPage = compose(
  withRouter,
  withAuthorization(authCondition),
  withStyles(styles as any, { withTheme: true }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedTransactionsPage);
