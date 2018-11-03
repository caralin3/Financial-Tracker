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

const getLabelCount = (data: RadialChartData[]) => {
  const labels = data.filter((d) => d.angle > 0);
  return labels.length; 
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
      labelsRadiusMultiplier={getLabelCount(props.data) === 1 ? 0.1 : 0.8}
      labelsStyle={{fontFamily: 'Archivo Narrow, sans-serif', fontSize: 18, fill: '#FFF'}}
      showLabels={true}
      width={250}
      height={250}
    >
      <GradientDefs>
        <linearGradient id="grad1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#40ED73" />
          <stop offset="100%" stopColor="#4BBC7A" />
        </linearGradient>
        <linearGradient id="grad2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#D989FF" />
          <stop offset="100%" stopColor="#A044C4" />
        </linearGradient>
        <linearGradient id="grad3" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#62D4D9" />
          <stop offset="100%" stopColor="#0C98AC" />
        </linearGradient>
      </GradientDefs>
  </RadialChart>
)
