import * as React from 'react';

export interface FormProps {
  buttonText: string;
  disabled?: boolean;
  submit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const Form: React.SFC<FormProps> = (props) => (
  <div className="form">
    <form onSubmit={props.submit}>
      <fieldset>
        { props.children }
        <button className="form_button" type="submit" disabled={props.disabled}>{ props.buttonText }</button>
      </fieldset>
    </form>
  </div>
)