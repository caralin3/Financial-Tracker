import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { BudgetTableData, DeleteDialog, TableData, TableFilters } from '../';
import { db } from '../../firebase';
import { ActionTypes, AppState, sessionStateStore } from '../../store';
import { Category, HeaderData, TableDataType, TransactionFilter } from '../../types';
import { calculations, formatter, sorter } from '../../utility';

interface TableProps {
  content: TableDataType;
  type: string;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  categories: Category[];
  editingTransaction: boolean;
  filters: TransactionFilter[];
}

interface TableMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  TableProps {}

interface TableState {
  deleting: boolean;
  editId: string;
  id: string;
  sortedBy: {
    dir: 'asc' | 'desc';
    key: string;
  }
}

export class DisconnectedTable extends React.Component<TableMergedProps, TableState> {
  public readonly state: TableState = {
    deleting: false,
    editId: '',
    id: '',
    sortedBy: {dir: 'desc', key: (this.props.type === 'budget' || this.props.type === 'ideal') ? 'name' : 'date'},
  }
  
  public render () {
    const { categories, content, type } = this.props;
    const { sortedBy } = this.state;

    const percentTotal: number = calculations.totals(categories, 'budgetPercent');
    const budgetTotal: number = calculations.totals(categories, 'budget');
    const actualTotal: number = calculations.totals(categories, 'actual');
    const varianceTotal: number = actualTotal - budgetTotal;

    return (
      <div className="table_wrapper">
        {this.state.deleting && 
          <DeleteDialog
            confirmDelete={this.onDelete}
            text="Are you sure you want to delete this transaction"
            toggleDialog={this.toggleDeleteDialog}
          />
        }
        {type !== 'ideal' &&
          <TableFilters
            data={this.filterData(content.data)}
            headers={content.headers}
            table={this.props.type}
          />
        }
        <table className="table">
          <thead className="table_header">
            <tr className="table_row">
              {content.headers.map((header: HeaderData, index: number) => (
                <th className="table_heading" key={index}>
                  <span className="table_heading-header" onClick={() => this.setSort(header.key)}>
                    <span className="table_heading-label">{ header.label }</span>
                    {sortedBy.key === header.key && 
                    <i className={`table_heading-icon fas fa-long-arrow-alt-${sortedBy.dir === 'asc' ? 'up' : 'down'}`} />}
                  </span>
                </th>
              ))}
              {(type === 'budget' || type === 'ideal') ? <></> : <th className="table_heading">Actions</th>}
            </tr>
          </thead>
          <tbody className="table_body">
            {this.filterData(content.data).map((d: any, index: number) => (
              <tr className="table_row" key={index}>
                {content.headers.map((header: HeaderData, ind: number) => (
                  type === 'budget' || type === 'ideal' ?
                  <BudgetTableData
                    categoryId={d.id}
                    data={d[header.key] || 0}
                    dataKey={header.key}
                    key={ind}
                  /> :
                  <TableData
                    data={d[header.key] || 'N/A'}
                    editing={this.state.editId === d.id}
                    heading={header.label}
                    id={d.id}
                    key={ind}
                    transType={d.type}
                    type={type}
                  />
                ))
                }
              {(type === 'budget' || type === 'ideal') ? <></> :
                <td className="table_icons">
                  <i className="fas fa-edit table_icon" onClick={() => this.toggleEdit(d.id)} />
                  <i className="fas fa-trash-alt table_icon" onClick={() => this.onPressDelete(d.id)} />
                </td>
              }
              </tr>
            ))}
            {type === 'budget' &&
              <tr className="table_row">
                <td className="table_totals">Totals</td>
                <td className="table_totals table_totals-number">
                  { formatter.formatPercent(percentTotal) }
                </td>
                <td className="table_totals table_totals-number">
                  { formatter.formatMoney(budgetTotal) }
                </td>
                <td className="table_totals table_totals-number">
                  { formatter.formatMoney(actualTotal) }
                </td>
                <td className="table_totals table_totals-number">
                  { formatter.formatMoney(varianceTotal) }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    )
  }

  private toggleEdit = (id: string) => {
    const { dispatch } = this.props;
    this.setState({ editId: this.state.editId ? '' : id });
    dispatch(sessionStateStore.setEditingTransaction(!this.state.editId));
  };

  private toggleDeleteDialog = () => this.setState({ deleting: !this.state.deleting });

  private onPressDelete = (id: string) => {
    this.setState({ id });
    this.toggleDeleteDialog();
  }

  private onDelete = () => {
    const { dispatch, type } = this.props;
    if (type !== 'budget') {
      db.requests.transactions.remove(this.state.id, dispatch);
    }
    this.toggleDeleteDialog();
  }

  private setSort = (key: string) => {
    const { sortedBy } = this.state;
    let dir: 'asc' | 'desc' = 'desc';
    if (key === sortedBy.key) {
      if (sortedBy.dir === dir) {
        dir = 'asc';
      } else {
        dir = 'desc';
      }
    } else {
      dir = 'asc';
    }
    this.setState({sortedBy: {key, dir}});
    this.sortData(key, dir);
  }

  private sortData = (key: string, dir: 'asc' | 'desc') => {
    const { content } = this.props;
    sorter.sort(content.data, dir, key);
  }

  private filterData = (data: any[]) => {
    const { filters, type } = this.props;
    const conditions: any[] = [];
    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if (type === filter.table) {
          if (filter.range) {
            conditions.push((d: any) => filter.range && 
              d[filter.key] >= filter.range.start && d[filter.key] <= filter.range.end)
          } else if (filter.key === 'tags') {
            conditions.push((d: any) => d[filter.key].indexOf(filter.filter) !== -1);
          } else if (filter.key === 'variance') {
            if (filter.filter.startsWith('less')) {
              conditions.push((d: any) => d[filter.key] < d.budget);
            } else if (filter.filter.startsWith('greater')) {
              conditions.push((d: any) => d[filter.key] > d.budget);
            } else {
              conditions.push((d: any) => d[filter.key] === d.budget);
            }
          } else if (filter.key === 'amount' || filter.key === 'actual' || filter. key === 'budget') {
            conditions.push((d: any) => formatter.formatMoney(d[filter.key]) === filter.filter);
          } else if (filter.key === 'budgetPercent') {
            conditions.push((d: any) => formatter.formatPercent(d[filter.key]) === filter.filter);
          } else {
            conditions.push((d: any) => d[filter.key] === filter.filter);
          }
        }
      });
      return data.filter((d: any) => conditions.every((cond) => cond(d)));
    }
    return data;
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  categories: state.categoriesState.categories,
  editingTransaction: state.sessionState.editingTransaction,
  filters: state.sessionState.transactionFilters,
});

export const Table = connect<
  StateMappedProps,
  DispatchMappedProps,
  TableProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedTable);
