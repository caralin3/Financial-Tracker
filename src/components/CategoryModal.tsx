import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { requests } from '../firebase/db';
import { budgetsState, categoriesState, subcategoriesState, transactionsState } from '../store';
import { ApplicationState, Budget, Category, Subcategory, Transaction, User } from '../types';
import { Alert, Loading, ModalForm } from './';

interface RouteParams {
  id: string;
}

interface DispatchMappedProps {
  addCategory: (cat: Category) => void;
  editBudget: (bud: Budget) => void;
  editCategory: (cat: Category) => void;
  editSubcategory: (sub: Subcategory) => void;
  editTransaction: (trans: Transaction) => void;
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
    CategoryModalProps {}

const DisconnectedCategoryModal: React.SFC<CategoryModalMergedProps> = ({
  addCategory,
  budgets,
  buttonText,
  categories,
  currentUser,
  editBudget,
  editCategory,
  editSubcategory,
  editTransaction,
  history,
  match: { params },
  onClose,
  onSuccess,
  open,
  subcategories,
  title,
  transactions
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [submit, setSubmit] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>('');

  React.useEffect(() => {
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
  }, [params.id]);

  const resetFields = () => {
    setName('');
  };

  const handleClose = () => {
    if (params.id) {
      history.goBack();
    }
    onClose();
    resetFields();
    setSubmit(false);
    setSubmitting(false);
  };

  const isValidName = () => name.trim().length > 0;

  const isDuplicate = () => {
    const dups = categories.filter(cat => cat.name === name.trim()) || [];
    return !params.id && dups.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);
    setSubmitting(true);
    if (currentUser) {
      const newCategory = {
        name: name.trim(),
        userId: currentUser.id
      };

      if (isValidName() && !isDuplicate()) {
        if (params.id) {
          const edited = await requests.categories.updateCategory({ id: params.id, ...newCategory }, editCategory);
          // Update subcategories
          const subs = subcategories.filter(sub => sub.category.id === params.id);
          await subs.forEach(async sub => {
            const updatedSubcategory: Subcategory = {
              ...sub,
              category: { id: params.id, ...newCategory }
            };
            await requests.subcategories.updateSubcategory(updatedSubcategory, editSubcategory);
          });

          // Update transactions
          const trans = transactions.filter(t => t.category && t.category.id === params.id);
          if (trans.length > 0) {
            await trans.forEach(async tran => {
              const updatedTrans: Transaction = {
                ...tran,
                category: { id: params.id, ...newCategory }
              };
              await requests.transactions.updateTransaction(updatedTrans, editTransaction);
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
              await requests.budgets.updateBudget(updatedBudget, editBudget);
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
          const added = await requests.categories.createCategory(newCategory, addCategory);
          if (added) {
            handleClose();
            if (onSuccess) {
              onSuccess();
            }
          } else {
            setError(true);
          }
        }
      } else {
        setSubmitting(false);
      }
    }
  };

  return (
    <ModalForm
      disabled={false}
      formTitle={title}
      formButton={buttonText}
      formSubmit={handleSubmit}
      loading={submitting}
      open={open}
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
                setName(e.target.value);
                setSubmit(false);
              }}
              helperText={
                submit ? (!isValidName() ? 'Required' : isDuplicate() ? 'Name is already taken' : undefined) : undefined
              }
              error={submit && (!isValidName() || isDuplicate())}
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

const mapDispatchToProps = (dispatch: Dispatch): DispatchMappedProps => ({
  addCategory: (cat: Category) => dispatch(categoriesState.addCategory(cat)),
  editBudget: (bud: Budget) => dispatch(budgetsState.editBudget(bud)),
  editCategory: (cat: Category) => dispatch(categoriesState.editCategory(cat)),
  editSubcategory: (sub: Subcategory) => dispatch(subcategoriesState.editSubcategory(sub)),
  editTransaction: (trans: Transaction) => dispatch(transactionsState.editTransaction(trans))
});

const mapStateToProps = (state: ApplicationState) => ({
  budgets: state.budgetsState.budgets,
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  subcategories: state.subcategoriesState.subcategories,
  transactions: state.transactionsState.transactions
});

export const CategoryModal = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DisconnectedCategoryModal)
);
