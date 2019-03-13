import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { Theme, withStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import classNames from 'classnames';
import * as React from 'react';

interface TableHeadProps {
  numSelected: number;
  onRequestSort: (e: React.MouseEvent, property: string) => void;
  onSelectAllClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  order: 'desc' | 'asc' | undefined;
  orderBy: string;
  rowCount: number;
}

export const EnhancedTableHead: React.SFC<TableHeadProps> = props => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount } = props;

  const createSortHandler = (property: string) => (event: any) => {
    props.onRequestSort(event, property);
  };

  const rows = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Dessert (100g serving)' },
    { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
    { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
    { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
    { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' }
  ];

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {rows.map((row: any) => (
          <TableCell
            key={row.id}
            align={row.numeric ? 'right' : 'left'}
            padding={row.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === row.id ? order : false}
          >
            <Tooltip title="Sort" placement={row.numeric ? 'bottom-end' : 'bottom-start'} enterDelay={300}>
              <TableSortLabel active={orderBy === row.id} direction={order} onClick={createSortHandler(row.id)}>
                {row.label}
              </TableSortLabel>
            </Tooltip>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

interface TableToolbarProps {
  classes: any;
  numSelected: number;
}

export const EnhancedTableToolbar: React.SFC<TableToolbarProps> = props => {
  const { numSelected, classes } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Nutrition
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="Filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

const toolbarStyles = (theme: Theme) => ({
  actions: {
    color: theme.palette.text.secondary
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          color: theme.palette.secondary.main
        }
      : {
          backgroundColor: theme.palette.secondary.dark,
          color: theme.palette.text.primary
        },
  root: {
    paddingRight: theme.spacing.unit
  },
  spacer: {
    flex: '1 1 100%'
  },
  title: {
    flex: '0 0 auto'
  }
});

const TableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

interface TableProps {
  classes: any;
}

const EnhancedTable: React.SFC<TableProps> = props => {
  let counter = 0;
  const createData = (name: string, calories: number, fat: number, carbs: number, protein: number) => {
    counter += 1;
    return { id: counter, name, calories, fat, carbs, protein };
  };

  const data: any[] = [
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Donut', 452, 25.0, 51, 4.9),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Honeycomb', 408, 3.2, 87, 6.5),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Jelly Bean', 375, 0.0, 94, 0.0),
    createData('KitKat', 518, 26.0, 65, 7.0),
    createData('Lollipop', 392, 0.2, 98, 0.0),
    createData('Marshmallow', 318, 0, 81, 2.0),
    createData('Nougat', 360, 19.0, 9, 37.0),
    createData('Oreo', 437, 18.0, 63, 4.0)
  ];

  const { classes } = props;
  const [order, setOrder] = React.useState<'desc' | 'asc' | undefined>(undefined);
  const [orderBy, setOrderBy] = React.useState<string>('');
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(0);
  let selected: any[] = [];

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  const desc = (a: any, b: any, orderedBy: string) => {
    if (b[orderedBy] < a[orderedBy]) {
      return -1;
    }
    if (b[orderedBy] > a[orderedBy]) {
      return 1;
    }
    return 0;
  };

  const stableSort = (array: any[], cmp: (v1: any, v2: any) => number) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const ordered = cmp(a[0], b[0]);
      if (ordered !== 0) {
        return ordered;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  };

  const getSorting = (ordered: 'desc' | 'asc' | undefined, orderedBy: string) => {
    return ordered === 'desc' ? (a: any, b: any) => desc(a, b, orderedBy) : (a: any, b: any) => -desc(a, b, orderedBy);
  };

  const handleRequestSort = (event: any, property: any) => {
    const orderedBy = property;
    let ordered: 'desc' | 'asc' | undefined = 'desc';

    if (orderBy === property && order === 'desc') {
      ordered = 'asc';
    }

    setOrder(ordered);
    setOrderBy(orderedBy);
  };

  const handleSelectAllClick = (event: any) => {
    if (event.target.checked) {
      selected = data.map(n => n.id);
      return;
    }
    selected = [];
  };

  const handleClick = (event: any, id: number) => {
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
    selected = newSelected;
  };

  const handleChangePage = (event: any, pg: number) => {
    setPage(pg);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(event.target.value);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  return (
    <Paper className={classNames([classes.root, 'table_container'])}>
      <TableToolbar numSelected={selected.length} />
      <div className={classNames([classes.tableWrapper, 'table_wrapper'])}>
        <Table className={classes.table} aria-labelledby="tableTitle">
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
          />
          <TableBody>
            {stableSort(data, getSorting(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(n => {
                const sel: boolean = isSelected(n.id);
                return (
                  <TableRow
                    hover={true}
                    onClick={event => handleClick(event, n.id)}
                    role="checkbox"
                    aria-checked={sel}
                    tabIndex={-1}
                    key={n.id}
                    selected={sel}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={sel} />
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      {n.name}
                    </TableCell>
                    <TableCell align="right">{n.calories}</TableCell>
                    <TableCell align="right">{n.fat}</TableCell>
                    <TableCell align="right">{n.carbs}</TableCell>
                    <TableCell align="right">{n.protein}</TableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 49 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        // classes={classes.pagRoot}
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page'
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page'
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

const styles = (theme: Theme) => ({
  pagRoot: {
    actions: {
      [theme.breakpoints.down('sm')]: {
        marginLeft: 15
      }
    }
  },
  root: {
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 1020
  }
});

export const DataTable = withStyles(styles)(EnhancedTable);
