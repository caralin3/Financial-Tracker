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
import BackupIcon from '@material-ui/icons/Backup';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FilterListIcon from '@material-ui/icons/FilterList';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import Blob from 'blob';
import classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import config from '../config';
import { requests } from '../firebase/db';
import { FBTransaction } from '../firebase/types';
import { Account, Category, Column, Option, Subcategory, Transaction } from '../types';
import { formatDateTime, getTransactionByRange } from '../util';
import { Alert, Columns, Filters, Popup } from './';

interface TableHeadProps {
  columns: Column[];
  numSelected: number;
  onRequestSort: (e: React.MouseEvent, property: string) => void;
  onSelectAllClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  order: 'desc' | 'asc' | undefined;
  orderBy: string;
  rowCount: number;
}

export const TableHead: React.SFC<TableHeadProps> = ({
  columns,
  numSelected,
  onRequestSort,
  onSelectAllClick,
  order,
  orderBy,
  rowCount
}) => {
  const createSortHandler = (property: string) => (event: any) => {
    onRequestSort(event, property);
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
  accounts: Account[];
  addTransaction: (trans: Transaction) => void;
  categories: Category[];
  classes: any;
  columns: Column[];
  data: any[];
  dateOptions: Option[];
  displayColumns: any[];
  editAccount: (acc: Account) => void;
  filterCount: number;
  numSelected: number;
  onDelete: () => void;
  onEdit: () => void;
  onResetFilters: () => void;
  onSelectColumns: (columns: Column[]) => void;
  onSelectFilter: (e: React.ChangeEvent<HTMLSelectElement>, col: string) => void;
  subcategories: Subcategory[];
  tableTitle: string;
  userId: string;
}

export const Toolbar: React.SFC<TableToolbarProps> = ({
  accounts,
  addTransaction,
  categories,
  classes,
  columns,
  data,
  dateOptions,
  displayColumns,
  editAccount,
  filterCount,
  onDelete,
  onEdit,
  numSelected,
  onResetFilters,
  onSelectColumns,
  onSelectFilter,
  subcategories,
  tableTitle,
  userId
}) => {
  const fileInput = React.useRef(null);
  const [openColumns, setOpenColumns] = React.useState<boolean>(false);
  const [openFilters, setOpenFilters] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');

  const handleClick = (cols: boolean, filters: boolean) => {
    setOpenColumns(cols);
    setOpenFilters(filters);
  };

  const handleReset = () => {
    setOpenFilters(false);
    onResetFilters();
  };

  const convertToCSV = (csvData: any) => {
    let str = '';
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < csvData.length; i++) {
      let line = '';
      // tslint:disable-next-line:forin
      for (const index in csvData[i]) {
        if (line !== '') {
          line += ',';
        }
        line += csvData[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  };

  const convertCSVtoJSON = (csvText: string) => {
    const allLines = csvText.split(/\r\n|\n/);
    const headers = allLines[0].split(/\t|,/);
    const result = [];

    for (let i = 1; i < allLines.length; i++) {
      const obj = {};
      const currentline = allLines[i].split(',');
      for (let j = 0; j < headers.length; j++) {
        if (currentline[j] && currentline[j] !== '') {
          obj[headers[j]] = currentline[j];
        }
      }
      if (Object.keys(obj).length > 0) {
        result.push(obj);
      }
    }

    return JSON.stringify(result);
  };

  const handleImport = (e: any) => {
    const csv = e.target ? e.target.result : '';
    const importedData = JSON.parse(convertCSVtoJSON(csv));
    importedData.forEach(async (d: any) => {
      const [from] = accounts.filter(acc => acc.name === d.From);
      const [to] = accounts.filter(acc => acc.name === d.To);
      const [category] = categories.filter(cat => cat.name === d.Category);
      const [subcategory] = subcategories.filter(sub => sub.name === d.Subcategory);
      const allTags = d.Tags ? d.Tags.split(' ').map((tag: string) => tag.trim()) : [];
      const newTrans: FBTransaction = {
        amount: d.Amount ? parseFloat(d.Amount.replace(/[^\d.-]/g, '')) : 0,
        category: category || '',
        date: formatDateTime(d.Date),
        from: from || '',
        item: d.Item ? d.Item.trim() : '',
        note: d.Note ? d.Note.trim() : '',
        subcategory: subcategory || '',
        tags: allTags,
        to: to || '',
        type: category ? 'expense' : d.Item ? 'income' : 'transfer',
        userId
      };
      await requests.transactions.createTransaction(newTrans, addTransaction);
      if (category) {
        if (from) {
          const updatedAcc: Account = {
            ...from,
            amount: from.amount - newTrans.amount
          };
          await requests.accounts.updateAccount(updatedAcc, editAccount);
        }
      } else if (!category && d.Item) {
        if (to) {
          const updatedAcc: Account = {
            ...to,
            amount: to.amount + newTrans.amount
          };
          await requests.accounts.updateAccount(updatedAcc, editAccount);
        }
      } else {
        if (from && to) {
          const updatedFromAcc: Account = {
            ...from,
            amount: from.amount - newTrans.amount
          };
          const updatedToAcc: Account = {
            ...to,
            amount: to.amount + newTrans.amount
          };
          await requests.accounts.updateAccount(updatedFromAcc, editAccount);
          await requests.accounts.updateAccount(updatedToAcc, editAccount);
        }
      }
    });
    setMessage('Transactions have been imported.');
    setSuccess(true);
  };

  const readCSVFile = () => {
    const reader = new FileReader();
    if (fileInput) {
      reader.readAsText((fileInput.current as any).files[0]);
      reader.onload = (e: any) => handleImport(e);
      reader.onerror = () => {
        if (config.env === 'development') {
          console.log('Could not import file');
        }
      };
    }
  };

  const downloadData = (headers: object, exportData: object[], fileName: string) => {
    exportData.unshift(headers);

    // Convert Object to JSON
    const jsonObject = JSON.stringify(exportData);

    const csv = convertToCSV(JSON.parse(jsonObject));

    const exportedFilename = fileName + '.csv' || 'export.csv';

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, exportedFilename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', exportedFilename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const exportTransactions = () => {
    const date = moment(new Date()).format('MMDDYYYY_hhmmss');
    if (data[0].type === 'expense') {
      // tslint:disable:object-literal-sort-keys
      const expenseHeaders = {
        item: 'Item',
        from: 'From',
        category: 'Category',
        subcategory: 'Subcategory',
        note: 'Note',
        tags: 'Tags',
        date: 'Date',
        amount: 'Amount'
      };
      const expenses = data.map((d: any) => ({
        item: d.item,
        from: d.from,
        category: d.category,
        subcategory: d.subcategory,
        note: d.note || 'N/A',
        tags: d.tags ? d.tags.replace(/,/g, ' ') : 'N/A',
        date: d.date,
        amount: d.amount
      }));
      const fileName = `expenses_${date}`;
      downloadData(expenseHeaders, expenses, fileName);
    } else if (data[0].type === 'income') {
      const incomeHeaders = {
        item: 'Item',
        to: 'To',
        note: 'Note',
        tags: 'Tags',
        date: 'Date',
        amount: 'Amount'
      };
      const income = data.map((d: any) => ({
        item: d.item,
        to: d.to,
        note: d.note || 'N/A',
        tags: d.tags ? d.tags.replace(/,/g, ' ') : 'N/A',
        date: d.date,
        amount: d.amount
      }));
      const fileName = `income_${date}`;
      downloadData(incomeHeaders, income, fileName);
    } else if (data[0].type === 'transfer') {
      const transferHeaders = {
        from: 'From',
        to: 'To',
        note: 'Note',
        tags: 'Tags',
        date: 'Date',
        amount: 'Amount'
      };
      const transfers = data.map((d: any) => ({
        from: d.from,
        to: d.to,
        note: d.note || 'N/A',
        tags: d.tags ? d.tags.replace(/,/g, ' ') : 'N/A',
        date: d.date,
        amount: d.amount
      }));
      const fileName = `transfers_${date}`;
      downloadData(transferHeaders, transfers, fileName);
    }
    // tslint:enable:object-literal-sort-keys
    setMessage(`${tableTitle} have been exported.`);
    setSuccess(true);
  };

  return (
    <MuiToolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <Alert onClose={() => setSuccess(false)} open={success} variant="success" message={message} />
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
            <input
              ref={fileInput}
              accept=".csv"
              className={classes.input}
              onChange={readCSVFile}
              id="import-file"
              type="file"
            />
            <label htmlFor="import-file">
              <Tooltip title="Import">
                <IconButton aria-label="Import" component="span">
                  <CloudDownloadIcon />
                </IconButton>
              </Tooltip>
            </label>
            <Tooltip title="Export">
              <IconButton aria-label="Export" onClick={exportTransactions}>
                <BackupIcon />
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
                  dateOptions={dateOptions}
                  filters={columns}
                  count={filterCount}
                  onClose={() => setOpenFilters(false)}
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
  input: {
    display: 'none'
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

const FilterList: React.SFC<TableFilterListProps> = ({ classes, filters, onDeleteFilter }) => {
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
  accounts: Account[];
  addTransaction: (trans: Transaction) => void;
  categories: Category[];
  classes: any;
  columns: Column[];
  data: any[];
  dateOptions: Option[];
  defaultSort?: { dir: sortDir; orderBy: string };
  editAccount: (acc: Account) => void;
  onDelete: (selected: string[]) => void;
  onEdit: (id: string, type: string) => void;
  subcategories: Subcategory[];
  title: string;
  userId: string;
}

const Table: React.SFC<TableProps> = ({
  accounts,
  addTransaction,
  categories,
  classes,
  columns,
  dateOptions,
  data,
  defaultSort,
  editAccount,
  onDelete,
  onEdit,
  subcategories,
  title,
  userId
}) => {
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

  return (
    <Paper className={classes.root} elevation={8}>
      <TableToolbar
        accounts={accounts}
        addTransaction={addTransaction}
        categories={categories}
        columns={columns}
        data={data}
        dateOptions={dateOptions}
        displayColumns={displayColumns}
        editAccount={editAccount}
        filterCount={Object.keys(filters).length}
        numSelected={selected.length}
        onDelete={() => {
          onDelete(selected);
          setSelected([]);
        }}
        onEdit={() => onEdit(selected[0], editType)}
        onResetFilters={handleResetFilters}
        onSelectColumns={handleSelectColumns}
        onSelectFilter={(e: any, col: any) => handleSelectFilter(e.target.value, col)}
        subcategories={subcategories}
        tableTitle={title}
        userId={userId}
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
          'aria-label': 'Previous Page',
          classes: {
            root: classes.arrow,
          },
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
          classes: {
            root: classes.arrow,
          },
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
  arrow: {
    padding: 0,
    [theme.breakpoints.up('sm')]: {
      padding: 12,
    },
  },
  root: {
    marginBottom: theme.spacing.unit * 5
  },
  table: {
    minWidth: 1020
  }
});

export const DataTable = withStyles(styles)(Table);
