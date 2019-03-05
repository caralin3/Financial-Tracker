import { Button } from '@material-ui/core';
import classNames from 'classnames';
import * as React from 'react';

export interface FormProps {
  buttonText: string;
  fieldsClass?: string;
  disabled?: boolean;
  submit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const Form: React.SFC<FormProps> = props => (
  <form className="form" onSubmit={props.submit}>
    {/* <div className="form_fields"> */}
    {props.children}
    {/* </div> */}
    <div
      className={classNames('form_button', {
        ['form_button-disabled']: props.disabled
      })}
    >
      <Button color="primary" type="submit" disabled={props.disabled} variant="contained">
        {props.buttonText}
      </Button>
    </div>
  </form>
);
