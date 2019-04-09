import { Grid, TextField } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { requests } from '../firebase/db';
import { categoriesState } from '../store';
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
      match: { params }
    } = props;
    if (categories.length === 0) {
      loadData();
    } else {
      setLoading(false);
    }
    // TODO: Load subcategory from id
    if (params.id) {
      const [subcategory] = subcategories.filter(sub => sub.id === params.id);
      console.log(params.id, subcategory);
      if (subcategory) {
        setName(subcategory.name);
        setCategoryId(subcategory.category.id);
      }
    } else {
      if (name && categoryId) {
        resetFields();
      }
    }
  }, [props.match.params.id]);

  const loadData = async () => {
    const cats = await requests.categories.getAllCategories(currentUser ? currentUser.id : '');
    dispatch(categoriesState.setCategories(sort(cats, 'desc', 'name')));
    setLoading(false);
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

  // TODO: Handle add
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const {
      match: { params },
      onSuccess
    } = props;
    e.preventDefault();
    const [category] = categories.filter(cat => cat.id === categoryId);
    console.log(category, name);
    // setError(true);

    // TODO: Handle edit
    if (params.id) {
      const [subcategory] = subcategories.filter(sub => sub.id === params.id);
      console.log(subcategory);
    }

    handleClose();
    if (onSuccess) {
      onSuccess();
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
