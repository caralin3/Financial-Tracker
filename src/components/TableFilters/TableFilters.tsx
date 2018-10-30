import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { FilterDropdown } from '../';
import { ActionTypes, AppState, sessionStateStore } from '../../store';
import { HeaderData, Transaction, TransactionFilter } from '../../types';
import { formatter, sorter } from '../../utility';

interface TableFiltersProps {
  data: Transaction[];
  headers: HeaderData[];
  table: string;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface TableFiltersMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  TableFiltersProps {}

interface StateMappedProps {
  filters: TransactionFilter[];
}

export class DisconnectedTableFilters extends React.Component<TableFiltersMergedProps> {
  public readonly state = {}

  public render() {
    const { data, headers, filters, table } = this.props;
    const sortedFilters = sorter.sort(filters.filter((f) => f.table === table), 'desc', 'key');

    return (
      <div className="tableFilters">
        <i className="tableFilters_filterIcon fas fa-filter" />
        <h3 className="tableFilters_title">Filters:</h3>
        {sortedFilters.map((filter, index: number) => (
          <span className="tableFilters_filter" key={index}>
            {formatter.capitalize(filter.key)}: {filter.filter === 'Range' ?
              filter.key === 'date' ? 
              `${formatter.formatMMDDYYYY(filter.range.start)} - ${formatter.formatMMDDYYYY(filter.range.end)}` 
              : `${formatter.formatMoney(filter.range.start)} - ${formatter.formatMoney(filter.range.end)}` : 
              filter.key === 'date' ? formatter.formatMMDDYYYY(filter.filter) : filter.filter}
            <i className="fas fa-times tableFilters_remove" onClick={() => this.removeFilter(filter)} />
          </span>
        ))}
        <FilterDropdown data={data} headers={headers} table={table} />
        {sortedFilters.length > 0 && <i className="fas fa-trash-alt tableFilters_icon" onClick={this.resetFilters} />}
      </div>
    )
  }

  private removeFilter = (filter: TransactionFilter) => {
    const { dispatch } = this.props;
    dispatch(sessionStateStore.removeTransactionFilter(filter));
  }

  private resetFilters = () => {
    const { dispatch, table } = this.props;
    dispatch(sessionStateStore.resetTransactionFilters(table));
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  filters: state.sessionState.transactionFilters,
});

export const TableFilters = connect<
  StateMappedProps,
  DispatchMappedProps,
  TableFiltersProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedTableFilters);
