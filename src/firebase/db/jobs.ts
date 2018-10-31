import { Dispatch } from 'redux';
import { ActionTypes, jobStateStore } from '../../store';
import { Job } from '../../types';
import { FirebaseJob } from '../types';
import { jobsCollection } from './';

// LOAD JOBS
export const load = (userId: string, dispatch: Dispatch<ActionTypes>) => {
  jobsCollection.where('userId', '==', userId)
    .orderBy('name').get().then((querySnapshot: any) => {
    const jobList: Job[] = [];
    querySnapshot.forEach((doc: any) => {
      const job: Job = doc.data();
      job.id = doc.id;
      jobList.push(job);
    });
    dispatch(jobStateStore.loadJobs(jobList));
  }).catch((err: any) => {
    console.log(err.message);
  });
}

// ADD JOB
export const add = (job: FirebaseJob, dispatch: Dispatch<ActionTypes>) => {
  jobsCollection.add(job).then(() => {
    let newJob: Job;
    jobsCollection.where('name', '==', job.name)
    .where('userId', '==', job.userId).get()
      .then((querySnapshot: any) => {
        newJob = querySnapshot.docs[0].data();
        newJob.id = querySnapshot.docs[0].id;
        // Dispatch to state
        dispatch(jobStateStore.addJob(newJob));
      }).catch((err: any) => {
        console.log(err.message);
      });
  }).catch((err: any) => {
    console.log(err.message);
  });
}

// EDIT JOB
export const edit = (job: Job, dispatch: Dispatch<ActionTypes>) => {
  jobsCollection.doc(job.id).update(job).then(() => {
    dispatch(jobStateStore.editJob(job));
  }).catch((err: any) => {
    console.log(err.message);
  });
}

// DELETE JOB
export const remove = (id: string, dispatch: Dispatch<ActionTypes>) => {
  jobsCollection.doc(id).delete().then(() => {
    dispatch(jobStateStore.deleteJob(id));
    console.log(`Document ${id} successfully deleted!`);
  }).catch((err: any) => {
    console.log("Error removing document: ", err.message);
  });
}
