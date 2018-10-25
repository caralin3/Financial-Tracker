import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { ActionTypes } from '../../store';
import { TableData } from '../../types';
import { formatter } from '../../utility';

interface TableProps {
  content: TableData;
  type: string;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface TableMergedProps extends
  DispatchMappedProps,
  TableProps {}

interface TableState {
}

export class DisconnectedTable extends React.Component<TableMergedProps, TableState> {
  public readonly state: TableState = {
  }
  
  public render () {
    const { content } = this.props;
    return (
      <table className="table">
        <thead className="table_header">
          <tr className="table_row">
            {content.headers.map((header: string, index: number) => (
              <th className="table_heading" key={index}>{ this.getHeader(header) }</th>
            ))}
          </tr>
        </thead>
        <tbody className="table_body">
          {content.data.map((d: any, index: number) => (
            <tr className="table_row" key={index}>
              {content.headers.map((header: string, ind: number) => (
                <td className="table_data" key={ind}>
                  { header === 'Amount' ? 
                    formatter.formatMoney(d[header.toLowerCase()]) :
                    header === 'Date' ? formatter.formatMMDDYYYY(d[header.toLowerCase()])
                    : d[header.toLowerCase()] || 'N/A'
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  private getHeader = (header: string) => {
    const { type } = this.props;
    if (type === 'expenses') {
      switch(header) {
        case 'From':
          return 'Payment Method';
        case 'To':
          return 'Item';
        default:
          return header;
      }
    } else if (type === 'income') {
      switch(header) {
        case 'From':
          return 'Job';
        case 'To':
          return 'Account';
        default:
          return header;
      }
    } else if (type === 'transfers') {
      switch(header) {
        case 'From':
          return 'Account From';
        case 'To':
          return 'Account To';
        default:
          return header;
      }
    }
    return header;
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

export const Table = connect<
  TableProps,
  DispatchMappedProps
>(null, mapDispatchToProps)(DisconnectedTable);
