import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Dialog, Form } from '..';
// import { db } from '../../firebase';
import { ActionTypes, AppState } from '../../store';
import { Category, User } from '../../types';
import { sorter } from '../../utility';

interface AddSubcategoryDialogProps {
  class?: string;
  toggleDialog: () => void;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  categories: Category[];
  currentUser: User | null;
}

interface AddSubcategoryDialogMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  AddSubcategoryDialogProps {}

interface AddSubcategoryDialogState {
  parentId: string;
}

export class DisconnectedAddSubcategoryDialog extends React.Component<AddSubcategoryDialogMergedProps, AddSubcategoryDialogState> {
  public readonly state: AddSubcategoryDialogState = {
    parentId: 'Select Category',
  }

  public render() {
    const { parentId } = this.state;

    const isInvalid = parentId === 'Select Category';

    return (
      <Dialog title="Add Account" toggleDialog={this.props.toggleDialog}>
        <Form buttonText="Add" disabled={isInvalid} submit={this.onSubmit}>
          
          <div className="addSubcategoryDialog_section">
            <label className="addSubcategoryDialog_input-label">Category</label>
            <select
              className='addSubcategoryDialog_input'
              onChange={(e) => this.handleChange(e)}
            >
              <option defaultValue="Select Category">Select Category</option>
              {this.categories().map((cat: Category) => (
                <option key={cat.id} value={cat.id}>{ cat.name }</option>
              ))}
            </select>
          </div>
        </Form>
      </Dialog>
    )
  }

  private categories = () => {
    const { categories, currentUser } = this.props;
    return sorter.sort(categories.filter((cat: Category) => 
      currentUser && cat.userId === currentUser.id), 'desc', 'name');
  }

  private getCategory = () => {
    const { parentId } = this.state;
    const { categories, currentUser } = this.props;
    return categories.filter((cat: Category) => parentId === cat.id &&
      currentUser && cat.userId === currentUser.id)[0];
  }

  private handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ parentId: event.target.value });
  }

  private onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const { currentUser, toggleDialog } = this.props;
    e.preventDefault();
    const parent = this.getCategory();
    if (currentUser) {
      console.log(parent);
      
      // const newAccount: FirebaseAccount = {
      //   parent,
      //   userId: currentUser.id,
      // }
      // db.requests.accounts.add(newAccount, dispatch);
    }
    toggleDialog();
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
});

export const AddSubcategoryDialog = connect<
  StateMappedProps,
  DispatchMappedProps,
  AddSubcategoryDialogProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedAddSubcategoryDialog);
