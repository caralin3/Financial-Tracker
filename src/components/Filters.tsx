import { Button, Grid, Typography } from '@material-ui/core';
import * as React from 'react';
import { SelectInput } from './Form';

export interface FiltersProps {
  onResetFilters: () => void;
  onSelectFilter: (e: React.ChangeEvent<HTMLSelectElement>, col: string) => void;
}

export const Filters: React.SFC<FiltersProps> = props => {
  const [item, setItem] = React.useState<string>('all');
  const [item2, setItem2] = React.useState<string>('all');
  const [item3, setItem3] = React.useState<string>('all');
  const [item4, setItem4] = React.useState<string>('all');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>, col: string) => {
    switch (col) {
      case 'item':
        setItem(e.target.value);
        break;
      case 'item2':
        setItem2(e.target.value);
        break;
      case 'item3':
        setItem3(e.target.value);
        break;
      case 'item4':
        setItem4(e.target.value);
        break;
    }
    props.onSelectFilter(e, col);
  };

  const handleReset = () => {
    setItem('all');
    setItem2('all');
    setItem3('all');
    setItem4('all');
    props.onResetFilters();
  };

  return (
    <div className="filters">
      <div className="filters_header">
        <Typography className="filters_title">Filters</Typography>
        <Button onClick={handleReset} color="primary">
          Reset
        </Button>
      </div>
      <Grid className="filters_grid" container={true} spacing={24}>
        <Grid item={true} xs={12} md={6}>
          <SelectInput
            label="Item"
            selected={item}
            handleChange={e => handleChange(e, 'name')}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Eclair', value: 'Eclair' },
              { label: 'Two', value: 'two' },
              { label: 'Three', value: 'three' },
              { label: 'Four', value: 'four' }
            ]}
          />
        </Grid>
        <Grid item={true} xs={12} md={6}>
          <SelectInput
            label="Item"
            selected={item2}
            handleChange={e => handleChange(e, 'fat')}
            options={[
              { label: 'All', value: 'all' },
              { label: 16, value: 16 },
              { label: 'Two', value: 'two' },
              { label: 'Three', value: 'three' },
              { label: 'Four', value: 'four' }
            ]}
          />
        </Grid>
        <Grid item={true} xs={12} md={6}>
          <SelectInput
            label="Item"
            selected={item3}
            handleChange={e => handleChange(e, 'item3')}
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
            selected={item4}
            handleChange={e => handleChange(e, 'item4')}
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
};
