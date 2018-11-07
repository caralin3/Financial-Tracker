import * as React from 'react';

export interface DonutChartData {
  color: string;
  title: string;
  percent: number;
  value?: number;
}

interface DonutChartProps {
  className?: string;
  data: DonutChartData[];
  id: string;
  labelBackgroundColor?: string;
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  ringColor?: string;
  subtitle?: string;
  subtitleClass?: string;
  titleClass?: string;
  title: string;
}

interface DonutChartState {
  label: DonutChartData | null,
  xPos: number,
  yPos: number,
}

export class DonutChart extends React.Component<DonutChartProps, DonutChartState> {
  public readonly state: DonutChartState = {
    label: null,
    xPos: 0,
    yPos: 0,
  }

  public render() {
    const {
      className,
      data,
      id,
      labelBackgroundColor,
      onClick,
      onMouseOver,
      onMouseOut,
      ringColor,
      subtitle,
      subtitleClass,
      title, 
      titleClass
    } = this.props;
    const { label, xPos, yPos } = this.state;

    return (
      <svg
        className={`donut ${className}`}
        height="100%"
        id={id}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        viewBox="0 0 42 42"
        width="100%"
      >
        <circle
          className="donut_ring"
          cx="21"
          cy="21"
          r="15.91549430918954"
          fill="transparent"
          stroke={ringColor ? ringColor : '#d2d3d4'}
          strokeWidth="7"
        />
        {data.map((d: DonutChartData, index: number) =>
          <circle
            key={index}
            className="donut_segment"
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            onMouseMove={(e) => this.mouseEventHandler(e, d)}
            onMouseLeave={(() => this.setState({ label: null }))}
            stroke={d.color}
            strokeWidth="7"
            strokeDasharray={`${d.percent} ${(100 - d.percent)}`}
            strokeDashoffset={index === 0 ? '25' : this.computeOffset(index, data)}
          />
        )}
        <circle
          className="donut_hole"
          cx="21"
          cy="21"
          r="15.91549430918954"
          fill="#FFF"
          onClick={onClick}
        />
        <g className={subtitle ? 'donut_chart-text' : 'donut_chart-title'} onClick={onClick}>
          <text x="50%" y="50%" className={`donut_chart-label ${titleClass}`}>
            {title}
          </text>
          <text x="50%" y="50%" className={`donut_chart-number ${subtitleClass}`}>
            {subtitle}
          </text>
        </g>
        <defs>
          <filter x="-7%" y="0" width="1.2" height="1.2" id="background">
            <feFlood
                floodColor={
                  labelBackgroundColor ? labelBackgroundColor :
                  'rgba(21, 18, 18, 0.8)'
                }
              />
            <feComposite in="SourceGraphic" />
          </filter>
        </defs>
        {label &&
        <text
          className="donut_tooltip"
          filter="url(#background)"
          x={xPos}
          y={yPos}
        >
          <tspan x={xPos} dy=".5em">{ label.title }</tspan>
          <tspan x={xPos} dy="1em">{ `${label.percent.toFixed(1)}%` }</tspan>
          {label.value && <tspan x={xPos} dy="1em">{ `$${label.value.toFixed(2)}` }</tspan>}
        </text>
        }
      </svg>
    )
  }

  private mouseEventHandler = (e: React.MouseEvent<SVGCircleElement>, label: DonutChartData) => {
    const svgElement = document.getElementById(this.props.id) as any;
    if (svgElement) {
      const pt = svgElement.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgGlobal = pt.matrixTransform(svgElement.getScreenCTM().inverse());
      let xPos = svgGlobal.x + 10;
      let yPos = svgGlobal.y - 10;
      if (svgGlobal.x > 21) {
        xPos = svgGlobal.x - 5;
      }
      if (svgGlobal.y < 21) {
        yPos = svgGlobal.y + 5;
      }

      this.setState({
        label,
        xPos,
        yPos,
      });
    }
  }

  // Offset = Circumference − All preceding segments’ total length + First segment’s offset
  private computeOffset = (idx: number, data: DonutChartData[]) => {
    const circ = 100;
    const initialOffset = 25;
    let totalLength = 0;
    let i = 0;
    while (i !== idx) {
      totalLength += data[i].percent;
      i++;
    }
    const offset = circ - totalLength + initialOffset;
    return offset;
  }
}
