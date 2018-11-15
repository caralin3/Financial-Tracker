import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Dialog, Form } from '../';
import { ActionTypes, sessionStateStore } from '../../store';
import { Transaction, TransactionFilter } from '../../types';
import { HeaderData } from '../../types';
import { formatter, sorter } from '../../utility';

interface FilterDropdownProps {
  data: Transaction[];
  headers: HeaderData[];
  table: string;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface FilterDropdownMergedProps extends
  DispatchMappedProps,
  FilterDropdownProps {}

interface FilterDropdownState {
  range: {
    end: string | number;
    key: string;
    start: string | number;
  };
  showDialog: boolean;
  showOptions: boolean;
  subOption: string;
}

export class DisconnectedFilterDropdown extends React.Component<FilterDropdownMergedProps, FilterDropdownState> {
  public readonly state: FilterDropdownState = {
    range: {
      end: '',
      key: '',
      start: '',
    },
    showDialog: false,
    showOptions: false,
    subOption: '',
  }

  public render() {
    const { headers } = this.props;
    const { showOptions, subOption } = this.state;
    return (
      <div className="filterDropdown">
        <i
          className="filterDropdown_add far fa-plus-square"
          onClick={() => this.setState({ showOptions: !showOptions, subOption: '' })}
        />
        <div className={`filterDropdown_content ${showOptions && 'filterDropdown_content-show'}`}>
          {showOptions && headers.map((header: HeaderData, index: number) =>
            <div
              className="filterDropdown_item"
              key={index}
              onMouseOver={() => this.setState({ subOption: header.label })}
            >
              <span>{ header.label }</span>
              <i className="fas fa-angle-right" />
              {subOption === header.label && headers.map((h: HeaderData, ind: number) =>
                <ul
                  className={`filterDropdown_subItem ${subOption === header.label && 'filterDropdown_subItem-show'}`}
                  key={ind}
                >
                  {this.getSubOptions(header.key).map((op: string, idx: number) => (
                    <li
                      className="filterDropdown_option"
                      key={idx}
                      onClick={() => this.handleClickFilter(header.key, op)}
                    >
                      {header.key === 'date' ? formatter.formatMMDDYYYY(op) :
                        op || header.key === 'note' && 'None'}
                    </li>
                  ))}
                  {(header.key === 'amount' || header.key === 'date' || header.key === 'budget'
                    || header.key === 'budgetPercent' || header.key === 'actual' || header.key === 'variance') && 
                    <li
                      className="filterDropdown_option"
                      onClick={() => this.handleSelectRange(header.key)}
                    >
                      Select Range
                    </li>
                  }
                </ul>
              )}
            </div>
          )}
        </div>
        {this.state.showDialog && 
        <Dialog title="Select Range" toggleDialog={this.toggleDialog}>
          <Form buttonText="Set Range" submit={this.onSetRange}>
            {this.state.range.key === 'date' ? 
              <div className="rangeDialog">
                <label className="rangeDialog_label">Start</label>
                <input
                  className="rangeDialog_input"
                  onChange={(e) => this.handleChange(e, 'date', 'start')}
                  type='date'
                  value={this.state.range.start}
                />
                <label className="rangeDialog_label">End</label>
                <input
                  className="rangeDialog_input"
                  onChange={(e) => this.handleChange(e, 'date', 'end')}
                  type='date'
                  value={this.state.range.end}
                />
              </div> :
              <div className="rangeDialog">
                <label className="rangeDialog_label">Start</label>
                <input
                  className="rangeDialog_input"
                  onChange={(e) => this.handleChange(e, 'amount', 'start')}
                  step='0.01'
                  type='number'
                  value={this.state.range.start}
                />
                <label className="rangeDialog_label">End</label>
                <input
                  className="rangeDialog_input"
                  onChange={(e) => this.handleChange(e, 'amount', 'end')}
                  step='0.01'
                  type='number'
                  value={this.state.range.end}
                />
              </div>
            }
          </Form>
        </Dialog>}
      </div>
    )
  }

  private toggleDialog = () => this.setState({ 
    showDialog: !this.state.showDialog,
    showOptions: false,
    subOption: '',
  });

  private handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, propertyName: string, field: string) => {
    if (propertyName === 'amount') {
      this.setState({ range: {...this.state.range, [field]: parseFloat(event.target.value)}});
    } else if (propertyName === 'date') {
      this.setState({ range: {...this.state.range, [field]: event.target.value}});
    }
  }

  private handleClickFilter = (key: string, filter: string) => {
    const { dispatch, table } = this.props;
    const newFilter: TransactionFilter = {
      filter,
      key,
      table,
    }
    dispatch(sessionStateStore.addTransactionFilter(newFilter));
    this.setState({
      showOptions: false,
      subOption: '',
    });
  }

  private handleSelectRange = (key: string) => {
    this.setState({
      range: {...this.state.range, key}
    });
    this.toggleDialog();
  }

  private onSetRange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { dispatch, table } = this.props;
    const newFilter: TransactionFilter = {
      filter: 'Range',
      key: this.state.range.key,
      range: {
        end: this.state.range.end,
        start: this.state.range.start,
      },
      table,
    }
    dispatch(sessionStateStore.addTransactionFilter(newFilter));
    this.toggleDialog();
    this.setState({
      range: {
        end: '',
        key: '',
        start: '',
      }
    });
  }

  private getSubOptions = (key: string): any[] => {
    const { data } = this.props;
    if (key === 'tags') {
      const tags: any[] = data.map((d) => d[key]);
      const fixedTags: string[] = [];
      if (tags) {
        tags.forEach((tag: string) => {
          if (tag) {
            fixedTags.push.apply(fixedTags, tag);
          }
        });
        const tagOptions = fixedTags.filter((tag: string, index: number, self: any[]) =>
          self.findIndex((t: string) => t === tag) === index);
        return tagOptions.length > 0 ? tagOptions : ['None'];
      }
    } else if (key === 'variance') {
      return ['less than budget', 'greater than budget', 'equal to budget'];
    } else if (key === 'budgetPercent') {
      const options = data.map((d) => !isNaN(d[key]) && formatter.formatPercent(d[key])).filter((dt: string, index, self) =>
        self.findIndex((t: string) => t === dt) === index);
      return options.length > 0 ? options : ['None'];
    } else if (key === 'amount' || key === 'actual' || key === 'budget') {
      const options = data.map((d) => !isNaN(d[key]) && formatter.formatMoney(d[key])).filter((dt: string, index, self) =>
        self.findIndex((t: string) => t === dt) === index);
      return options.length > 0 ? options : ['None'];
    } else if (key === 'date') {
      const options = data.map((d) => d[key]).filter((dt: string, index, self) =>
        self.findIndex((t: string) => t === dt) === index);
      return options.length > 0 ? options : ['None'];
    }
    const subOptions = data.map((d) => d[key]).filter((dt: string, index, self) =>
       self.findIndex((t: string) => t === dt) === index);
    return subOptions.length > 0 ? sorter.sortValues(subOptions, 'desc') : ['None'];
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

export const FilterDropdown = connect<
  FilterDropdownProps,
  DispatchMappedProps
>(null, mapDispatchToProps)(DisconnectedFilterDropdown);
