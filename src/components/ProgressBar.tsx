import * as React from 'react';

interface ProgressBarProps {
  percent: number;
}

export const ProgressBar: React.SFC<ProgressBarProps> = ({ percent }) => (
  <div className="progressBar">
    <span className="progressBar_bar">
      <span
        className={percent <= 100 ? 'progressBar_progress' : 'progressBar_over'}
        style={{ width: `${percent}%` }}
      />
    </span>
  </div>
);
