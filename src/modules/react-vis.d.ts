declare module 'react-vis' {

  interface GraphData {
    className?: string;
    color?: string | number;
    gradientLabel?: string;
    fill?: number | object;
    opacity?: number | object;
    stroke?: number | object;
    strokeStyle?: number | object;
    strokeWidth?: number | object;
    style?: object;
  }
  
  export class GradientDefs extends React.Component {}

  interface HintProps {
    align?: object;
    format?: Function;
    style?: object;
    value: any;
  }

  export class Hint extends React.Component<HintProps> {}

  interface BarSeriesData extends GraphData {
    x: any;
    y: string | number;
    y0?: number;
  }

  interface BarSeriesProps {
    animation?: { duration: number } | boolean;
    barWidth?: number;
    className?: string;
    color?: string | number;
    cluster?:  string | number;
    data: BarSeriesData[];
    fill?: string | number;
    onNearestX?: Function;
    onNearestXY?: Function;
    onSeriesClick?: Function;
    onSeriesMouseOut?: Function;
    onSeriesMouseOver?: Function;
    onSeriesRightClick?: Function;
    onValueClick?: Function;
    onValueMouseOut?: Function;
    onValueMouseOver?: Function;
    onValueRightClick?: Function;
    opacity?: string | number;
    stroke?: string | number;
    style?: object;
  }
  
  export class HorizontalBarSeries extends React.Component<BarSeriesProps> {}

  export class HorizontalGridLines extends React.Component {}

  interface RadialChartData extends GraphData {
    angle: number,
    label?: string,
    name?: string;
    padAngle?: number | Function;
    radius?: number,
    sublabel?: string;
  }

  interface RadialChartProps {
    className?: string;
    colorType?: string;
    colorDomain?: number[];
    colorRange?: number[];
    data: RadialChartData[];
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

  export class VerticalBarSeries extends React.Component<BarSeriesProps> {}

  export class VerticalGridLines extends React.Component {}

  interface AxisProps {
    animation?: { duration: number } | boolean;
    className?: string;
    height?: number;
    left?: number;
    orientation?: 'top' | 'left' | 'bottom' | 'right';
    position?: 'end' | 'middle' | 'start';
    style?: object;
    tickFormat?: (value: string, index?: number, scale?: number, tickTotal?: number) => JSX.Element;
    tickLabelAngle?: number;
    tickPadding?: number;
    tickSize?: number;
    tickSizeInner?: number;
    tickTotal?: number;
    tickValues?: any[];
    title?: string;
    top?: number;
    width?: number;
  }

  export class XAxis extends React.Component<AxisProps> {}

  export class YAxis extends React.Component<AxisProps> {}

  interface XYPlotData extends GraphData {
    size?: number;
  }

  interface XYPlotProps {
    animation?: { duration: number } | boolean;
    className?: string;
    dontCheckIfEmpty?: boolean;
    hasTreeStructure?: boolean;
    height: number;
    margin?: object;
    onClick?: Function;
    onDoubleClick?: Function;
    onMouseDown?: Function;
    onMouseEnter?: Function;
    onMouseLeave?: Function;
    onMouseMove?: Function;
    onMouseUp?: Function;
    onTouchCancel?: Function;
    onTouchEnd?: Function;
    onTouchMove?: Function;
    onTouchStart?: Function;
    onWheel?: Function;
    stackBy?: string;
    style?: object;
    width: number;
    xType?: 'linear' | 'ordinal' | 'category' | 'literal' | 'log' | 'time' | 'time-utc';
    yType?: 'linear' | 'ordinal' | 'category' | 'literal' | 'log' | 'time' | 'time-utc';
  }

  export class XYPlot extends React.Component<XYPlotProps> {}

}