import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { Dialog, Form } from '..';
import { db } from '../../firebase';
import { FirebaseCategory } from '../../firebase/types';
import { ActionTypes, AppState } from '../../store';
import { Category, User } from '../../types';

interface AddCategoryDialogProps {
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

interface AddCategoryDialogMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  AddCategoryDialogProps {}

interface AddCategoryDialogState {
  name: string;
}

export class DisconnectedAddCategoryDialog extends React.Component<AddCategoryDialogMergedProps, AddCategoryDialogState> {
  public readonly state: AddCategoryDialogState = {
    name: '',
  }

  public render() {
    const { name } = this.state;

    const duplicate = this.checkCategory();
    const isInvalid = !name || !!duplicate;

    return (
      <Dialog title="Add Category" toggleDialog={this.props.toggleDialog}>
        <Form buttonText="Add" disabled={isInvalid} submit={this.onSubmit}>
          {!!duplicate && 
            <h5 className="addCategoryDialog_message">
              Category name already taken
            </h5>
          }
          <div className="addCategoryDialog_section">
            <input
              className='addCategoryDialog_input'
              onChange={(e) => this.handleChange(e)}
              placeholder='Category Name'
              type='text'
              value={name}
            />
          </div>
        </Form>
      </Dialog>
    )
  }

  // Check category name not in categories list
  private checkCategory = () => {
    const { name } = this.state;
    const { categories, currentUser } = this.props;
    return categories.filter((cat: Category) => name.toUpperCase() === cat.name.toUpperCase() &&
      currentUser && cat.userId === currentUser.id)[0];
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value });
  }

  private onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const { name } = this.state;
    const { currentUser, dispatch, toggleDialog } = this.props;
    e.preventDefault();
    if (currentUser) {
      const newCategory: FirebaseCategory = {
        name,
        subcategories: [],
        userId: currentUser.id,
      }
      db.requests.categories.add(newCategory, dispatch);
    }
    toggleDialog();
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
});

export const AddCategoryDialog = connect<
  StateMappedProps,
  DispatchMappedProps,
  AddCategoryDialogProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedAddCategoryDialog);
