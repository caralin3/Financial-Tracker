import { CardHeader, Dialog, DialogContent, IconButton, Theme, withStyles } from '@material-ui/core';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import Close from '@material-ui/icons/Close';
import * as React from 'react';
import { Form } from './';

interface ModalFormProps {
  classes: any;
  disabled: boolean;
  formButton: string;
  formTitle: string;
  formSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
  handleClose: () => void;
  open: boolean;
}

export const UnwrappedModalForm: React.SFC<ModalFormProps> = props => {
  const { classes } = props;
  const xs = useMediaQuery('(max-width:680px)');
  const sm = useMediaQuery('(max-width:1070px)');

  return (
    <Dialog
      aria-labelledby={`form-modal-${props.formTitle}`}
      aria-describedby="form-modal-description"
      open={props.open}
      className="modalForm"
      onClose={props.handleClose}
      scroll="body"
      fullWidth={true}
      fullScreen={xs}
      maxWidth={sm ? 'sm' : 'md'}
    >
      <DialogContent>
        <CardHeader
          classes={{
            title: classes.title
          }}
          action={
            <IconButton onClick={props.handleClose}>
              <Close color="primary" />
            </IconButton>
          }
          title={props.formTitle}
        />
        <Form buttonText={props.formButton} disabled={props.disabled} loading={props.loading} submit={props.formSubmit}>
          {props.children}
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const styles = (theme: Theme) => ({
  title: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    [theme.breakpoints.down('sm')]: {
      fontSize: 22
    }
  }
});

export const ModalForm = withStyles(styles as any, { withTheme: true })(UnwrappedModalForm);
