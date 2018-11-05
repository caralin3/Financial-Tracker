import * as React from 'react';
import { Hint, RadialChart, RadialChartData } from 'react-vis';

interface DonutChartProps {
  className?: string;
  data: RadialChartData[];
}

// const getLabels = (data: RadialChartData[], name: string | undefined) => {
//   const labels = data.map((d) => d.angle > 0 ? d.name: '').filter((label) => label);
//   return labels.filter((l) => l === name)[0] || ''; 
// }

// const getLabelCount = (data: RadialChartData[]) => {
//   const labels = data.filter((d) => d.angle > 0);
//   return labels.length; 
// }

export interface DonutChartState {
  value: any;
}

export class DonutChart extends React.Component<DonutChartProps, DonutChartState> {
  public readonly state: DonutChartState = {
    value: false,
  }

  public render() {
    const { className } = this.props;
    const { value } = this.state;

    return (
      <RadialChart
        className={className}
        innerRadius={100}
        radius={140}
        getAngle={(d: RadialChartData) => d.angle}
        data={[
          {angle: 2, label: 'Title'},
          {angle: 6},
          {angle: 2},
        ]}
        onValueMouseOver={(v: object) => this.setState({value: v})}
        onSeriesMouseOut={() => this.setState({value: false})}
        showLabels={true}
        labelsRadiusMultiplier={1}
        width={300}
        height={300}
        padAngle={0.04}
      >
        {value && <Hint value={value} />}
      </RadialChart>
    )
  }
}
