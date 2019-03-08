import { Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@material-ui/core';
import classNames from 'classnames';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

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

interface SelectInputProps {
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  selected: string;
  options: Array<{ label: string; value: string }>;
}

export const SelectInput: React.SFC<SelectInputProps> = props => {
  let inputLabelRef: any = null;
  const [labelWidth, setLabelWidth] = React.useState(0);

  React.useEffect(() => {
    const elem: any = ReactDOM.findDOMNode(inputLabelRef);
    if (!!elem) {
      setLabelWidth(elem.offsetWidth);
    }
  });

  return (
    <FormControl fullWidth={true} variant="outlined">
      <InputLabel ref={ref => (inputLabelRef = ref)} htmlFor={`outlined-${props.label}-select`}>
        {props.label}
      </InputLabel>
      <Select
        value={props.selected}
        onChange={props.handleChange}
        input={<OutlinedInput labelWidth={labelWidth} name={props.label} id={`outlined-${props.label}-select`} />}
      >
        {props.options.map(op => (
          <MenuItem key={op.value} value={op.value}>
            {op.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
