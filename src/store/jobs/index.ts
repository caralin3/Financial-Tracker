import {
  addJob,
  // addDeletedJob,
  deleteJob,
  editJob,
  loadJobs,
  removeDeletedJob,
  resetDeletedJobs,
} from './actions';
import { reducer } from './reducer';

export const jobStateStore = {
  addJob,
  // addDeletedJob,
  deleteJob,
  editJob,
  loadJobs,
  reducer,
  removeDeletedJob,
  resetDeletedJobs,
};

export { JobActions } from './actions';
export { JobsState } from './reducer';
