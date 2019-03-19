import { Button, Typography } from '@material-ui/core';
import * as React from 'react';

export interface FiltersProps {}

export const Filters: React.SFC<FiltersProps> = props => (
  <div className="filters">
    <div className="filters_header">
      <Typography className="filters_title">Filters</Typography>
      <Button onClick={() => null} color="primary">
        Reset
      </Button>
    </div>
  </div>
);
