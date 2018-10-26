import * as React from 'react';

interface DialogProps {
  class?: string;
  title: string;
  toggleDialog: () => void;
}

export const Dialog: React.SFC<DialogProps> = (props) => (
  <div className={`dialog ${props.class}`}>
    <div className="dialog_content">
      <div className="dialog_header">
        <h2 className="dialog_title">{ props.title }</h2>
        <i className="dialog_close fas fa-times" onClick={props.toggleDialog} />
      </div>
      <div className="dialog_body">
        {props.children}
      </div>
    </div>
  </div>
)
