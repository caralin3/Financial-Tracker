import { CircularProgress, Typography } from '@material-ui/core';
import * as React from 'react';

export interface LoadingProps {}

export const Loading: React.SFC<LoadingProps> = props => (
  <div className="loading">
    <CircularProgress />
    <Typography className="loading_text">Loading</Typography>
  </div>
);
