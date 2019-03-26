import { Checkbox, MenuItem, MenuList, Paper, Typography } from '@material-ui/core';
import * as React from 'react';

export interface ColumnsProps {
  columns: any[];
  selectedColumns: any[];
  onSelectColumns: (columns: any[]) => void;
}

export const Columns: React.SFC<ColumnsProps> = props => {
  const [selected, setSelected] = React.useState<any[]>([]);

  React.useEffect(() => {
    const colIds = props.selectedColumns.map(col => col.id);
    setSelected(colIds);
  }, props.columns);

  const handleSelectAllClick = () => {
    const newSelected = props.columns.map((c: any) => c.id);
    setSelected(newSelected);
    props.onSelectColumns(newSelected);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: any[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    if (newSelected.length !== 0) {
      setSelected(newSelected);
      props.onSelectColumns(newSelected);
    }
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  return (
    <Paper>
      <MenuList>
        <MenuItem onClick={handleSelectAllClick}>
          <Checkbox
            indeterminate={selected.length > 0 && selected.length < props.columns.length}
            checked={selected.length === props.columns.length}
          />
          <Typography>All</Typography>
        </MenuItem>
        {props.columns.map(col => (
          <MenuItem key={col.id} data-value={col.id} onClick={e => handleClick(e, col.id)}>
            <Checkbox checked={isSelected(col.id)} />
            <Typography>{col.label}</Typography>
          </MenuItem>
        ))}
      </MenuList>
    </Paper>
  );
};
