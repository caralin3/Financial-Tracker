import * as React from 'react';

interface DropdownProps {
  buttonText: string;
  contentClass?: string;
  options: JSX.Element[];
}

interface DropdownState {
  showOptions: boolean;
}

export class Dropdown extends React.Component<DropdownProps, DropdownState> {
  public readonly state: DropdownState = {
    showOptions: false,
  }

  public render() {
    const { buttonText, contentClass, options } = this.props;
    const { showOptions } = this.state;
    return (
      <div className="dropdown">
        <button
          className="dropdown_button"
          onClick={() => this.setState({ showOptions: !this.state.showOptions })}
          type="button"
        >
          { buttonText }
        </button>
        <div className={`dropdown_content ${contentClass} ${showOptions && 'dropdown_content-show'}`}>
          {showOptions && options.map((option: JSX.Element, index: number) =>
            <div
              className="dropdown_item" key={index}
              onClick={() => this.setState({ showOptions: !this.state.showOptions })}
            >
              { option }
            </div>
          )}
        </div>
      </div>
    )
  }
}
