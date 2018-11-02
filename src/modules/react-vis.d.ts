declare module 'react-vis' {

  interface GraphData {
    angle: number,
    className?: string;
    color?: string | number;
    gradientLabel?: string;
    label?: string,
    name?: string;
    opacity?: number;
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
    data: GraphData[];
    getAngle?: Function;
    getColor?: Function;
    getLabel?: Function;
    getRadius?: Function;
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