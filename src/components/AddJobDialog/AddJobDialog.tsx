import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Dialog, Form } from '..';
import { db } from '../../firebase';
import { FirebaseJob } from '../../firebase/types';
import { ActionTypes, AppState } from '../../store';
import { JobType, User } from '../../types';

interface AddJobDialogProps {
  class?: string;
  toggleDialog: () => void;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  currentUser: User | null;
}

interface AddJobDialogMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  AddJobDialogProps {}

interface AddJobDialogState {
  name: string;
  type: JobType;
  ytd: number;
}

export class DisconnectedAddJobDialog extends React.Component<AddJobDialogMergedProps, AddJobDialogState> {
  public readonly state: AddJobDialogState = {
    name: '',
    type: 'Salary',
    ytd: 0,
  }

  public render() {
    const { ytd, name, type } = this.state;

    const isInvalid = !name || !type;

    return (
      <Dialog title="Add Job" toggleDialog={this.props.toggleDialog}>
        <Form buttonText="Add" disabled={isInvalid} submit={this.onSubmit}>
          <div className="addJobDialog_section">
            <label className="addJobDialog_input-label">Job Name</label>
            <input
              className="addJobDialog_input"
              onChange={(e) => this.handleChange(e, 'name')}
              placeholder="Job Name"
              type="text"
              value={name}
            />
          </div>
          <div className="addJobDialog_section">
            <label className="addJobDialog_input-label">Year to Date ($)</label>
            <input
              className="addJobDialog_input addJobDialog_number"
              onChange={(e) => this.handleChange(e, 'ytd')}
              placeholder="Year to Date"
              step="0.01"
              type="number"
              value={ytd}
            />
          </div>
          <div className="addJobDialog_section">
            <label className="addJobDialog_input-label">Job Type</label>
            <select className="addJobDialog_select" onChange={(e) => this.handleChange(e, 'type')}>
              <option value="Salary">Salary</option>
              <option value="Bonus">Bonus</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </Form>
      </Dialog>
    )
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, propertyName: string) => {
    switch(propertyName) {
      case 'ytd':
        this.setState({ ytd: parseFloat(event.target.value)});
        return;
      case 'name':
        this.setState({ name: event.target.value});
        return;
      case 'type':
        this.setState({ type: event.target.value as JobType });
        return;
      default:
        return;
    }
  }

  private onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const { name, type, ytd } = this.state;
    const { currentUser, dispatch, toggleDialog } = this.props;
    e.preventDefault();
    if (currentUser) {
      const newJob: FirebaseJob = {
        name,
        type,
        userId: currentUser.id,
        ytd,
      }
      db.requests.jobs.add(newJob, dispatch);
    }
    toggleDialog();
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  currentUser: state.sessionState.currentUser,
});

export const AddJobDialog = connect<
  StateMappedProps,
  DispatchMappedProps,
  AddJobDialogProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedAddJobDialog);
