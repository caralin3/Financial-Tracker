import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { AddJobDialog } from '../';
// import { db } from '../../firebase';
import { ActionTypes } from '../../store';

interface JobsSectionProps {
  
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface JobsSectionMergedProps extends
  DispatchMappedProps,
  JobsSectionProps {}

interface JobsSectionState {
  showDialog: boolean;
}

export class DisconnectedJobsSection extends React.Component<JobsSectionMergedProps, JobsSectionState> {
  public readonly state: JobsSectionState = {
    showDialog: false,
  }
  
  public render () {
    return (
      <div className="jobsSection">
        {this.state.showDialog && <AddJobDialog toggleDialog={this.toggleDialog} />}
        <div className="jobsSection_header">
          <h2>Jobs</h2>
          <div className="jobsSection_header-icons">
            <i className="fas fa-plus jobsSection_header-add" onClick={this.toggleDialog} />
          </div>
        </div>
      </div>
    )
  }

  private toggleDialog = () => this.setState({ showDialog: !this.state.showDialog });

  // private handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, propertyName: string) => {
  //   switch(propertyName) {
  //     case 'balance':
  //       this.setState({ balance: parseFloat(event.target.value)});
  //       return;
  //     case 'name':
  //       this.setState({ name: event.target.value});
  //       return;
  //     case 'type':
  //       this.setState({ type: event.target.value as AccountType });
  //       return;
  //     default:
  //       return;
  //   }
  // }

  // // Listen for enter key
  // private handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.charCode === 13) {
  //       this.handleBlur();
  //   }
  // }

  // private handleBlur = () => {
  //   const { balance, name, type } = this.state;
  //   const { dispatch, id, userId } = this.props;
    
  //   const isInvalid = isNaN(balance) || !name || type === 'Select Type';
  //   const hasChanged = balance !== this.props.balance || name !== this.props.name || type !== this.props.type;

  //   if (!isInvalid && hasChanged) {
  //     const updatedAccount: Account = {
  //       balance,
  //       id,
  //       name,
  //       type,
  //       userId,
  //     }
  //     db.requests.accounts.edit(updatedAccount, dispatch);
  //   }
  //   this.setState({
  //     editBalance: false,
  //     editName: false,
  //     editType: false,
  //   });
  // }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

export const JobsSection = connect<
  JobsSectionProps,
  DispatchMappedProps
>(null, mapDispatchToProps)(DisconnectedJobsSection);
