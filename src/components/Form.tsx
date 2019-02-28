import * as React from 'react';

export interface FormProps {
  buttonText: string;
  className?: string;
  disabled?: boolean;
  submit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const Form: React.SFC<FormProps> = props => (
  <div className="form">
    <form className="form_form" onSubmit={props.submit}>
      <div className={`form_fields ${props.className}`}>{props.children}</div>
      <button
        className={props.disabled ? 'form_button-disabled' : 'form_button'}
        type="submit"
        disabled={props.disabled}
      >
        {props.buttonText}
      </button>
    </form>
  </div>
);
