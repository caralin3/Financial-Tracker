import { Grid, TextField } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { requests } from '../firebase/db';
// import { categoriesState, subcategoriesState } from '../store';
import { ApplicationState, Budget, Category, Subcategory, Transaction, User } from '../types';
import { Alert, Loading, ModalForm } from './';

interface RouteParams {
  id: string;
}

interface DispatchMappedProps {
  dispatch: Dispatch<any>;
}

interface StateMappedProps {
  budgets: Budget[];
  categories: Category[];
  currentUser: User | null;
  subcategories: Subcategory[];
  transactions: Transaction[];
}

interface CategoryModalProps extends RouteComponentProps<RouteParams> {
  buttonText: string;
  onClose: () => void;
  onSuccess?: () => void;
  open: boolean;
  title: string;
}

interface CategoryModalMergedProps
  extends RouteComponentProps<RouteParams>,
  StateMappedProps,
  DispatchMappedProps,
  CategoryModalProps { }

const DisconnectedCategoryModal: React.SFC<CategoryModalMergedProps> = props => {
  const { categories, currentUser, dispatch, subcategories } = props;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [submit, setSubmit] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>('');

  React.useEffect(() => {
    const {
      match: { params }
    } = props;
    if (params.id) {
      setLoading(true);
      const [category] = categories.filter(cat => cat.id === params.id);
      if (category) {
        setName(category.name);
      }
      setLoading(false);
    } else {
      if (name) {
        resetFields();
      }
    }
  }, [props.match.params.id]);

  const resetFields = () => {
    setName('');
  };

  const handleClose = () => {
    const {
      history,
      match: { params },
      onClose
    } = props;
    if (params.id) {
      history.goBack();
    }
    onClose();
    resetFields();
    setSubmit(false);
  };

  // TODO: Handle unique name
  const isValidName = () => {
    return name.trim().length > 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const {
      budgets,
      match: { params },
      onSuccess,
      transactions,
    } = props;
    e.preventDefault();
    setSubmit(true);
    if (currentUser) {
      const newCategory = {
        name,
        userId: currentUser.id
      };

      // TODO: Don't edit if no change
      if (isValidName()) {
        if (params.id) {
          const edited = await requests.categories.updateCategory({ id: params.id, ...newCategory }, dispatch);
          // Update subcategories
          const subs = subcategories.filter(sub => sub.category.id === params.id);
          await subs.forEach(async sub => {
            const updatedSubcategory: Subcategory = {
              ...sub,
              category: { id: params.id, ...newCategory }
            };
            await requests.subcategories.updateSubcategory(updatedSubcategory, dispatch);
          });

          // Update transactions
          const trans = transactions.filter(t => t.category && t.category.id === params.id);
          if (trans.length > 0) {
            await trans.forEach(async tran => {
              const updatedTrans: Transaction = {
                ...tran,
                category: { id: params.id, ...newCategory }
              };
              await requests.transactions.updateTransaction(updatedTrans, dispatch);
            });
          }

          // Update budgets
          const buds = budgets.filter(b => b.category.id === params.id);
          if (buds.length > 0) {
            await buds.forEach(async bud => {
              const updatedBudget: Budget = {
                ...bud,
                category: { id: params.id, ...newCategory }
              };
              await requests.budgets.updateBudget(updatedBudget, dispatch);
            });
          }

          if (edited) {
            handleClose();
            if (onSuccess) {
              onSuccess();
            }
          } else {
            setError(true);
          }
        } else {
          const added = await requests.categories.createCategory(newCategory, dispatch);
          if (added) {
            handleClose();
            if (onSuccess) {
              onSuccess();
            }
          } else {
            setError(true);
          }
        }
      }
    }
  };

  return (
    <ModalForm
      disabled={false}
      formTitle={props.title}
      formButton={props.buttonText}
      formSubmit={handleSubmit}
      open={props.open}
      handleClose={handleClose}
    >
      {loading ? (
        <div className="categoryModal_loading">
          <Loading />
        </div>
      ) : (
          <Grid className="categoryModal_grid" container={true} alignItems="center" justify="center" spacing={24}>
            <Alert
              onClose={() => setError(false)}
              open={error}
              variant="error"
              message="Submission failed, please try again later."
            />
            <Grid item={true} xs={12}>
              <TextField
                id="category-name"
                label="Category Name"
                autoFocus={true}
                fullWidth={true}
                value={name}
                onChange={e => {
                  setName(e.target.value.trim());
                  setSubmit(false);
                }}
                helperText={submit && !isValidName() ? 'Required' : undefined}
                error={submit && !isValidName()}
                type="text"
                margin="normal"
                variant="outlined"
              />
            </Grid>
          </Grid>
        )}
    </ModalForm>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({ dispatch });

const mapStateToProps = (state: ApplicationState) => ({
  budgets: state.budgetsState.budgets,
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  subcategories: state.subcategoriesState.subcategories,
  transactions: state.transactionsState.transactions
});

export const CategoryModal = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedCategoryModal) as any;
