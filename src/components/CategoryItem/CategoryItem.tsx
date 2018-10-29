import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { DeleteDialog, EditSubcategoryDialog } from '../';
import { db } from '../../firebase';
import { FirebaseSubcategory } from '../../firebase/types';
import { ActionTypes, AppState } from '../../store';
import { Category, Subcategory, User } from '../../types';
import { sorter } from '../../utility';

interface CategoryItemProps {
  category: Category;
}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  categories: Category[];
  currentUser: User | null;
  subcategories: Subcategory[];
}

interface CategoryItemMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  CategoryItemProps {}

interface CategoryItemState {
  addSubcategory: boolean;
  category: string;
  deleteCategoryId: string;
  deleteSubcategoryId: string;
  editCategory: boolean;
  movedSub: Subcategory;
  newSubcategory: string;
  showDeleteDialog: boolean;
  showEditParentDialog: boolean;
  showSubcategories: boolean;
  subcategory: string;
  subcategoryId: string;
}

export class DisconnectedCategoryItem extends React.Component<CategoryItemMergedProps, CategoryItemState> {
  public readonly state: CategoryItemState = {
    addSubcategory: false,
    category: '',
    deleteCategoryId: '',
    deleteSubcategoryId: '',
    editCategory: false,
    movedSub: {} as Subcategory,
    newSubcategory: '',
    showDeleteDialog: false,
    showEditParentDialog: false,
    showSubcategories: false,
    subcategory: '',
    subcategoryId: '',
  }

  public render () {
    const { addSubcategory, editCategory, movedSub, newSubcategory, subcategoryId } = this.state;
    const { category, currentUser, subcategories } = this.props;
    const sortedSubs = sorter.sort(subcategories.filter((sub) => currentUser && sub.userId === currentUser.id &&
      sub.parent === category.name), 'desc', 'name');

    return (
      <div className="categoryItem">
        {this.state.showDeleteDialog && 
          <DeleteDialog
            confirmDelete={this.onDelete}
            text="Are you sure you want to delete?"
            toggleDialog={this.toggleDeleteDialog}
          />
        }
        {this.state.showEditParentDialog &&
          <EditSubcategoryDialog subcategory={movedSub} toggleDialog={() => this.toggleParentDialog(movedSub)} />
        }
        <div className="categoryItem_header">
          {editCategory ?
            <input
              className="categoryItem_input"
              defaultValue={category.name}
              onBlur={this.handleBlur}
              onChange={(e) => this.handleChange(e, 'category')}
              onKeyPress={this.handleKeyPress}
              type="text"
            /> :
            <h3 className="categoryItem_header-name" onClick={this.toggleSubcategories}>{ category.name }</h3>
          }
          <div className="categoryItem_header-icons">
            <i className="fas fa-edit categoryItem_header-icon" onClick={this.toggleEditCategory} />
            <i className="fas fa-trash-alt categoryItem_header-icon" onClick={() => this.onDeleteCategory(category.id)} />
          </div>
        </div>
        <div className={this.state.showSubcategories ? 'categoryItem_subcategories': 'categoryItem_subcategories-closed'}>
          {sortedSubs.map((sub) => (
            <div className="categoryItem_subcategory" key={sub.id}>
              {subcategoryId === sub.id ?
                <input
                  className="categoryItem_input"
                  defaultValue={sub.name}
                  onBlur={this.handleBlur}
                  onChange={(e) => this.handleChange(e, 'subcategory')}
                  onKeyPress={this.handleKeyPress}
                  type="text"
                /> :
                <h4 className="categoryItem_subcategory-name" onClick={() => this.setEditSubcategory(sub.id)}>
                  { sub.name }
                </h4>
              }
              <div className="categoryItem_subcategory-icons">
                <i className="fas fa-arrows-alt-h categoryItem_subcategory-icon" onClick={() => this.toggleParentDialog(sub)} />
                <i className="fas fa-trash-alt categoryItem_subcategory-icon" onClick={() => this.onDeleteSubcategory(sub.id)} />
              </div>
            </div>
          ))}
          {addSubcategory ?
            <input
              className="categoryItem_input"
              value={newSubcategory}
              placeholder="New Subcategory"
              onBlur={this.handleNewSubBlur}
              onChange={(e) => this.handleChange(e, 'newSubcategory')}
              onKeyPress={this.handleNewSubKeyPress}
              type="text"
            /> :
            <h3 className="categoryItem_subcategory-name categoryItem_subcategory-new" onClick={this.toggleAddSubcategory}>
              Add New Subcategory
            </h3>
          }
        </div>
      </div>
    )
  }

  private toggleEditCategory = () => this.setState({ editCategory: !this.state.editCategory });

  private toggleAddSubcategory = () => this.setState({ addSubcategory: !this.state.addSubcategory });

