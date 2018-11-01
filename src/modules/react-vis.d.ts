declare module 'react-vis' {

  interface Data {
    angle: number,
    className?: string;
    color?: string | number;
    gradientLabel?: string;
    label?: string,
    padAngle?: number | Function;
    radius?: number,
    style?: object;
    sublabel?: string;
  }

  interface RadialChartProps {
    className?: string;
    colorType?: string;
    colorDomain?: number[];
    colorRange?: number[];
    data: Data[];
    getColor?: Function;
    height: number;
    labelsAboveChildren?: boolean;
    labelsRadiusMultiplier?: number;
    labelsStyle?: object;
    margin?: object;
    radius?: number;
    showLabels?: boolean;
    style?: object;
    width: number;
  }

  export class RadialChart extends React.Component<RadialChartProps> {}

  export class GradientDefs extends React.Component {}
}