import { createMuiTheme, Theme } from '@material-ui/core';

const colors = {
  black: '#000',
  dark: '#07535F',
  disabled: '#CECECE',
  error: '#F44336',
  highlight: '#efeeee',
  primary: '#0c98ac',
  secondary: '#085B68',
  success: '#63c312',
  white: '#fff'
};

export const theme: Theme = createMuiTheme({
  overrides: {
    MuiTablePagination: {
      actions: {
        marginLeft: 0
      }
    }
  },
  palette: {
    action: {
      disabled: colors.white,
      disabledBackground: colors.disabled
    },
    common: {
      black: colors.black,
      white: colors.white
    },
    divider: colors.white,
    primary: {
      dark: colors.dark,
      light: colors.highlight,
      main: colors.primary
    },
    text: {
      primary: colors.black,
      secondary: colors.primary
    }
  },
  typography: {
    fontSize: 16,
    useNextVariants: true
  }
});
