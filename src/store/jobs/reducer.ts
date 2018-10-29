
import { Job } from '../../types';
import { JobActions } from './actions';
import {
  // ADD_DELETED_JOB,
  ADD_JOB,
  DELETE_JOB,
  EDIT_JOB,
  LOAD_JOBS,
  // REMOVE_DELETED_JOB,
  // RESET_DELETED_JOBS,
} from './constants';

export interface JobsState {
  jobs: Job[];
  // deletedJobs: string[];
}

const initialState: JobsState = {
  jobs: [],
  // deletedJobs: [],
}

export const reducer = (state: JobsState = initialState, action: JobActions) => {
  switch (action.type) {
    case LOAD_JOBS: {
      return {
        ...state,
        jobs: action.jobs,
      }
    }
    case ADD_JOB: {
      return {
        ...state,
        jobs: [...state.jobs, action.job],
      }
    }
    case EDIT_JOB: {
      return {
        ...state,
        jobs: [
          ...state.jobs.filter((acc: Job) => acc.id !== action.job.id),
          action.job,
        ],
      }
    }
    case DELETE_JOB: {
      return {
        ...state,
        jobs: state.jobs.filter((acc: Job) => acc.id !== action.id),
      }
    }
    // case ADD_DELETED_JOB: {
    //   return {
    //     ...state,
    //     deletedJobs: [...state.deletedJobs, action.id],
    //   }
    // }
    // case REMOVE_DELETED_JOB: {
    //   return {
    //     ...state,
    //     deletedJobs: state.deletedJobs.filter((id: string) => id !== action.id),
    //   }
    // }
    // case RESET_DELETED_JOBS: {
    //   return {
    //     ...state,
    //     deletedJobs: [],
    //   }
    // }
    default:
      return state;
  }
}
