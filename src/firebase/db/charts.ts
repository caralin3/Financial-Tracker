import config from '../../config';
import { Chart } from '../../types';
import { sort } from '../../util';
import { FBChart } from '../types';
import { chartsCollection } from './';

// CREATE CHART
export const createChart = (chart: FBChart, addChart: (ch: Chart) => void) =>
  chartsCollection
    .add(chart)
    .then(doc => {
      // Set chart in store
      addChart({ id: doc.id, ...chart });
      if (config.env === 'development') {
        console.log('Chart written with ID: ', doc.id);
      }
      return true;
    })
    .catch(error => {
      console.error('Error adding chart: ', error);
      return false;
    });

// READ CHARTS
export const getAllCharts = (userId: string) =>
  chartsCollection.get().then(querySnapshot => {
    const charts: Chart[] = [];
    querySnapshot.forEach(doc => {
      if (doc.data().userId === userId) {
        charts.push({
          id: doc.id,
          ...doc.data()
        } as Chart);
      }
    });
    return sort(charts, 'desc', 'category.name');
  });

// UPDATE CHART
export const updateChart = (chart: Chart, editChart: (ch: Chart) => void) =>
  chartsCollection
    .doc(chart.id)
    .update(chart)
    .then(() => {
      // Edit chart in store
      editChart(chart);
      if (config.env === 'development') {
        console.log('Chart updated with ID: ', chart.id);
      }
      return true;
    })
    .catch(error => {
      console.error('Error updating chart: ', error);
      return false;
    });

// DELETE CHART
export const deleteChart = (id: string, removeChart: (id: string) => void) =>
  chartsCollection
    .doc(id)
    .delete()
    .then(() => {
      // Delete chart in store
      removeChart(id);
      if (config.env === 'development') {
        console.log('Chart deleted with ID: ', id);
      }
      return true;
    })
    .catch(error => {
      console.error('Error deleting chart: ', id, error);
      return false;
    });
