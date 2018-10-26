import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { CategoryItem } from '../';
import { ActionTypes, AppState } from '../../store';
import { Category, User } from '../../types';
import { sorter } from '../../utility';

interface CategoriesSectionProps {}

interface DispatchMappedProps {
  dispatch: Dispatch<ActionTypes>;
}

interface StateMappedProps {
  categories: Category[];
  currentUser: User | null;
}

interface CategoriesSectionMergedProps extends
  StateMappedProps,
  DispatchMappedProps,
  CategoriesSectionProps {}

interface CategoriesSectionState {
  showDialog: boolean;
}

export class DisconnectedCategoriesSection extends React.Component<CategoriesSectionMergedProps, CategoriesSectionState> {
  public readonly state: CategoriesSectionState = {
    showDialog: false,
  }
  
  public render () {
    const { categories } = this.props;
    const sortedCategories = sorter.sort(categories.filter((cat) => 
      this.props.currentUser && cat.userId === this.props.currentUser.id), 'desc', 'name')

    return (
      <div className="categoriesSection">
        <div className="categoriesSection_header">
          <h2>Categories</h2>
          <div className="categoriesSection_header-icons">
            <i className="fas fa-plus categoriesSection_header-add" onClick={this.toggleDialog} />
            {/* <i className="fas fa-edit categoriesSection_header-add" onClick={this.toggleDelete} /> :
            <i className="fas fa-trash-alt categoriesSection_header-delete" onClick={this.toggleDeleteDialog} /> */}
          </div>
        </div>
        <div className="categoriesSection_categories">
          {sortedCategories.map((cat) => (
            <CategoryItem key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    )
  }

  private toggleDialog = () => this.setState({ showDialog: !this.state.showDialog });
}

const mapDispatchToProps = (dispatch: Dispatch<ActionTypes>): DispatchMappedProps => ({ dispatch });

const mapStateToProps = (state: AppState) => ({
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
});

export const CategoriesSection = connect<
  StateMappedProps,
  DispatchMappedProps,
  CategoriesSectionProps
>(mapStateToProps, mapDispatchToProps)(DisconnectedCategoriesSection);
