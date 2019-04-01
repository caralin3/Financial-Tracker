import { Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@material-ui/core';
import classNames from 'classnames';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Option } from '../types';

export interface FormProps {
  buttonText: string;
  fieldsClass?: string;
  disabled?: boolean;
  submit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const Form: React.SFC<FormProps> = props => (
  <form className="form" onSubmit={props.submit}>
    {props.children}
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
  autoFocus?: boolean;
  className?: string;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  selected: any;
  options: Option[];
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
    <FormControl className={props.className} fullWidth={true} variant="outlined">
      <InputLabel ref={ref => (inputLabelRef = ref)} htmlFor={`outlined-${props.label}-select`}>
        {props.label}
      </InputLabel>
      <Select
        autoFocus={props.autoFocus}
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

interface AutoTextFieldProps {
  autoFocus?: boolean;
  className?: string;
  dataList: string[];
  id: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

export const AutoTextField: React.SFC<AutoTextFieldProps> = props => {
  const { className, dataList, id, label, onChange, value } = props;

  const getSuggestions = (val: string) => {
    const inputValue = val.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
      ? []
      : dataList.filter(suggestion => {
          const keep = count < 5 && suggestion.slice(0, inputLength).toLowerCase() === inputValue;

          if (keep) {
            count += 1;
          }

          return keep;
        });
  };

  return (
    <div>
      <TextField
        id={id}
        autoFocus={props.autoFocus}
        label={label}
        fullWidth={true}
        className={className}
        value={value}
        onChange={onChange}
        margin="normal"
        variant="outlined"
        inputProps={{
          list: 'items'
        }}
      />
      <datalist id="items">
        {getSuggestions(value).map((item: string) => (
          <option aria-selected={false} key={item} value={item}>
            {item}
          </option>
        ))}
      </datalist>
    </div>
  );
};
