import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
// import { Dispatch } from 'redux';
// import { db } from '../firebase';
import { withAuthorization } from '../auth/withAuthorization';

// tslint:disable:no-empty-interface
interface IHomePageProps {}

interface IDispatchProps {
  onSetUsers: (users: any) => void
}

interface IStateProps {
  users: any
}

interface IHomePageMergedProps extends
  IStateProps,
  IDispatchProps,
  IHomePageProps {}

interface IHomePageState {}

class HomeComponent extends React.Component<IHomePageMergedProps, IHomePageState> {
  public readonly state: IHomePageState = {}

  public componentDidMount() {
    // const { onSetUsers } = this.props;
    // db.onceGetUsers().then((snapshot: any) => onSetUsers(snapshot.val()));
  }

  public render() {
    const { users } = this.props;
    return (
      <div>
        <h1>Home Page</h1>
        <p>The Home Page is accessible by every signed in user.</p>

        { !!users && <UserList users={users} /> }
      </div>
    )
  }
}

const UserList = ({ users }: any) =>
  <div>
    <h2>List of Usernames of Users</h2>
    <p>(Saved on Sign Up in Firebase Database)</p>

    {Object.keys(users).map(key =>
      <div key={key}>{users[key].username}</div>
    )}
  </div>

const mapStateToProps = (state: any) => ({
  users: state.userState.users,
});

const mapDispatchToProps = (dispatch: any) => ({
  onSetUsers: (users: any) => dispatch({ type: 'USERS_SET', users }),
});

const authCondition = (authUser: any) => !!authUser;

export const HomePage = compose(
  withAuthorization(authCondition),
  connect<IStateProps, IDispatchProps, IHomePageProps>(mapStateToProps, mapDispatchToProps)
)(HomeComponent);
