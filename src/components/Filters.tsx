import { Button, Grid, Typography } from '@material-ui/core';
import * as React from 'react';
import { SelectInput } from './Form';

export interface FiltersProps { }

export const Filters: React.SFC<FiltersProps> = props => (
  <div className="filters">
    <div className="filters_header">
      <Typography className="filters_title">Filters</Typography>
      <Button onClick={() => null} color="primary">
        Reset
      </Button>
    </div>
    <Grid className="filters_grid" container={true} spacing={24}>
      <Grid item={true} xs={12} md={6}>
        <SelectInput
          label="Item"
          selected="all"
          handleChange={() => null}
          options={[
            { label: 'All', value: 'all' },
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' },
            { label: 'Four', value: 'four' }
          ]}
        />
      </Grid>
      <Grid item={true} xs={12} md={6}>
        <SelectInput
          label="Item"
          selected="all"
          handleChange={() => null}
          options={[
            { label: 'All', value: 'all' },
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' },
            { label: 'Four', value: 'four' }
          ]}
        />
      </Grid>
      <Grid item={true} xs={12} md={6}>
        <SelectInput
          label="Item"
          selected="all"
          handleChange={() => null}
          options={[
            { label: 'All', value: 'all' },
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' },
            { label: 'Four', value: 'four' }
          ]}
        />
      </Grid>
      <Grid item={true} xs={12} md={6}>
        <SelectInput
          label="Item"
          selected="all"
          handleChange={() => null}
          options={[
            { label: 'All', value: 'all' },
            { label: 'One', value: 'one' },
            { label: 'Two', value: 'two' },
            { label: 'Three', value: 'three' },
            { label: 'Four', value: 'four' }
          ]}
        />
      </Grid>
    </Grid>
  </div>
);
