import { createMuiTheme, Theme } from '@material-ui/core';

const colors = {
  black: '#000',
  dark: '#07535F',
  error: '#d0021b',
  highlight: '#efeeee',
  primary: '#0c98ac',
  secondary: '#085B68',
  success: '#63c312',
  white: '#fff'
};

export const theme: Theme = createMuiTheme({
  overrides: {},
  palette: {
    common: {
      black: colors.black,
      white: colors.white
    },
    divider: colors.white,
    primary: {
      dark: colors.dark,
      light: colors.highlight,
      main: colors.primary
    }
  },
  typography: {
    useNextVariants: true
  }
});
