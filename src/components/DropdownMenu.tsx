import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import * as React from 'react';

interface DropdownMenuProps {
  className?: string;
  menuItems: Array<{ label: string; value: string | number }>;
  menuListClass?: string;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
  selected: string;
}

export const DropdownMenu: React.SFC<DropdownMenuProps> = ({
  className,
  menuItems,
  menuListClass,
  onClose,
  selected
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const mobile = useMediaQuery('(max-width:768px)');

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClose(e);
    setOpen(false);
  };

  return (
    <div className={className}>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <div style={{ width: '100%' }}>
          <Button
            buttonRef={ref => setAnchorEl(ref)}
            aria-owns={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="primary"
            onClick={() => setOpen(!open)}
            variant="contained"
            fullWidth={mobile ? true : false}
          >
            {selected}
          </Button>
          <Popper
            id="menu-list-grow"
            className={menuListClass}
            open={open}
            anchorEl={anchorEl}
            transition={true}
            disablePortal={true}
            placement="bottom-end"
            style={{ zIndex: 1 }}
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
                    {menuItems.map(item => (
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
