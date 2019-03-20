import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Tooltip from '@material-ui/core/Tooltip';
import * as React from 'react';

interface PopupProps {
  content: JSX.Element;
  tooltip: string;
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
    <div>
      <Tooltip title={props.tooltip}>
        <IconButton aria-owns={open ? 'popup' : undefined} aria-haspopup="true" onClick={handleClick}>
          {props.trigger}
        </IconButton>
      </Tooltip>
      <Popper id="popup" open={open} anchorEl={anchorEl} transition={true} placement="bottom-end" style={{ zIndex: 1 }}>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper className="popup_content">{props.content}</Paper>
          </Fade>
        )}
      </Popper>
    </div>
  );
};
