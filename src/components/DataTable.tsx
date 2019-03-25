import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { Theme, withStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import MuiTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import MuiTableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import MuiToolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FilterListIcon from '@material-ui/icons/FilterList';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import classNames from 'classnames';
import * as React from 'react';
import { Filters, Popup } from './';

interface TableHeadProps {
  numSelected: number;
  onRequestSort: (e: React.MouseEvent, property: string) => void;
  onSelectAllClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  order: 'desc' | 'asc' | undefined;
  orderBy: string;
  rowCount: number;
  rows: any[];
}

export const TableHead: React.SFC<TableHeadProps> = props => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, rows } = props;

  const createSortHandler = (property: string) => (event: any) => {
    props.onRequestSort(event, property);
  };

  return (
    <MuiTableHead>
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
    </MuiTableHead>
  );
};

interface TableToolbarProps {
  classes: any;
  onDelete: () => void;
  onEdit: () => void;
  onResetFilters: () => void;
  onSelectFilter: (e: React.ChangeEvent<HTMLSelectElement>, col: string) => void;
  numSelected: number;
  tableTitle: string;
}

export const Toolbar: React.SFC<TableToolbarProps> = props => {
  const { classes, onDelete, onEdit, numSelected, onResetFilters, onSelectFilter, tableTitle } = props;
  const [openColumns, setOpenColumns] = React.useState<boolean>(false);
  const [openFilters, setOpenFilters] = React.useState<boolean>(false);

  const handleClick = (cols: boolean, filters: boolean) => {
    setOpenColumns(cols);
    setOpenFilters(filters);
  };

  return (
    <MuiToolbar
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
            {tableTitle}
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <div className={classes.actionButtons}>
            {numSelected === 1 && (
              <Tooltip title="Edit">
                <IconButton aria-label="Edit" onClick={onEdit}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Delete">
              <IconButton aria-label="Delete" onClick={onDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        ) : (
          <div className={classes.actionButtons}>
            <Tooltip title="Export">
              <IconButton aria-label="Export" onClick={() => null}>
                <CloudDownloadIcon />
              </IconButton>
            </Tooltip>
            <Popup
              open={openColumns}
              onClick={() => handleClick(!openColumns, false)}
              content={<Filters onResetFilters={onResetFilters} onSelectFilter={onSelectFilter} />}
              tooltip="View Colmns"
              trigger={<ViewColumnIcon />}
            />
            <Popup
              class="table_filters"
              open={openFilters}
              onClick={() => handleClick(false, !openFilters)}
              content={<Filters onResetFilters={onResetFilters} onSelectFilter={onSelectFilter} />}
              tooltip="Filters"
              trigger={<FilterListIcon />}
            />
          </div>
        )}
      </div>
    </MuiToolbar>
  );
};

const toolbarStyles = (theme: Theme) => ({
  actionButtons: {
    alignItems: 'center',
    display: 'flex'
  },
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

const TableToolbar = withStyles(toolbarStyles)(Toolbar);

interface TableFilterListProps {
  classes: any;
  filters: { [key: string]: string | number };
  onDeleteFilter: (key: string) => void;
}

const FilterList: React.SFC<TableFilterListProps> = props => {
  const { classes, filters, onDeleteFilter } = props;

  return (
    <div className={classes.root}>
      {Object.keys(filters).map((key: string) => (
        <Chip className={classes.chip} label={filters[key]} key={key} onDelete={() => onDeleteFilter(key)} />
      ))}
    </div>
  );
};

const filterListStyles = (theme: Theme) => ({
  chip: {
    margin: '8px 8px 0px 0px'
  },
  root: {
    display: 'flex',
    justifyContent: 'left',
    // flexWrap: 'wrap',
    margin: '5px 16px 20px 20px'
  }
});

export const TableFilterList = withStyles(filterListStyles)(FilterList);

interface TableProps {
  classes: any;
  data: any;
  onDelete: (selected: string[]) => void;
  onEdit: (id: string) => void;
  rows: any[];
  title: string;
}

const Table: React.SFC<TableProps> = props => {
  const { classes, data, onDelete, onEdit, rows, title } = props;
  const [order, setOrder] = React.useState<'desc' | 'asc' | undefined>(undefined);
  const [orderBy, setOrderBy] = React.useState<string>('');
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(0);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [filters, setFilters] = React.useState<{ [key: string]: string | number }>({ ['name']: 'John', ['age']: 50 });

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

  const handleRequestSort = (e: React.MouseEvent<HTMLButtonElement>, property: any) => {
    const orderedBy = property;
    let ordered: 'desc' | 'asc' | undefined = 'desc';

    if (orderBy === property && order === 'desc') {
      ordered = 'asc';
    }

    setOrder(ordered);
    setOrderBy(orderedBy);
  };

  const handleSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(data.map((n: any) => n.id));
      return;
    }
    setSelected([]);
  };

  const handleClick = (e: React.MouseEvent<HTMLTableRowElement>, id: string) => {
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
    setSelected(newSelected);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const handleResetFilters = () => setFilters({});

  const handleDeleteFilter = (key: string) => {
    const updatedFilters: { [key: string]: string | number } = {};
    Object.keys(filters).forEach(id => {
      if (id !== key) {
        updatedFilters[id] = filters[id];
      }
    });
    setFilters(updatedFilters);
  };

  const handleSelectFilter = (value: string | number, col: string) => {
    setFilters({ ...filters, [col]: value });
  };

  return (
    <Paper className={classNames([classes.root, 'table_container'])}>
      <TableToolbar
        onDelete={() => onDelete(selected)}
        onEdit={() => onEdit(selected[0])}
        onResetFilters={handleResetFilters}
        onSelectFilter={(e, col) => handleSelectFilter(e.target.value, col)}
        numSelected={selected.length}
        tableTitle={title}
      />
      <TableFilterList filters={filters} onDeleteFilter={handleDeleteFilter} />
      <div className={classNames([classes.tableWrapper, 'table_wrapper'])}>
        <MuiTable className={classes.table} aria-labelledby="tableTitle">
          <TableHead
            numSelected={data.length > 0 ? selected.length : -1}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            rows={rows}
          />
          <TableBody>
            {data.length > 0 ? (
              stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const sel: boolean = isSelected(n.id);
                  return (
                    <TableRow
                      className="table_row"
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
                })
            ) : (
              <TableRow className="table_row" role="checkbox" aria-checked={false} tabIndex={-1} selected={false}>
                <TableCell colSpan={3} />
                <TableCell>No records</TableCell>
              </TableRow>
            )}
            {data.length > 0 && emptyRows > 0 && (
              <TableRow style={{ height: 49 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </MuiTable>
      </div>
      <TablePagination
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
        onChangePage={(e: React.MouseEvent<HTMLButtonElement>, num: number) => setPage(num)}
        onChangeRowsPerPage={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          setRowsPerPage(parseInt(e.target.value, 10))
        }
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

export const DataTable = withStyles(styles)(Table);
