import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { AddTransactionForm, Dialog } from '../';
import { ActionTypes, AppState } from '../../store';

interface AddTransactionDialogProps {
  class?: string;
  toggleDialog: () => void;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {}

interface AddTransactionDialogMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  AddTransactionDialogProps {}

interface AddTransactionDialogState {}

export class DisconnectedAddTransactionDialog extends React.Component<AddTransactionDialogMergedProps, AddTransactionDialogState> {
  public readonly state: AddTransactionDialogState = {}

  public render() {
    return (
      <Dialog class="addTransactionDialog" title="Add Transaction" toggleDialog={this.props.toggleDialog}>
        <AddTransactionForm toggleDialog={this.props.toggleDialog} />
      </Dialog>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: AppState) => ({});

export const AddTransactionDialog = connect<
  StateMappedProps,
  DispatchMappedProps,
  AddTransactionDialogProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedAddTransactionDialog);
