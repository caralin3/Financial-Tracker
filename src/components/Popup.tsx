import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import * as React from 'react';

interface PopupProps {
  content: JSX.Element;
  trigger: JSX.Element;
}

export class Popup extends React.Component<PopupProps> {
  public readonly state = {
    anchorEl: null,
    open: false
  };

  public handleClick = (event: any) => {
    const { currentTarget } = event;
    this.setState((state: any) => ({
      anchorEl: currentTarget,
      open: !state.open
    }));
  };

  public render() {
    const { anchorEl, open } = this.state;
    const id: string | null = open ? 'simple-popper' : null;

    return (
      <ClickAwayListener onClickAway={() => this.setState({ open: false })}>
        <div>
          <IconButton aria-owns={open ? 'menu-list-grow' : undefined} aria-haspopup="true" onClick={this.handleClick}>
            {this.props.trigger}
          </IconButton>
          <Popper id={id ? id : ''} open={open} anchorEl={anchorEl} transition={true} placement="bottom-end">
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>{this.props.content}</Paper>
              </Fade>
            )}
          </Popper>
        </div>
      </ClickAwayListener>
    );
  }
}
