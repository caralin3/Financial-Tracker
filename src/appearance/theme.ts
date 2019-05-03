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

export const solidColors = [
  'rgb(230, 25, 75)',
  'rgb(60, 180, 75)',
  'rgb(255, 225, 25)',
  'rgb(0, 130, 200)',
  'rgb(245, 130, 48)',
  'rgb(145, 30, 180)',
  'rgb(70, 240, 240)',
  'rgb(240, 50, 230)',
  'rgb(210, 245, 60)',
  'rgb(250, 190, 190)',
  'rgb(0, 128, 128)',
  'rgb(230, 190, 255)',
  'rgb(170, 110, 40)',
  'rgb(255, 250, 200)',
  'rgb(128, 0, 0)',
  'rgb(170, 255, 195)',
  'rgb(128, 128, 0)',
  'rgb(255, 215, 180)',
  'rgb(0, 0, 128)',
  'rgb(128, 128, 128)'
];

export const opaqueColors = [
  'rgba(230, 25, 75, .4)',
  'rgba(60, 180, 75, .4)',
  'rgba(255, 225, 25, .4)',
  'rgba(0, 130, 200, .4)',
  'rgba(245, 130, 48, .4)',
  'rgba(145, 30, 180, .4)',
  'rgba(70, 240, 240, .4)',
  'rgba(240, 50, 230, .4)',
  'rgba(210, 245, 60, .4)',
  'rgba(250, 190, 190, .4)',
  'rgba(0, 128, 128, .4)',
  'rgba(230, 190, 255, .4)',
  'rgba(170, 110, 40, .4)',
  'rgba(255, 250, 200, .4)',
  'rgba(128, 0, 0, .4)',
  'rgba(170, 255, 195, .4)',
  'rgba(128, 128, 0, .4)',
  'rgba(255, 215, 180, .4)',
  'rgba(0, 0, 128, .4)',
  'rgba(128, 128, 128, .4)'
];

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
