import { Card, CardContent, CardHeader, IconButton, Modal, Theme, withStyles } from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import * as React from 'react';
import { Form } from './';

interface ModalFormProps {
  classes: any;
  formButton: string;
  formTitle: string;
  formSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleClose: () => void;
  open: boolean;
}

export const UnwrappedModalForm: React.SFC<ModalFormProps> = props => {
  const { classes } = props;
  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={props.open}
      onClose={props.handleClose}
    >
      <Card className="modalForm">
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
        <CardContent>
          <Form buttonText={props.formButton} submit={props.formSubmit}>
            {props.children}
          </Form>
        </CardContent>
      </Card>
    </Modal>
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
