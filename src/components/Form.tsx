import { Button, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Paper, Select, TextField } from '@material-ui/core';
import classNames from 'classnames';
import Downshift from 'downshift';
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

interface AutoTextFieldProps {
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  item: string;
  label: string;
  selected: string;
  dataList: string[];
}

export const AutoTextField: React.SFC<AutoTextFieldProps> = props => {
  const [inputValue, setInputValue] = React.useState<string>('');
  // const [selectedItem, setSelectedItem] = React.useState<string[]>([]);
  const selectedItem: string[] = [];

  const renderSuggestion = (suggestion: string, index: number, itemProps: object, highlightedIndex: number, selectedItem: string ) => {
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || '').indexOf(suggestion) > -1;
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (selectedItem.length && !inputValue.length && event.key === 'Backspace') {
      selectedItem = selectedItem.slice(0, selectedItem.length - 1);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setInputValue(event.target.value.trim());

  const handleChange = (item: string) => {
    if (selectedItem.indexOf(item) === -1) {
      selectedItem = [...selectedItem, item];
    }
    setInputValue('');
  };

  const handleDelete = (item: string) => () => {
    const selectedItem = [...selectedItem];
    selectedItem.splice(selectedItem.indexOf(item), 1);
    return { selectedItem };
  };

  const getSuggestions = (value: string) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;
  
    return inputLength === 0
      ? []
      : props.dataList.filter(suggestion => {
          const keep =
            count < 5 && suggestion.slice(0, inputLength).toLowerCase() === inputValue;
  
          if (keep) {
            count += 1;
          }
  
          return keep;
        });
  }

  const renderInput = (
    <TextField
      id="expense-item"
      label={props.label}
      fullWidth={true}
      className={props.className}
      value={props.item}
      onChange={props.onChange}
      margin="normal"
      variant="outlined"
      InputProps={{
        startAdornment: selectedItem.map((item: string) => (
          <Chip
            key={item}
            tabIndex={-1}
            label={item}
            // className={classes.chip}
            onDelete={() => handleDelete(item)}
          />
        )),
        onChange: handleInputChange,
        onKeyDown: handleKeyDown,
        placeholder: props.label,
      }}
    />
  );
  
    return (
      <MenuItem
        {...itemProps}
        key={suggestion}
        selected={isHighlighted}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
        }}
      >
        {suggestion}
      </MenuItem>
    );
  }

  return (
    <Downshift
        id="downshift-multiple"
        inputValue={inputValue}
        onChange={handleChange}
        selectedItem={selectedItem}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue: inputValue2,
          selectedItem: selectedItem2,
          highlightedIndex,
        }) => (
          <div>
            
            {isOpen ? (
              <Paper square={true}>
                {getSuggestions(inputValue2).map((suggestion: string, index: number) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion.label }),
                    highlightedIndex,
                    selectedItem: selectedItem2,
                  }),
                )}
              </Paper>
            ) : null}
          </div>
          )}
    </Downshift>
  );
};
