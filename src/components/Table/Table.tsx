import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { DeleteDialog } from '../';
import { db } from '../../firebase';
import { ActionTypes } from '../../store';
import { TableDataType } from '../../types';
// import { formatter } from '../../utility';
import { TableData } from '../TableData';

interface TableProps {
  content: TableDataType;
  type: string;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface TableMergedProps extends
  DispatchMappedProps,
  TableProps {}

interface TableState {
  deleting: boolean;
  editing: boolean;
  id: string;
}

export class DisconnectedTable extends React.Component<TableMergedProps, TableState> {
  public readonly state: TableState = {
    deleting: false,
    editing: false,
    id: '',
  }
  
  public render () {
    const { content } = this.props;
    return (
      <div>
        {this.state.deleting && 
          <DeleteDialog
            confirmDelete={this.onDelete}
            text="Are you sure you want to delete this transaction"
            toggleDialog={this.toggleDeleteDialog}
          />
        }
        <table className="table">
          <thead className="table_header">
            <tr className="table_row">
              {content.headers.map((header: string, index: number) => (
                <th className="table_heading" key={index}>{ this.getHeader(header) }</th>
              ))}
              <th className="table_heading">Actions</th>
            </tr>
          </thead>
          <tbody className="table_body">
            {content.data.map((d: any, index: number) => (
              <tr className="table_row" key={index}>
                {content.headers.map((header: string, ind: number) => (
                  <TableData
                    data={d[header.toLowerCase()] || 'N/A'}
                    editing={this.state.editing}
                    heading={this.getHeader(header)}
                    id={d.id}
                    key={ind}
                    type={this.props.type}
                  />
                  // <td className="table_data" key={ind}>
                  //   { header === 'Amount' ? 
                  //     formatter.formatMoney(d[header.toLowerCase()]) :
                  //     header === 'Date' ? formatter.formatMMDDYYYY(d[header.toLowerCase()])
                  //     : d[header.toLowerCase()] || 'N/A'
                  //   }
                  // </td>
                ))}
                <td className="table_icons">
                  <i className="fas fa-edit table_icon" onClick={this.toggleEdit} />
                  <i className="fas fa-trash-alt table_icon" onClick={() => this.onPressDelete(d.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  private toggleEdit = () => this.setState({ editing: !this.state.editing });

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
