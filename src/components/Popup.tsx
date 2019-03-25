import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Tooltip from '@material-ui/core/Tooltip';
import classnames from 'classnames';
import * as React from 'react';

interface PopupProps {
  class?: string;
  content: JSX.Element;
  open: boolean;
  onClick: () => void;
  tooltip: string;
  trigger: JSX.Element;
}

export const Popup: React.SFC<PopupProps> = props => {
  const [anchorEl, setAnchorEl] = React.useState<any>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { currentTarget } = event;
    setAnchorEl(currentTarget);
    props.onClick();
  };

  return (
    <div>
      <Tooltip title={props.tooltip}>
        <IconButton aria-owns={props.open ? 'popup' : undefined} aria-haspopup="true" onClick={handleClick}>
          {props.trigger}
        </IconButton>
      </Tooltip>
      <Popper
        className={classnames(['popup', props.class])}
        id="popup"
        open={props.open}
        anchorEl={anchorEl}
        transition={true}
        placement="bottom-end"
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper className="popup_content">{props.content}</Paper>
          </Fade>
        )}
      </Popper>
    </div>
  );
};
