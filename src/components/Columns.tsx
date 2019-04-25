import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

export interface ColumnsProps {
  columns: any[];
  onSelectColumns: (columns: any[]) => void;
  selectedColumns: any[];
}

export const Columns: React.SFC<ColumnsProps> = ({ columns, onSelectColumns, selectedColumns }) => {
  const [selected, setSelected] = React.useState<any[]>([]);

  React.useEffect(() => {
    const colIds = selectedColumns.map(col => col.id);
    setSelected(colIds);
  }, columns);

  const handleSelectAllClick = () => {
    const newSelected = columns.map((c: any) => c.id);
    setSelected(newSelected);
    onSelectColumns(newSelected);
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
      onSelectColumns(newSelected);
    }
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  return (
    <Paper>
      <MenuList>
        <MenuItem onClick={handleSelectAllClick}>
          <Checkbox
            indeterminate={selected.length > 0 && selected.length < columns.length}
            checked={selected.length === columns.length}
          />
          <Typography>All</Typography>
        </MenuItem>
        {columns.map(col => (
          <MenuItem key={col.id} data-value={col.id} onClick={e => handleClick(e, col.id)}>
            <Checkbox checked={isSelected(col.id)} />
            <Typography>{col.label}</Typography>
          </MenuItem>
        ))}
      </MenuList>
    </Paper>
  );
};
