import Typography, { TypographyProps } from '@material-ui/core/Typography';
import * as React from 'react';

interface ProgressBarProps {
  endLabel?: string;
  leftLabel?: string;
  percent: number;
  rightLabel?: string;
  subLabel?: string;
  textColor?: TypographyProps['color'];
}

export const ProgressBar: React.SFC<ProgressBarProps> = ({
  endLabel,
  leftLabel,
  percent,
  rightLabel,
  subLabel,
  textColor
}) => (
  <div className="progressBar">
    <div className={endLabel ? 'progressBar_paddedRow' : 'progressBar_row'}>
      {leftLabel && (
        <Typography className="progressBar_label" color={textColor}>
          {leftLabel} {subLabel && <span className="progressBar_sublabel">({subLabel})</span>}
        </Typography>
      )}
      {rightLabel && (
        <Typography className="progressBar_label" color={textColor}>
          {rightLabel}
        </Typography>
      )}
    </div>
    <div className="progressBar_row">
      <div className="progressBar_container">
        <span className="progressBar_bar">
          <span
            className={percent <= 100 ? 'progressBar_progress' : 'progressBar_over'}
            style={{ width: `${percent}%` }}
          />
        </span>
      </div>
      {endLabel && <Typography className="progressBar_end">{endLabel}</Typography>}
    </div>
  </div>
);
