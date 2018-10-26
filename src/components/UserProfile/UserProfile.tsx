import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { LogoutButton } from '../';
import { ActionTypes, AppState } from '../../store';
import { User } from '../../types';

interface UserProfileProps {}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  currentUser: User | null;
}

interface UserProfileMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  UserProfileProps {}

interface UserProfileState {
  showDialog: boolean;
}

export class DisconnectedUserProfile extends React.Component<UserProfileMergedProps, UserProfileState> {
  public readonly state: UserProfileState = {
    showDialog: false,
  }
  
  public render () {
    const { currentUser } = this.props;
    return (
      <div className="userProfile">
        <div className="userProfile_header">
          <h2>User Profile</h2>
          <LogoutButton />
        </div>
        <div className="userProfile_profile">
          <h3 className="userProfile_profile_text">
            <strong className="userProfile_profile_label">Name:</strong>
            { ` ${currentUser && currentUser.firstName} ${currentUser && currentUser.lastName}` }
          </h3>
          <h3 className="userProfile_profile_text">
            <strong className="userProfile_profile_label">Email: </strong>
            { currentUser && currentUser.email }
          </h3>
          <h3 className="userProfile_profile_reset">
            Reset Password
          </h3>
        </div>
      </div>
    )
  }

  // private toggleDialog = () => this.setState({ showDialog: !this.state.showDialog });
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  currentUser: state.sessionState.currentUser,
});

export const UserProfile = connect<
  StateMappedProps,
  DispatchMappedProps,
  UserProfileProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedUserProfile);
