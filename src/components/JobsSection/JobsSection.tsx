import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { AddJobDialog, JobItem } from '../';
import { ActionTypes, AppState } from '../../store';
import { Job, User } from '../../types';
import { sorter } from '../../utility';

interface JobsSectionProps {}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  currentUser: User | null;
  jobs: Job[];
}

interface JobsSectionMergedProps extends
  StateMappedProps,
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
    const { jobs } = this.props;
    const sortedJobs = sorter.sort(jobs.filter((job) => 
      this.props.currentUser && job.userId === this.props.currentUser.id), 'desc', 'name')

    return (
      <div className="jobsSection">
        {this.state.showDialog && <AddJobDialog toggleDialog={this.toggleDialog} />}
        <div className="jobsSection_header">
          <h2>Jobs</h2>
          <div className="jobsSection_header-icons">
            <i className="fas fa-plus jobsSection_header-add" onClick={this.toggleDialog} />
          </div>
        </div>
        <div className="jobsSection_jobs">
          {sortedJobs.length > 0 ? sortedJobs.map((job) => (
            <JobItem key={job.id} job={job} />
          )) :
            <h3 className="jobsSection_none">No Jobs</h3>
          }
        </div>
      </div>
    )
  }

  private toggleDialog = () => this.setState({ showDialog: !this.state.showDialog });
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  currentUser: state.sessionState.currentUser,
  jobs: state.jobsState.jobs,
});

export const JobsSection = connect<
  StateMappedProps,
  DispatchMappedProps,
  JobsSectionProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedJobsSection);
