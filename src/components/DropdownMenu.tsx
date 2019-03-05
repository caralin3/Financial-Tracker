import { Button, Grow, MenuItem, MenuList, Paper, Popper, Typography } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import * as React from 'react';

interface DropdownMenuProps {
  className?: string;
  menuListClass?: string;
  selected: string;
  menuItems: Array<{ label: string; value: string | number }>;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const DropdownMenu: React.SFC<DropdownMenuProps> = props => {
  const [open, setOpen] = React.useState<boolean>(false);
  const mobile = useMediaQuery('(max-width:768px)');
  let anchorEl = null;

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onClose(e);
    setOpen(false);
  };

  return (
    <div className={props.className}>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <div style={{ width: '100%' }}>
          <Button
            buttonRef={ref => (anchorEl = ref)}
            aria-owns={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="primary"
            onClick={() => setOpen(!open)}
            variant="contained"
            fullWidth={mobile ? true : false}
          >
            {props.selected}
          </Button>
          <Popper
            className={props.menuListClass}
            open={open}
            anchorEl={anchorEl}
            transition={true}
            disablePortal={true}
            placement="bottom-end"
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
                }}
              >
                <Paper>
                  <MenuList>
                    {props.menuItems.map(item => (
                      <MenuItem key={item.value} data-value={item.value} onClick={handleClose}>
                        <Typography>{item.label}</Typography>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </ClickAwayListener>
    </div>
  );
};
