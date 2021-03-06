import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import * as React from 'react';
import { Column, Option, Transaction } from '../types';
import { removeDupObjs, sort } from '../util';
import { SelectInput } from './Form';

export interface FiltersProps {
  count: number;
  data: Transaction[];
  dateOptions: Option[];
  filters: Column[];
  onClose: () => void;
  onResetFilters: () => void;
  onSelectFilter: (e: React.ChangeEvent<HTMLSelectElement>, col: string) => void;
}

export const Filters: React.SFC<FiltersProps> = ({
  count,
  data,
  dateOptions,
  filters,
  onClose,
  onResetFilters,
  onSelectFilter
}) => {
  const [item, setItem] = React.useState<string>('all');
  const [item2, setItem2] = React.useState<string>('all');
  const [item3, setItem3] = React.useState<string>('all');
  const [item4, setItem4] = React.useState<string>('all');
  const [item5, setItem5] = React.useState<string>('all');
  const [item6, setItem6] = React.useState<string>('all');
  const [item7, setItem7] = React.useState<string>('all');
  const [item8, setItem8] = React.useState<string>('all');

  React.useEffect(() => {
    if (count === 0) {
      setItem('all');
      setItem2('all');
      setItem3('all');
      setItem4('all');
      setItem5('all');
      setItem6('all');
      setItem7('all');
      setItem8('all');
    }
  }, [count]);

  const createOps = (col: Column) => {
    const options: Option[] = [{ label: 'All', value: 'all' }];
    if (col.label === 'Date') {
      options.push.apply(options, dateOptions);
      return removeDupObjs(options);
    }
    if (col.label === 'Tags') {
      data.forEach(d => {
        const tags = d[col.id].split(',');
        tags.forEach((tag: string) => {
          options.push({ label: tag.trim(), value: tag.trim() });
        });
      });
      return removeDupObjs(sort(options, 'desc', 'label'));
    }
    data.forEach(d => {
      options.push({ label: d[col.id], value: d[col.id] });
    });
    return removeDupObjs(sort(options, 'desc', 'label'));
  };

  const getSelected = (index: number) => {
    switch (index) {
      case 0:
        return item;
      case 1:
        return item2;
      case 2:
        return item3;
      case 3:
        return item4;
      case 4:
        return item5;
      case 5:
        return item6;
      case 6:
        return item7;
      case 7:
        return item8;
      default:
        return item;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>, col: string, index: number) => {
    switch (index) {
      case 0:
        setItem(e.target.value);
        break;
      case 1:
        setItem2(e.target.value);
        break;
      case 2:
        setItem3(e.target.value);
        break;
      case 3:
        setItem4(e.target.value);
        break;
      case 4:
        setItem5(e.target.value);
        break;
      case 5:
        setItem6(e.target.value);
        break;
      case 6:
        setItem7(e.target.value);
        break;
      case 7:
        setItem8(e.target.value);
        break;
    }
    onSelectFilter(e, col);
  };

  const handleReset = () => {
    setItem('all');
    setItem2('all');
    setItem3('all');
    setItem4('all');
    setItem5('all');
    setItem6('all');
    setItem7('all');
    setItem8('all');
    onResetFilters();
  };

  return (
    <div className="filters">
      <div className="filters_header">
        <div className="filters_header-left">
          <Typography className="filters_title">Filters</Typography>
          <Button onClick={handleReset} color="primary">
            Reset
          </Button>
        </div>
        <IconButton aria-label="Close" color="primary" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <Grid className="filters_grid" container={true} spacing={24}>
        {filters.map((col, index) => (
          <Grid item={true} xs={12} md={6} key={col.id}>
            <SelectInput
              label={col.label}
              selected={getSelected(index)}
              handleChange={e => handleChange(e, col.id, index)}
              options={createOps(col)}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
