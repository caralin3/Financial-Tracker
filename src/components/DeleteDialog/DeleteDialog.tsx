import * as React from 'react';
import { Dialog } from '../';

interface DeleteDialogProps {
  confirmDelete: () => void;
  text: string;
  toggleDialog: () => void;
}

export const DeleteDialog: React.SFC<DeleteDialogProps> = (props) => (
  <Dialog class="deleteDialog" title="Confirm Delete" toggleDialog={props.toggleDialog}>
    <h3 className="deleteDialog_subtitle">{ props.text }</h3>
    <div className="deleteDialog_buttons">
      <button className="deleteDialog_button deleteDialog_button-yes" type="button" onClick={props.confirmDelete}>
        Yes
      </button>
      <button className="deleteDialog_button deleteDialog_button-no" type="button" onClick={props.toggleDialog}>
        No
      </button>
    </div>
  </Dialog>
)
