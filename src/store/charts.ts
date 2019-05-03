import { Chart } from '../types';

export interface SetChartsAction {
  charts: Chart[];
  type: 'SET_CHARTS';
}

export const SET_CHARTS = 'SET_CHARTS';

export const setCharts = (charts: Chart[]): SetChartsAction => ({
  charts,
  type: SET_CHARTS
});

export interface AddChartAction {
  chart: Chart;
  type: 'ADD_CHART';
}

export const ADD_CHART = 'ADD_CHART';

export const addChart = (chart: Chart): AddChartAction => ({
  chart,
  type: ADD_CHART
});

export interface EditChartAction {
  chart: Chart;
  type: 'EDIT_CHART';
}

export const EDIT_CHART = 'EDIT_CHART';

export const editChart = (chart: Chart): EditChartAction => ({
  chart,
  type: EDIT_CHART
});

export interface DeleteChartAction {
  id: string;
  type: 'DELETE_CHART';
}

export const DELETE_CHART = 'DELETE_CHART';

export const deleteChart = (id: string): DeleteChartAction => ({
  id,
  type: DELETE_CHART
});

export type ChartActions = AddChartAction | DeleteChartAction | EditChartAction | SetChartsAction;

export interface ChartsState {
  charts: Chart[];
}

const initialState: ChartsState = {
  charts: []
};

export const reducer = (state: ChartsState = initialState, action: ChartActions) => {
  switch (action.type) {
    case SET_CHARTS: {
      return {
        ...state,
        charts: action.charts
      };
    }
    case ADD_CHART: {
      return {
        ...state,
        charts: [...state.charts, action.chart]
      };
    }
    case EDIT_CHART: {
      return {
        ...state,
        charts: [...state.charts.filter((ch: Chart) => ch.id !== action.chart.id), action.chart]
      };
    }
    case DELETE_CHART: {
      return {
        ...state,
        charts: state.charts.filter((acc: Chart) => acc.id !== action.id)
      };
    }
    default:
      return state;
  }
};
