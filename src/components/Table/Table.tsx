import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { DeleteDialog, TableData } from '../';
import { db } from '../../firebase';
import { ActionTypes, AppState, sessionStateStore } from '../../store';
import { HeaderData, TableDataType } from '../../types';
import { sorter } from '../../utility';

interface TableProps {
  content: TableDataType;
  type: string;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  editingTransaction: boolean;
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
    sortedBy: {dir: 'desc', key: 'date'},
  }
  
  public render () {
    const { content } = this.props;
    const { sortedBy } = this.state;
    return (
      <div className="table_wrapper">
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
              {content.headers.map((header: HeaderData, index: number) => (
                <th className="table_heading" key={index}>
                  <span className="table_heading-header" onClick={() => this.setSort(header.key)}>
                    <span className="table_heading-label">{ header.label }</span>
                    {sortedBy.key === header.key && 
                    <i className={`table_heading-icon fas fa-long-arrow-alt-${sortedBy.dir === 'asc' ? 'up' : 'down'}`} />}
                  </span>
                </th>
              ))}
              <th className="table_heading">Actions</th>
            </tr>
          </thead>
          <tbody className="table_body">
            {content.data.map((d: any, index: number) => (
              <tr className="table_row" key={index}>
                {content.headers.map((header: HeaderData, ind: number) => (
                  <TableData
                    data={d[header.key.toLowerCase()] || 'N/A'}
                    editing={this.state.editId === d.id}
                    heading={header.label}
                    id={d.id}
                    key={ind}
                    transType={d.type}
                    type={this.props.type}
                  />
                ))}
                <td className="table_icons">
                  <i className="fas fa-edit table_icon" onClick={() => this.toggleEdit(d.id)} />
                  <i className="fas fa-trash-alt table_icon" onClick={() => this.onPressDelete(d.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
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
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  editingTransaction: state.sessionState.editingTransaction,
});

export const Table = connect<
  StateMappedProps,
  DispatchMappedProps,
  TableProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedTable);
