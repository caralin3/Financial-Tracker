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
import { Column } from '../types';
import { getTransactionByRange } from '../util';
import { Columns, Filters, Popup } from './';

interface TableHeadProps {
  numSelected: number;
  onRequestSort: (e: React.MouseEvent, property: string) => void;
  onSelectAllClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  order: 'desc' | 'asc' | undefined;
  orderBy: string;
  rowCount: number;
  columns: Column[];
}

export const TableHead: React.SFC<TableHeadProps> = props => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, columns } = props;

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
        {columns.map((col, index) => (
          <TableCell
            key={col.id}
            align={index !== 0 && col.numeric ? 'right' : 'left'}
            padding={index === 0 ? 'none' : 'default'}
            sortDirection={orderBy === col.id ? order : false}
          >
            <Tooltip title="Sort" placement={col.numeric ? 'bottom-end' : 'bottom-start'} enterDelay={300}>
              <TableSortLabel active={orderBy === col.id} direction={order} onClick={createSortHandler(col.id)}>
                {col.label}
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
  columns: Column[];
  data: any[];
  displayColumns: any[];
  filterCount: number;
  numSelected: number;
  onDelete: () => void;
  onEdit: () => void;
  onResetFilters: () => void;
  onSelectColumns: (columns: Column[]) => void;
  onSelectFilter: (e: React.ChangeEvent<HTMLSelectElement>, col: string) => void;
  tableTitle: string;
}

export const Toolbar: React.SFC<TableToolbarProps> = props => {
  const {
    classes,
    columns,
    data,
    displayColumns,
    filterCount,
    onDelete,
    onEdit,
    numSelected,
    onResetFilters,
    onSelectColumns,
    onSelectFilter,
    tableTitle
  } = props;
  const [openColumns, setOpenColumns] = React.useState<boolean>(false);
  const [openFilters, setOpenFilters] = React.useState<boolean>(false);

  const handleClick = (cols: boolean, filters: boolean) => {
    setOpenColumns(cols);
    setOpenFilters(filters);
  };

  const handleReset = () => {
    setOpenFilters(false);
    onResetFilters();
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
            {/* TODO: Export and Import data */}
            <Tooltip title="Export">
              <IconButton aria-label="Export" onClick={() => null}>
                <CloudDownloadIcon />
              </IconButton>
            </Tooltip>
            <Popup
              open={openColumns}
              onClick={() => handleClick(!openColumns, false)}
              content={<Columns columns={columns} selectedColumns={displayColumns} onSelectColumns={onSelectColumns} />}
              tooltip="View Colmns"
              trigger={<ViewColumnIcon />}
            />
            <Popup
              class="table_filters"
              open={openFilters}
              onClick={() => handleClick(false, !openFilters)}
              content={
                <Filters
                  data={data}
                  filters={columns}
                  count={filterCount}
                  onResetFilters={handleReset}
                  onSelectFilter={onSelectFilter}
                />
              }
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
    margin: '5px 16px 20px 20px'
  }
});

export const TableFilterList = withStyles(filterListStyles)(FilterList);

export type sortDir = 'desc' | 'asc';

interface TableProps {
  classes: any;
  data: any[];
  defaultSort?: { dir: sortDir; orderBy: string };
  onDelete: (selected: string[]) => void;
  onEdit: (id: string, type: string) => void;
  columns: Column[];
  title: string;
}

const Table: React.SFC<TableProps> = props => {
  const { classes, data, defaultSort, onDelete, onEdit, columns, title } = props;
  const [displayData, setDisplayData] = React.useState<any[]>([]);
  const [displayColumns, setDisplayColumns] = React.useState<Column[]>(columns);
  const [order, setOrder] = React.useState<sortDir | undefined>(defaultSort ? defaultSort.dir : undefined);
  const [orderBy, setOrderBy] = React.useState<string>(defaultSort ? defaultSort.orderBy : '');
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [page, setPage] = React.useState<number>(0);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [filters, setFilters] = React.useState<{ [key: string]: string | number }>({});

  React.useEffect(() => {
    setDisplayData(data);
  }, [data]);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, displayData.length - page * rowsPerPage);

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
      setSelected(displayData.map((n: any) => n.id));
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

  const handleResetFilters = () => {
    setFilters({});
    setDisplayData(data);
  };

  const handleDeleteFilter = (key: string) => {
    const updatedFilters: { [key: string]: string | number } = {};
    Object.keys(filters).forEach(id => {
      if (id !== key) {
        updatedFilters[id] = filters[id];
      }
    });
    setFilters(updatedFilters);
    filter(updatedFilters);
  };

  const handleSelectFilter = (value: string | number, col: string) => {
    if (value === 'all') {
      handleDeleteFilter(col);
    } else {
      const updatedFilters: { [key: string]: string | number } = { ...filters, [col]: value };
      setFilters(updatedFilters);
      filter(updatedFilters);
    }
  };

  const filter = (dataFilters: { [key: string]: string | number }) => {
    const conditions: Array<(d: any) => boolean> = [];
    Object.keys(dataFilters).forEach(col => {
      conditions.push((d: any) => {
        if (col === 'tags') {
          const tags: any[] = d[col].split(', ');
          return tags.indexOf(dataFilters[col]) !== -1;
        }
        if (col === 'date') {
          const matching = getTransactionByRange(dataFilters[col] as string, [d]);
          return matching.length > 0;
        }
        return d[col] === dataFilters[col];
      });
    });

    const filteredData = data.filter((d: any) => conditions.every(cond => cond(d)));
    setDisplayData(filteredData);
  };

  const handleSelectColumns = (cols: any[]) => {
    const displayCols = columns.filter(c => cols.indexOf(c.id) !== -1);
    setDisplayColumns(displayCols);
  };

  const editType = title.endsWith('s') ? title.toLowerCase().slice(0, title.length - 1) : title.toLowerCase();

  // FIXME: Data table styles
  return (
    <Paper className={classNames([classes.root, 'table'])} elevation={8}>
      <TableToolbar
        columns={columns}
        data={data}
        displayColumns={displayColumns}
        filterCount={Object.keys(filters).length}
        numSelected={selected.length}
        onDelete={() => onDelete(selected)}
        onEdit={() => onEdit(selected[0], editType)}
        onResetFilters={handleResetFilters}
        onSelectColumns={handleSelectColumns}
        onSelectFilter={(e, col) => handleSelectFilter(e.target.value, col)}
        tableTitle={title}
      />
      <TableFilterList filters={filters} onDeleteFilter={handleDeleteFilter} />
      <div className="table_wrapper">
        <MuiTable className={classes.table} aria-labelledby="tableTitle">
          <TableHead
            numSelected={displayData.length > 0 ? selected.length : -1}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={displayData.length}
            columns={displayColumns}
          />
          <TableBody>
            {displayData.length > 0 ? (
              stableSort(displayData, getSorting(order, orderBy))
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
                      {displayColumns.map((col, index) => {
                        if (index === 0) {
                          return (
                            <TableCell key={col.id} component="th" scope="row" padding="none">
                              {n[col.id]}
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell
                            key={col.id}
                            className="table_cell"
                            align={col.numeric ? 'right' : 'left'}
                            padding="none"
                          >
                            {n[col.id]}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
            ) : (
              <TableRow className="table_row" role="checkbox" aria-checked={false} tabIndex={-1} selected={false}>
                <TableCell colSpan={2} />
                <TableCell>No records</TableCell>
              </TableRow>
            )}
            {displayData.length > 0 && emptyRows > 0 && (
              <TableRow style={{ height: 49 * emptyRows }}>
                <TableCell colSpan={displayColumns.length} />
              </TableRow>
            )}
          </TableBody>
        </MuiTable>
      </div>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={displayData.length}
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
    marginBottom: theme.spacing.unit * 5
  },
  table: {
    minWidth: 1020
  }
});

export const DataTable = withStyles(styles)(Table);
