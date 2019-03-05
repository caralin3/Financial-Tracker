import { Button, Grow, MenuItem, MenuList, Paper, Popper } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import * as React from 'react';

interface DropdownMenuProps {
  selected: string;
  menuItems: Array<{ label: string; value: string | number }>;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const DropdownMenu: React.SFC<DropdownMenuProps> = props => {
  const [open, setOpen] = React.useState<boolean>(false);
  let anchorEl = null;

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onClose(e);
    setOpen(false);
  };

  return (
    <div>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <div>
          <Button
            buttonRef={ref => (anchorEl = ref)}
            aria-owns={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="primary"
            onClick={() => setOpen(!open)}
            variant="contained"
          >
            {props.selected}
          </Button>
          <Popper open={open} anchorEl={anchorEl as any} transition={true} disablePortal={true}>
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
                        {item.label}
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
