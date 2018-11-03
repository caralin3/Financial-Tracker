import * as React from 'react';
import {
  BarSeriesData,
  Hint,
  HorizontalBarSeries,
  HorizontalGridLines,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
} from 'react-vis';
import 'react-vis/dist/style.css';
// import { formatter } from 'src/utility';

interface BarChartProps {
  className?: string;
  data: BarSeriesData[][];
  height: number;
  leftMargin: number;
  width: number;
  xAxisTitle?: string;
}

interface BarChartState {
  v1: BarSeriesData | null;
  v2: BarSeriesData | null;
}

export class BarChart extends React.Component<BarChartProps, BarChartState> {
  public readonly state: BarChartState = {
    v1: null,
    v2: null,
  }

  public render() {
    const { data, height, leftMargin, width, xAxisTitle } = this.props;

    return (
      <XYPlot
        margin={{left: leftMargin}}
        width={width}
        height={height}
        stackBy="x"
        yType="ordinal"
      >
        {/* <DiscreteColorLegend
          style={{position: 'absolute', left: '50px', top: '10px'}}
          orientation="horizontal"
          items={[
            {
              title: 'Apples',
              color: '#12939A'
            },
            {
              title: 'Oranges',
              color: '#79C7E3'
            }
          ]}
        /> */}
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis title={xAxisTitle ? xAxisTitle : 'Amount ($)'} />
        <YAxis />
        <HorizontalBarSeries
          color='red'
          data={data[0]}
          onValueMouseOver={(d: BarSeriesData) => this.setState({ v1: d })}
          onValueMouseOut={() => this.setState({ v1: null })}
        />
        <HorizontalBarSeries
          color='blue'
          data={data[1]}
          onValueMouseOver={(d: BarSeriesData) => this.setState({ v2: d })}
          onValueMouseOut={() => this.setState({ v2: null })}
        />
        {/* {this.state.v1 && <Hint value={this.state.v1}><div style={{background: 'black'}}>
            <p>{formatter.formatMoney(this.state.v1.x)}</p>
          </div></Hint>} */}
        {this.state.v1 && <Hint value={this.state.v1} />}
        {this.state.v2 && <Hint value={this.state.v2} />}
      </XYPlot>
    )
  }
}
