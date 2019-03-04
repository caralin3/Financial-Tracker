import { Button } from '@material-ui/core';
import * as React from 'react';

export interface FormProps {
  buttonText: string;
  className?: string;
  disabled?: boolean;
  submit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const Form: React.SFC<FormProps> = props => (
  <form className="form" onSubmit={props.submit}>
    <div className="form_fields">{props.children}</div>
    <Button
      className={props.disabled ? 'form_button-disabled' : 'form_button'}
      type="submit"
      disabled={props.disabled}
    >
      {props.buttonText}
    </Button>
  </form>
);
