import * as React from 'react';
import {
  Crosshair,
  DiscreteColorLegend,
  Highlight,
  HorizontalGridLines,
  LineSeries,
  // LineSeriesData,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
} from 'react-vis';
import 'react-vis/dist/style.css';
import { formatter } from '../../utility';

interface LineChartProps {
  className?: string;
  data: any[];
  height: number;
  leftMargin?: number;
  orientation?: 'horizontal' | 'vertical';
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
    const { data, height, orientation, width, xAxisTitle, yAxisTitle } = this.props;
    const { crosshairValues, lastDrawLocation } = this.state;

    const items = data.map((d) => ({color: d.color, title: d.label}))

    return (
      <div style={{display: 'flex', flexDirection: orientation === 'horizontal' ? 'column' : 'row'}}>
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
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis title={xAxisTitle ? xAxisTitle : 'Month'} tickFormat={(d: any) => formatter.months[d]} />
          <YAxis title={yAxisTitle ? yAxisTitle : 'Amount ($)'} />
          {data.map((d) => (
            <LineSeries
              key={d.color}
              color={d.color}
              data={d.data}
              // onNearestX={this.onNearestX}
              // onSeriesMouseOut={this.onMouseLeave}
            />
          ))}
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
      <div style={{display: 'flex', flexDirection: orientation === 'horizontal' ? 'row' : 'column'}}>
        <DiscreteColorLegend
          className="legend"
          orientation={'vertical'}
          items={items}
        />
        <button
          className="showcase-button"
          onClick={() => this.setState({lastDrawLocation: null})}
        >
          Reset Zoom
        </button>
      </div>
      </div>
    )
  }

  // private onMouseLeave = () => this.setState({crosshairValues: []});

  // private onNearestX = (value: any, {index} : {index: number}) =>
  //   this.setState({
  //     crosshairValues: this.props.data.map(d => d[index].y !== null && d[index])
  //   });

}
