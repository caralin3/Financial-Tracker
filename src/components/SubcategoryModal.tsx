import { Grid, TextField } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { requests } from '../firebase/db';
import { categoriesState, subcategoriesState } from '../store';
import { ApplicationState, Category, Subcategory, User } from '../types';
import { getOptions, sort } from '../util';
import { Alert, Loading, ModalForm, SelectInput } from './';

interface RouteParams {
  id: string;
}

interface DispatchMappedProps {
  dispatch: Dispatch<any>;
}

interface StateMappedProps {
  categories: Category[];
  currentUser: User | null;
  subcategories: Subcategory[];
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

const DisconnectedSubcategoryModal: React.SFC<SubcategoryModalMergedProps> = props => {
  const { categories, currentUser, dispatch, subcategories } = props;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>('');
  const [categoryId, setCategoryId] = React.useState<string>('');

  React.useEffect(() => {
    const {
      match: { params },
      location
    } = props;
    setLoading(true);
    if (categories.length === 0) {
      loadCategories();
    } else {
      setLoading(false);
    }
    if (location.pathname.includes('add')) {
      if (params.id) {
        setCategoryId(params.id);
      }
    } else {
      if (params.id) {
        setLoading(true);
        if (subcategories.length === 0) {
          loadSubcategories();
        } else {
          setLoading(false);
        }
        const [subcategory] = subcategories.filter(sub => sub.id === params.id);
        if (subcategory) {
          setName(subcategory.name);
          setCategoryId(subcategory.category.id);
        }
      } else {
        if (name && categoryId) {
          resetFields();
        }
      }
    }
  }, [props.match.params.id]);

  const loadSubcategories = async () => {
    if (currentUser) {
      const subs = await requests.subcategories.getAllSubcategories(currentUser.id);
      dispatch(subcategoriesState.setSubcategories(sort(subs, 'desc', 'name')));
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    if (currentUser) {
      const cats = await requests.categories.getAllCategories(currentUser.id);
      dispatch(categoriesState.setCategories(sort(cats, 'desc', 'name')));
      setLoading(false);
    }
  };

  const resetFields = () => {
    setName('');
    setCategoryId('');
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
  };

  // TODO: Handle validations
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const {
      match: { params },
      location,
      onSuccess
    } = props;
    e.preventDefault();
    if (currentUser) {
      const [category] = categories.filter(cat => cat.id === categoryId);
      const newSubcategory = {
        category,
        name,
        userId: currentUser.id
      };

      // TODO: Don't edit if no change
      if (location.pathname.includes('edit') && params.id) {
        const edited = await requests.subcategories.updateSubcategory({ id: params.id, ...newSubcategory }, dispatch);
        if (edited) {
          handleClose();
          if (onSuccess) {
            onSuccess();
          }
        } else {
          setError(true);
        }
      } else {
        const added = await requests.subcategories.createSubcategory(newSubcategory, dispatch);
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
              handleChange={e => setCategoryId(e.target.value)}
              options={getOptions(categories)}
            />
          </Grid>
          <Grid item={true} xs={12}>
            <TextField
              id="subcategory-name"
              label="Subcategory Name"
              fullWidth={true}
              value={name}
              onChange={e => setName(e.target.value.trim())}
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
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  subcategories: state.subcategoriesState.subcategories
});

export const SubcategoryModal = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedSubcategoryModal) as any;
