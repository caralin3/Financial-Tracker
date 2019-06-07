import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { requests } from '../firebase/db';
import { subcategoriesState, transactionsState } from '../store';
import { ApplicationState, Category, Subcategory, Transaction, User } from '../types';
import { getOptions } from '../util';
import { Alert, Loading, ModalForm, SelectInput } from './';

interface RouteParams {
  id: string;
}

interface DispatchMappedProps {
  addSubcategory: (sub: Subcategory) => void;
  editSubcategory: (sub: Subcategory) => void;
  editTransaction: (trans: Transaction) => void;
}

interface StateMappedProps {
  categories: Category[];
  currentUser: User | null;
  subcategories: Subcategory[];
  transactions: Transaction[];
}

interface SubcategoryModalProps {
  buttonText: string;
  onClose: () => void;
  onSuccess?: () => void;
  open: boolean;
  title: string;
}

interface SubcategoryModalMergedProps
  extends RouteComponentProps<RouteParams>,
    StateMappedProps,
    DispatchMappedProps,
    SubcategoryModalProps {}

const DisconnectedSubcategoryModal: React.SFC<SubcategoryModalMergedProps> = ({
  addSubcategory,
  buttonText,
  categories,
  currentUser,
  editSubcategory,
  editTransaction,
  history,
  location,
  match: { params },
  open,
  onClose,
  onSuccess,
  subcategories,
  title,
  transactions
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [submit, setSubmit] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>('');
  const [categoryId, setCategoryId] = React.useState<string>('');

  React.useEffect(() => {
    if (location.pathname.includes('add')) {
      if (params.id) {
        setCategoryId(params.id);
      }
    } else {
      if (params.id) {
        setLoading(true);
        const [subcategory] = subcategories.filter(sub => sub.id === params.id);
        if (subcategory) {
          setName(subcategory.name);
          setCategoryId(subcategory.category.id);
        }
        setLoading(false);
      } else {
        if (name && categoryId) {
          resetFields();
        }
      }
    }
  }, [params.id]);

  const resetFields = () => {
    setName('');
    setCategoryId('');
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
    const dups = subcategories.filter(sub => sub.name === name.trim() && sub.category.id === categoryId) || [];
    return !params.id && dups.length > 0;
  };

  const isValidCategoryId = () => categoryId.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);
    setSubmitting(true);
    if (currentUser) {
      const [category] = categories.filter(cat => cat.id === categoryId);
      const newSubcategory = {
        category,
        name: name.trim(),
        userId: currentUser.id
      };

      if (isValidName() && isValidCategoryId() && !isDuplicate()) {
        if (location.pathname.includes('edit') && params.id) {
          const edited = await requests.subcategories.updateSubcategory(
            { id: params.id, ...newSubcategory },
            editSubcategory
          );

          // Update transactions
          const trans = transactions.filter(t => t.subcategory && t.subcategory.id === params.id);
          if (trans.length > 0) {
            await trans.forEach(async tran => {
              const updatedTrans: Transaction = {
                ...tran,
                subcategory: { id: params.id, ...newSubcategory }
              };
              await requests.transactions.updateTransaction(updatedTrans, editTransaction);
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
          const added = await requests.subcategories.createSubcategory(newSubcategory, addSubcategory);
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
        <div className="subcategoryModal_loading">
          <Loading />
        </div>
      ) : (
        <Grid className="subcategoryModal_grid" container={true} alignItems="center" justify="center" spacing={24}>
          <Alert onClose={() => setError(false)} open={error} variant="error" message="This is an error message!" />
          <Grid item={true} xs={12}>
            <SelectInput
              label="Category"
              selected={categoryId}
              autoFocus={true}
              handleChange={e => {
                setCategoryId(e.target.value);
                setSubmit(false);
              }}
              helperText={submit && !isValidCategoryId() ? 'Required' : undefined}
              error={submit && !isValidCategoryId()}
              options={getOptions(categories)}
            />
          </Grid>
          <Grid item={true} xs={12}>
            <TextField
              id="subcategory-name"
              label="Subcategory Name"
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
  addSubcategory: (sub: Subcategory) => dispatch(subcategoriesState.addSubcategory(sub)),
  editSubcategory: (sub: Subcategory) => dispatch(subcategoriesState.editSubcategory(sub)),
  editTransaction: (trans: Transaction) => dispatch(transactionsState.editTransaction(trans))
});

const mapStateToProps = (state: ApplicationState) => ({
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  subcategories: state.subcategoriesState.subcategories,
  transactions: state.transactionsState.transactions
});

export const SubcategoryModal = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DisconnectedSubcategoryModal)
);
