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

export const Popup: React.SFC<PopupProps> = ({ class: className, content, open, onClick, tooltip, trigger }) => {
  const [anchorEl, setAnchorEl] = React.useState<any>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { currentTarget } = event;
    setAnchorEl(currentTarget);
    onClick();
  };

  return (
    <div>
      <Tooltip title={tooltip}>
        <IconButton aria-owns={open ? 'popup' : undefined} aria-haspopup="true" onClick={handleClick}>
          {trigger}
        </IconButton>
      </Tooltip>
      <Popper
        className={classnames(['popup', className])}
        id="popup"
        open={open}
        anchorEl={anchorEl}
        transition={true}
        placement="bottom-end"
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper className="popup_content">{content}</Paper>
          </Fade>
        )}
      </Popper>
    </div>
  );
};
