import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { ActionTypes, sessionStateStore } from '../../store';
import { Transaction, TransactionFilter } from '../../types';
import { HeaderData } from '../../types';
import { formatter } from '../../utility';

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
  showOptions: boolean;
  subOption: string;
}

export class DisconnectedFilterDropdown extends React.Component<FilterDropdownMergedProps, FilterDropdownState> {
  public readonly state: FilterDropdownState = {
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
                      { op || header.key === 'note' && 'None' }
                    </li>
                  ))}
                  {(header.key === 'amount' || header.key === 'date') && 
                    <li
                      className="filterDropdown_option"
                      onClick={() => this.handleClickFilter(header.key, 'Select Range')}
                    >
                      Select Range
                    </li>
                  }
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    )
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
    })
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
        return fixedTags.filter((tag: string, index: number, self: any[]) => self.findIndex((t: string) => t === tag) === index);
      }
    } else if (key === 'amount') {
      return data.map((d) => formatter.formatMoney(d[key])).filter((dt: string, index, self) => self.findIndex((t: string) => t === dt) === index);
    } else if (key === 'date') {
      return data.map((d) => formatter.formatMMDDYYYY(d[key])).filter((dt: string, index, self) => self.findIndex((t: string) => t === dt) === index);
    }
    return data.map((d) => d[key]).filter((dt: string, index, self) => self.findIndex((t: string) => t === dt) === index);
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

export const FilterDropdown = connect<
  FilterDropdownProps,
  DispatchMappedProps
>(null, mapDispatchToProps)(DisconnectedFilterDropdown);
