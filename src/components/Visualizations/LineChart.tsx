import * as React from 'react';
import {
  Crosshair,
  DiscreteColorLegend,
  Highlight,
  HorizontalGridLines,
  LineSeries,
  LineSeriesData,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
} from 'react-vis';
import 'react-vis/dist/style.css';
import { formatter } from '../../utility';

interface LineChartProps {
  className?: string;
  data: LineSeriesData[][];
  height: number;
  leftMargin?: number;
  width: number;
  xAxisTitle?: string;
  yAxisTitle?: string;
}

interface LineChartState {
  crosshairValues: any[];
  lastDrawLocation: {
    bottom: number,
    left: number,
    right: number,
    top: number,
  } | null;
}

export class LineChart extends React.Component<LineChartProps, LineChartState> {
  public readonly state: LineChartState = {
    crosshairValues: [],
    lastDrawLocation: null,
  }

  public render() {
    const { data, height, width, xAxisTitle, yAxisTitle } = this.props;
    const { crosshairValues, lastDrawLocation } = this.state;

    return (
      <div>
      <XYPlot
        animation={true}
        width={width}
        height={height}
        xDomain={
          lastDrawLocation && [
            lastDrawLocation.left,
            lastDrawLocation.right
          ]
        }
        yDomain={
          lastDrawLocation && [
            lastDrawLocation.bottom,
            lastDrawLocation.top
          ]
        }
      >
        <DiscreteColorLegend
          style={{
            backgroundColor: 'rgba(244, 244, 244, 0.75)',
            position: 'absolute',
            right: '10px',
            top: '20px',
          }}
          orientation="vertical"
          items={[
            {
              color: '#0C98AC',
              title: 'Budget',
            },
            {
              color: '#FF0000',
              title: 'Expenses',
            },
            {
              color: '#62D4D9',
              title: 'Income',
            }
          ]}
        />
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis title={xAxisTitle ? xAxisTitle : 'Month'} tickFormat={(d: any) => formatter.months[d]} />
        <YAxis title={yAxisTitle ? yAxisTitle : 'Amount ($)'} />
        <LineSeries
          color='#0C98AC'
          data={data[0]}
          // onNearestX={this.onNearestX}
          // onSeriesMouseOut={this.onMouseLeave}
        />
        <LineSeries
          color='#FF0000'
          data={data[1]}
          // onNearestX={this.onNearestX}
          // onSeriesMouseOut={this.onMouseLeave}
        />
        <LineSeries
          color='#62D4D9'
          data={data[2]}
          // onNearestX={this.onNearestX}
          // onSeriesMouseOut={this.onMouseLeave}
        />
        <Highlight
          onBrushEnd={(area: any) => this.setState({lastDrawLocation: area})}
          onDrag={(area: any) => {
            this.setState({
              lastDrawLocation: {
                bottom: lastDrawLocation ? lastDrawLocation.bottom + (area.top - area.bottom) :
                  (area.top - area.bottom),
                left: lastDrawLocation ? lastDrawLocation.left - (area.right - area.left) :
                  (area.right - area.left),
                right: lastDrawLocation ? lastDrawLocation.right - (area.right - area.left) :
                  (area.right - area.left),
                top: lastDrawLocation ? lastDrawLocation.top + (area.top - area.bottom) :
                  (area.top - area.bottom)
              }
            });
          }}
        />
        <Crosshair values={crosshairValues} />
      </XYPlot>
      <button
          className="showcase-button"
          onClick={() => this.setState({lastDrawLocation: null})}
        >
          Reset Zoom
        </button>
      </div>
    )
  }

  // private onMouseLeave = () => this.setState({crosshairValues: []});

  // private onNearestX = (value: any, {index} : {index: number}) =>
  //   this.setState({
  //     crosshairValues: this.props.data.map(d => d[index].y !== null && d[index])
  //   });

}
