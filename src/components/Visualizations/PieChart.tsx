import * as React from 'react';
import { GradientDefs, RadialChart, RadialChartData } from 'react-vis';

interface PieChartProps {
  className?: string;
  data: RadialChartData[];
}

const getLabels = (data: RadialChartData[], name: string | undefined) => {
  const labels = data.map((d) => d.angle > 0 ? d.name: '').filter((label) => label);
  return labels.filter((l) => l === name)[0] || ''; 
}

export const PieChart: React.SFC<PieChartProps> = (props) => (
    <RadialChart
      className={props.className}
      colorType={'literal'}
      colorDomain={[0, 100]}
      colorRange={[0, 10]}
      getColor={(d: RadialChartData) => `url(#${d.gradientLabel})`}
      getLabel={(d: RadialChartData) => getLabels(props.data, d.name)}
      data={props.data}
      labelsRadiusMultiplier={0.8}
      labelsStyle={{fontSize: 16, fill: '#222'}}
      showLabels={true}
      width={250}
      height={250}
    >
      <GradientDefs>
        <linearGradient id="grad1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0C98AC" />
          <stop offset="100%" stopColor="#62D4D9" />
        </linearGradient>
        <linearGradient id="grad2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#62D4D9" />
          <stop offset="100%" stopColor="#0C98AC" />
        </linearGradient>
        <linearGradient id="grad3" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#62D4D9" />
          <stop offset="100%" stopColor="#0C98AC" />
        </linearGradient>
      </GradientDefs>
  </RadialChart>
)
