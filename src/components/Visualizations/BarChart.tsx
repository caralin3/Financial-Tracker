import * as React from 'react';
import {
  BarSeriesData,
  DiscreteColorLegend,
  Hint,
  HorizontalBarSeries,
  HorizontalGridLines,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
} from 'react-vis';
import 'react-vis/dist/style.css';

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
  v3: BarSeriesData | null;
}

export class BarChart extends React.Component<BarChartProps, BarChartState> {
  public readonly state: BarChartState = {
    v1: null,
    v2: null,
    v3: null,
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
        <DiscreteColorLegend
          style={{
            backgroundColor: 'rgba(244, 244, 244, 0.75)',
            bottom: '75px',
            position: 'absolute',
            right: '10px',
          }}
          orientation="vertical"
          items={[
            {
              color: '#0C98AC',
              title: 'Actual',
            },
            {
              color: '#62D4D9',
              title: 'Budget',
            },
            {
              color: '#FF0000',
              title: 'Over Budget',
            }
          ]}
        />
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis title={xAxisTitle ? xAxisTitle : 'Amount ($)'} />
        <YAxis />
        <HorizontalBarSeries
          color='#0C98AC'
          data={data[0]}
          onValueMouseOver={(d: BarSeriesData) => this.setState({ v1: d })}
          onValueMouseOut={() => this.setState({ v1: null })}
        />
        <HorizontalBarSeries
          color='#62D4D9'
          data={data[1]}
          onValueMouseOver={(d: BarSeriesData) => this.setState({ v2: d })}
          onValueMouseOut={() => this.setState({ v2: null })}
        />
        <HorizontalBarSeries
          color='#FF0000'
          data={data[2]}
          onValueMouseOver={(d: BarSeriesData) => this.setState({ v3: d })}
          onValueMouseOut={() => this.setState({ v3: null })}
        />
        {/* {this.state.v1 && <Hint value={this.state.v1}><div style={{background: 'black'}}>
            <p>{formatter.formatMoney(this.state.v1.x)}</p>
          </div></Hint>} */}
        {this.state.v1 && <Hint value={this.state.v1} />}
        {this.state.v2 && <Hint value={this.state.v2} />}
        {this.state.v3 && <Hint value={this.state.v3} />}
      </XYPlot>
    )
  }
}
