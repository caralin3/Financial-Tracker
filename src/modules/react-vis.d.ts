declare module 'react-vis' {

  export interface CrosshairProps {
    values?: any[];
  }

  export class Crosshair extends React.Component<CrosshairProps> {}

  interface DiscreteColorLegendProps {
    className?: string;
    height?: number;
    items?: object[];
    orientation?: 'horizontal' | 'vertical';
    style?: object;
    width?: number;
  }

  export class DiscreteColorLegend extends React.Component<DiscreteColorLegendProps> {}

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

  interface HighlightProps {
    onBrushEnd?: Function;
    onDrag?: Function;
    style?: object;
  }

  export class Highlight extends React.Component<HighlightProps> {}

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

  export interface LineSeriesData {
    x: string | number;
    y: number;
  }

  interface LineSeriesProps {
    animation?: { duration: number } | boolean;
    className?: string;
    color?: string | number;
    curve?:  string | Function;
    data: LineSeriesData[];
    getNull?: Function;
    onNearestX?: Function;
    onNearestXY?: Function;
    onSeriesClick?: Function;
    onSeriesMouseOut?: Function;
    onSeriesMouseOver?: Function;
    onSeriesRightClick?: Function;
    opacity?: string | number;
    stroke?: string | number;
    strokeDasharray?: string;
    strokeStyle?: string;
    strokeWidth?: string | number;
    style?: object;
  }

  export class LineSeries extends React.Component<LineSeriesProps> {}

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
    innerRadius?: number;
    labelsAboveChildren?: boolean;
    labelsRadiusMultiplier?: number;
    labelsStyle?: object;
    onValueMouseOver?: Function;
    onSeriesMouseOut?: Function;
    padAngle?: number;
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
    tickFormat?: Function;
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
    xDomain?: number[] | null;
    xType?: 'linear' | 'ordinal' | 'category' | 'literal' | 'log' | 'time' | 'time-utc';
    yDomain?: number[] | null;
    yType?: 'linear' | 'ordinal' | 'category' | 'literal' | 'log' | 'time' | 'time-utc';
  }

  export class XYPlot extends React.Component<XYPlotProps> {}

}