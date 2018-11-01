import * as React from 'react';
import { GradientDefs, RadialChart } from 'react-vis';

export const PieChart: React.SFC = () => (
  <RadialChart
    colorType={'literal'}
    colorDomain={[0, 100]}
    colorRange={[0, 10]}
    margin={{top: 100}}
    getColor={(d: any) => `url(#${d.gradientLabel})`}
    data={[
      {angle: 1, gradientLabel: 'grad1'},
      {angle: 2, gradientLabel: 'grad2'},
      {angle: 5, gradientLabel: 'grad3'}
    ]}
    labelsRadiusMultiplier={1.1}
    labelsStyle={{fontSize: 16, fill: '#222'}}
    showLabels={true}
    style={{stroke: '#fff', strokeWidth: 2}}
    width={400}
    height={300}
  >
  <GradientDefs>
    <linearGradient id="grad1" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor="red" stopOpacity={0.4} />
      <stop offset="100%" stopColor="blue" stopOpacity={0.3} />
    </linearGradient>
    <linearGradient id="grad2" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor="blue" stopOpacity={0.4} />
      <stop offset="100%" stopColor="green" stopOpacity={0.3} />
    </linearGradient>
    <linearGradient id="grad3" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor="yellow" stopOpacity={0.4} />
      <stop offset="100%" stopColor="green" stopOpacity={0.3} />
    </linearGradient>
  </GradientDefs>
  </RadialChart>
)
