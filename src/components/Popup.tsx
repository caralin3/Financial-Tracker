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

export const Popup: React.SFC<PopupProps> = props => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<any>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { currentTarget } = event;
    setAnchorEl(currentTarget);
    setOpen(!open);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div>
        <IconButton aria-owns={open ? 'menu-list-grow' : undefined} aria-haspopup="true" onClick={handleClick}>
          {props.trigger}
        </IconButton>
        <Popper open={open} anchorEl={anchorEl} transition={true} placement="bottom-end" style={{ zIndex: 1 }}>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>{props.content}</Paper>
            </Fade>
          )}
        </Popper>
      </div>
    </ClickAwayListener>
  );
}
