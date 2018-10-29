import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { DeleteDialog } from '../';
import { db } from '../../firebase';
import { ActionTypes, AppState } from '../../store';
import { Job, User } from '../../types';
import { formatter } from '../../utility';

interface JobItemProps {
  job: Job;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  currentUser: User | null;
  jobs: Job[];
}

interface JobItemMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  JobItemProps {}

interface JobItemState {
  deleteJobId: string;
  editJobName: boolean;
  editJobYTD: boolean;
  jobName: string;
  jobYTD: number;
  showDeleteDialog: boolean;
}

export class DisconnectedJobItem extends React.Component<JobItemMergedProps, JobItemState> {
  public readonly state: JobItemState = {
    deleteJobId: '',
    editJobName: false,
    editJobYTD: false,
    jobName: this.props.job.name || '',
    jobYTD: this.props.job.ytd || 0,
    showDeleteDialog: false,
  }

  public render () {
    const { editJobName, editJobYTD, jobName, jobYTD } = this.state;
    const { job } = this.props;

    return (
      <div className="jobItem">
        {this.state.showDeleteDialog && 
          <DeleteDialog
            confirmDelete={this.onDelete}
            text="Are you sure you want to delete this job?"
            toggleDialog={this.toggleDeleteDialog}
          />
        }
        <div className="jobItem_item">
          {editJobName ?
            <input
              className="jobItem_input"
              defaultValue={jobName}
              onBlur={this.handleBlur}
              onChange={(e) => this.handleChange(e, 'jobName')}
              onKeyPress={this.handleKeyPress}
              type="text"
            /> :
            <h3 className="jobItem_item-name" onClick={this.toggleEditJobName}>{ job.name }</h3>
          }
          <div className="jobItem_icons">
          {editJobYTD ?
            <input
              className="jobItem_input jobItem_input-number"
              onBlur={this.handleBlur}
              onChange={(e) => this.handleChange(e, 'jobYTD')}
              onKeyPress={this.handleKeyPress}
              step="0.01"
              type="number"
              value={jobYTD}
            /> :
            <h3 className="jobItem_item-name" onClick={this.toggleEditJobYTD}>
              YTD:{' '}
              <span className="jobItem_item-number">{ formatter.formatMoney(job.ytd) }</span>
            </h3>
          }
            <i className="fas fa-trash-alt jobItem_icon" onClick={() => this.onDeleteJob(job.id)} />
          </div>
        </div>
        
      </div>
    )
  }

  private toggleEditJobName = () => this.setState({ editJobName: !this.state.editJobName });

  private toggleEditJobYTD = () => this.setState({ editJobYTD: !this.state.editJobYTD });

  private toggleDeleteDialog = () => this.setState({ showDeleteDialog: !this.state.showDeleteDialog });

  private onDeleteJob = (id: string) => {
    this.setState({ deleteJobId: id });
    this.toggleDeleteDialog();
  }

  private onDelete = () => {
    const { deleteJobId } = this.state;
    const { dispatch } = this.props;
    db.requests.jobs.remove(deleteJobId, dispatch);
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, propertyName: string) => {
    if (propertyName === 'jobYTD') {
      this.setState({ jobYTD: parseFloat(event.target.value) });
    } else {
      this.setState({
        [propertyName]: event.target.value as string| boolean | number
      } as Pick<JobItemState, keyof JobItemState>)
    }
  }

  // Listen for enter key
  private handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.charCode === 13) {
      this.handleBlur();
    }
  }

  private handleBlur = () => {
    const { jobName, jobYTD } = this.state;
    const { dispatch, job } = this.props;
    const isInvalid = !jobName || !jobYTD || isNaN(jobYTD);
    const hasChanged = jobName !== job.name || jobYTD !== job.ytd;
    if (!isInvalid && hasChanged) {
      const updatedJob: Job = {
        ...job,
        name: jobName,
        ytd: jobYTD,
      }
      db.requests.jobs.edit(updatedJob, dispatch);
    }
    this.setState({
      editJobName: false,
      editJobYTD: false,
    });
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  currentUser: state.sessionState.currentUser,
  jobs: state.jobsState.jobs,
});

export const JobItem = connect<
  StateMappedProps,
  DispatchMappedProps,
  JobItemProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedJobItem);
