import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Dialog, Form } from '../';
import { ActionTypes, sessionStateStore } from '../../store';

interface RangeDialogProps {
  rangeType: 'date' | 'amount';
  section: string;
  toggleDialog: () => void;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface RangeDialogMergedProps extends
  DispatchMappedProps,
  RangeDialogProps {}

interface RangeDialogState {
  end: string | number;
  start: string | number;
}

export class DisconnectedRangeDialog extends React.Component<RangeDialogMergedProps, RangeDialogState> {
  public readonly state = {
    end: '',
    start: '',
  }

  public render() {
    const { rangeType, toggleDialog } = this.props;
    const { end, start } = this.state;

    const isInvalid = end < start;

    return (
      <Dialog title="Select Range" toggleDialog={toggleDialog}>
        <Form buttonText="Set Range" disabled={isInvalid} submit={this.onSetRange}>
          {rangeType === 'date' ? 
            <div className="rangeDialog">
              <label className="rangeDialog_label">Start</label>
              <input
                className="rangeDialog_input"
                onChange={(e) => this.handleChange(e, 'start')}
                type='date'
                value={start}
              />
              <label className="rangeDialog_label">End</label>
              <input
                className="rangeDialog_input"
                onChange={(e) => this.handleChange(e, 'end')}
                type='date'
                value={end}
              />
            </div> :
            <div className="rangeDialog">
              <label className="rangeDialog_label">Start</label>
              <input
                className="rangeDialog_input"
                onChange={(e) => this.handleChange(e, 'start')}
                step='0.01'
                type='number'
                value={start}
              />
              <label className="rangeDialog_label">End</label>
              <input
                className="rangeDialog_input"
                onChange={(e) => this.handleChange(e, 'end')}
                step='0.01'
                type='number'
                value={end}
              />
            </div>
          }
        </Form>
      </Dialog>
    )
  }

  private handleChange = (e: React.ChangeEvent<HTMLInputElement>, propertyName: string) => {
    const { rangeType } = this.props;
    if (rangeType === 'date') {
      this.setState({
        [propertyName]: e.target.value as string | number,
      } as Pick<RangeDialogState, keyof RangeDialogState>)
    } else {
      this.setState({
        [propertyName]: parseFloat(e.target.value) as string | number,
      } as Pick<RangeDialogState, keyof RangeDialogState>)
    }
  }

  private onSetRange = (e: React.FormEvent<HTMLFormElement>) => {
    const { dispatch, section, toggleDialog } = this.props;
    const { end, start } = this.state;
    e.preventDefault();
    if (section === 'topExpenses') {
      dispatch(sessionStateStore.setTopExpenses({start, end}));
    }
    toggleDialog();
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>) => ({ dispatch });

export const RangeDialog = connect<
  RangeDialogProps,
  DispatchMappedProps
>(null, mapDispatchToProps)(DisconnectedRangeDialog);
