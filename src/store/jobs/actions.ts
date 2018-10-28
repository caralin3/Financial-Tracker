import { Job } from '../../types';
import {
  ADD_DELETED_JOB,
  ADD_JOB,
  DELETE_JOB,
  EDIT_JOB,
  LOAD_JOBS,
  REMOVE_DELETED_JOB,
  RESET_DELETED_JOBS,
} from './constants';

export interface LoadJobsAction {
  jobs: Job[];
  type: 'LOAD_JOBS';
}

export const loadJobs = (jobs: Job[]): LoadJobsAction => ({
  jobs,
  type: LOAD_JOBS,
});

export interface AddJobAction {
  job: Job;
  type: 'ADD_JOB';
}

export const addJob = (job: Job): AddJobAction => ({
  job,
  type: ADD_JOB,
});

export interface EditJobAction {
  job: Job;
  type: 'EDIT_JOB';
}

export const editJob = (job: Job): EditJobAction => ({
  job,
  type: EDIT_JOB,
});

export interface DeleteJobAction {
  id: string;
  type: 'DELETE_JOB';
}

export const deleteJob = (id: string): DeleteJobAction => ({
  id,
  type: DELETE_JOB,
});

export interface AddDeletedJobAction {
  id: string;
  type: 'ADD_DELETED_JOB';
}

export const addDeletedJob = (id: string): AddDeletedJobAction => ({
  id,
  type: ADD_DELETED_JOB,
});

export interface RemoveDeletedJobAction {
  id: string;
  type: 'REMOVE_DELETED_JOB';
}

export const removeDeletedJob = (id: string): RemoveDeletedJobAction => ({
  id,
  type: REMOVE_DELETED_JOB,
});

export interface ResetDeletedJobsAction {
  type: 'RESET_DELETED_JOBS';
}

export const resetDeletedJobs = (): ResetDeletedJobsAction => ({
  type: RESET_DELETED_JOBS,
});

export type JobActions =
  AddJobAction |
  AddDeletedJobAction |
  DeleteJobAction |
  EditJobAction |
  LoadJobsAction |
  RemoveDeletedJobAction |
  ResetDeletedJobsAction;
