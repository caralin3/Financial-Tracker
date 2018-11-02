import * as React from 'react';
import { GraphData, RadialChart } from 'react-vis';
// import { GradientDefs, RadialChart } from 'react-vis';

interface PieChartProps {
  data: GraphData[];
}

export const PieChart: React.SFC<PieChartProps> = (props) => (
  <RadialChart
    colorType={'literal'}
    colorDomain={[0, 100]}
    colorRange={[0, 10]}
    // getLabel={(d: any )=> d.name}
    // data={[
    //   {angle: 1, color: '#89DAC1', name: 'green'},
    //   {angle: 2, color: '#F6D18A', name: 'yellow'},
    //   {angle: 5, color: '#1E96BE', name: 'cyan'},
    //   {angle: 3, color: '#DA70BF', name: 'magenta'},
    //   {angle: 5, color: '#F6D18A', name: 'yellow again'}
    // ]}
    data={props.data}
    labelsRadiusMultiplier={0.8}
    labelsStyle={{fontSize: 16, fill: '#222'}}
    showLabels={true}
    width={300}
    height={250}
  />
  // <RadialChart
  //   colorType={'literal'}
  //   colorDomain={[0, 100]}
  //   colorRange={[0, 10]}
  //   margin={{top: 100}}
  //   getColor={(d: any) => `url(#${d.gradientLabel})`}
  //   data={[
  //     {angle: 60, label: 'Section 1', gradientLabel: 'grad1'},
  //     {angle: 50, label: 'Section 2', gradientLabel: 'grad2'},
  //     {angle: 50, label: 'Section 3', gradientLabel: 'grad3'}
  //   ]}
  //   labelsRadiusMultiplier={1.1}
  //   labelsStyle={{fontSize: 16, fill: '#222'}}
  //   showLabels={true}
  //   style={{stroke: '#fff', strokeWidth: 2}}
  //   width={400}
  //   height={300}
  // >
  // <GradientDefs>
  //   <linearGradient id="grad1" x1="0" x2="0" y1="0" y2="1">
  //     <stop offset="0%" stopColor="red" stopOpacity={0.4} />
  //     <stop offset="100%" stopColor="blue" stopOpacity={0.3} />
  //   </linearGradient>
  //   <linearGradient id="grad2" x1="0" x2="0" y1="0" y2="1">
  //     <stop offset="0%" stopColor="blue" stopOpacity={0.4} />
  //     <stop offset="100%" stopColor="green" stopOpacity={0.3} />
  //   </linearGradient>
  //   <linearGradient id="grad3" x1="0" x2="0" y1="0" y2="1">
  //     <stop offset="0%" stopColor="yellow" stopOpacity={0.4} />
  //     <stop offset="100%" stopColor="green" stopOpacity={0.3} />
  //   </linearGradient>
  // </GradientDefs>
  // </RadialChart>
)
