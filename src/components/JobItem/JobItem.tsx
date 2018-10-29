import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { DeleteDialog } from '../';
import { db } from '../../firebase';
import { ActionTypes, AppState } from '../../store';
import { Job, User } from '../../types';
// import { sorter } from '../../utility';

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
  editJob: boolean;
  jobName: string;
  showDeleteDialog: boolean;
}

export class DisconnectedJobItem extends React.Component<JobItemMergedProps, JobItemState> {
  public readonly state: JobItemState = {
    deleteJobId: '',
    editJob: false,
    jobName: '',
    showDeleteDialog: false,
  }

  public render () {
    const { editJob } = this.state;
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
          {editJob ?
            <input
              className="jobItem_input"
              defaultValue={job.name}
              onBlur={this.handleBlur}
              onChange={(e) => this.handleChange(e, 'jobName')}
              onKeyPress={this.handleKeyPress}
              type="text"
            /> :
            <h3 className="jobItem_item-name" onClick={this.toggleEditJob}>{ job.name }</h3>
          }
          <div className="jobItem_icons">
            <i className="fas fa-edit jobItem_icon" onClick={this.toggleEditJob} />
            <i className="fas fa-trash-alt jobItem_icon" onClick={() => this.onDeleteJob(job.id)} />
          </div>
        </div>
        
      </div>
    )
  }

  private toggleEditJob = () => this.setState({ editJob: !this.state.editJob });

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
    this.setState({
      [propertyName]: event.target.value as string | boolean,
    } as Pick<JobItemState, keyof JobItemState>)
  }

  // Listen for enter key
  private handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.charCode === 13) {
      this.handleBlur();
    }
  }

  private handleBlur = () => {
    // const { jobId } = this.state;
    // const { currentUser, dispatch, jobs } = this.props;
    
    // const currentJob = jobs.filter((j) => currentUser && j.userId === currentUser.id &&
    //   j.id === this.props.job.id)[0];;

  // if (jobId) {
  //   const updatedJob: Job = {
  //     ...currentJob,
  //     name: category,
  //   }
  //   db.requests.jobs.edit(updatedJob, dispatch);
  //   this.setState({
  //     jobId: '',
  //     editJob: false,
  //   });
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