  private setEditSubcategory = (id: string) => this.setState({ subcategoryId: id });

  private toggleParentDialog = (sub: Subcategory) => this.setState({ movedSub: sub , showEditParentDialog: !this.state.showEditParentDialog });

  private toggleSubcategories = () => this.setState({ showSubcategories: !this.state.showSubcategories });

  private toggleDeleteDialog = () => this.setState({ showDeleteDialog: !this.state.showDeleteDialog });

  // Check category name not in categories list
  private checkCategory = () => {
    const { category } = this.state;
    const { categories, currentUser } = this.props;
    return categories.filter((cat: Category) => category.toUpperCase() === cat.name.toUpperCase() &&
      currentUser && cat.userId === currentUser.id)[0];
  }

  private onDeleteCategory = (id: string) => {
    this.setState({ deleteCategoryId: id });
    this.toggleDeleteDialog();
  }

  private onDeleteSubcategory = (id: string) => {
    this.setState({ deleteSubcategoryId: id });
    this.toggleDeleteDialog();
  }

  private onDelete = () => {
    const { deleteCategoryId, deleteSubcategoryId } = this.state;
    const { category, categories, currentUser, dispatch, subcategories } = this.props;
    if (deleteCategoryId) {
      db.requests.categories.remove(deleteCategoryId, dispatch);
      // Delete subcategories with parent
      const subsToDelete: Subcategory[] = subcategories.filter((sub) => sub.parent === category.name && 
        currentUser && sub.userId === currentUser.id);
      subsToDelete.forEach((s) => {
        db.requests.subcategories.remove(s.id, dispatch);
      });
      
    } else if (deleteSubcategoryId) {
      db.requests.subcategories.remove(deleteSubcategoryId, dispatch);
      // Update parent category
      const deletedSub: Subcategory = subcategories.filter((sub) => sub.id === deleteSubcategoryId)[0];
      let updatedCat: Category = categories.filter((cat) => cat.name === deletedSub.parent &&
        currentUser && cat.userId === currentUser.id)[0];
      let newSubs = [...updatedCat.subcategories];
      newSubs = newSubs.filter((id: string) => id !== deleteSubcategoryId);
      updatedCat = {
        ...updatedCat,
        subcategories: newSubs,
      }
      db.requests.categories.edit(updatedCat, dispatch);
    }
    this.toggleDeleteDialog();
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, propertyName: string) => {
    this.setState({
      [propertyName]: event.target.value as string | boolean | Subcategory,
    } as Pick<CategoryItemState, keyof CategoryItemState>)
  }

  // Listen for enter key
  private handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.charCode === 13) {
      this.handleBlur();
    }
  }

  private handleNewSubKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.charCode === 13) {
      this.handleNewSubBlur();
    }
  }

  private handleNewSubBlur = () => {
    const { newSubcategory } = this.state;
    const { category, currentUser, dispatch } = this.props;
    if (currentUser && newSubcategory) {
      const newSub: FirebaseSubcategory = {
        name: newSubcategory,
        parent: category.name,
        userId: currentUser.id,
      }
      db.requests.subcategories.add(newSub, dispatch);
    }
    this.setState({ addSubcategory: false });
  }

  private handleBlur = () => {
    const { category, subcategoryId, subcategory } = this.state;
    const { categories, currentUser, dispatch, subcategories } = this.props;
    
    const currentCategory = categories.filter((cat) => cat.id === this.props.category.id)[0];
    const currentSubcategory = subcategories.filter((sub) => sub.id === subcategoryId)[0];
    const duplicate = this.checkCategory();

    if (category && category !== currentCategory.name && !duplicate) {
      const updatedCategory: Category = {
        ...currentCategory,
        name: category,
      }
      db.requests.categories.edit(updatedCategory, dispatch);
      // Update parent category for subcategories
      const updatedSubs: Subcategory[] = subcategories.filter((sub) => sub.parent === currentCategory.name &&
        currentUser && sub.userId === currentUser.id);
      updatedSubs.forEach((subcat) => {
        const updatedSub: Subcategory = {
          ...subcat,
          parent: category,
        }
        db.requests.subcategories.edit(updatedSub, dispatch);
      })

    } else if (subcategory && subcategory !== currentSubcategory.name) {
      const updatedSub: Subcategory = {
        ...currentSubcategory,
        name: subcategory,
      }
      db.requests.subcategories.edit(updatedSub, dispatch);
    }
    this.setState({
      category: '',
      editCategory: false,
      subcategory: '',
      subcategoryId: '',
    });
  }
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  subcategories: state.subcategoriesState.subcategories,
});

export const CategoryItem = connect<
  StateMappedProps,
  DispatchMappedProps,
  CategoryItemProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedCategoryItem);
