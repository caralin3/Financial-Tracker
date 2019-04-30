import { CardHeader, Dialog, DialogContent, IconButton, Theme, withStyles } from '@material-ui/core';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import Close from '@material-ui/icons/Close';
import * as React from 'react';
import { Form } from './';

interface ModalFormProps {
  classes: any;
  disabled: boolean;
  formButton: string;
  formSecondButton?: { color?: any; disabled?: boolean; loading?: boolean; text: string; submit: (event: any) => void };
  formTitle: string;
  formSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
  handleClose: () => void;
  open: boolean;
}

export const UnwrappedModalForm: React.SFC<ModalFormProps> = ({
  children,
  classes,
  disabled,
  formButton,
  formSecondButton,
  formTitle,
  formSubmit,
  loading,
  handleClose,
  open
}) => {
  const xs = useMediaQuery('(max-width:680px)');
  const sm = useMediaQuery('(max-width:1070px)');

  return (
    <Dialog
      aria-labelledby={`form-modal-${formTitle}`}
      aria-describedby="form-modal-description"
      open={open}
      className="modalForm"
      onClose={handleClose}
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
            <IconButton onClick={handleClose}>
              <Close color="primary" />
            </IconButton>
          }
          title={formTitle}
        />
        <Form
          buttonText={formButton}
          disabled={disabled}
          loading={loading}
          submit={formSubmit}
          secondButton={formSecondButton}
        >
          {children}
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
