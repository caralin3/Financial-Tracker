import { Grid, TextField } from '@material-ui/core';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { requests } from '../firebase/db';
import { categoriesState } from '../store';
import { ApplicationState, Category, User } from '../types';
import { sort } from '../util';
import { Alert, Loading, ModalForm } from './';

interface RouteParams {
  id: string;
}

interface DispatchMappedProps {
  dispatch: Dispatch<any>;
}

interface StateMappedProps {
  categories: Category[];
  currentUser: User | null;
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

const DisconnectedCategoryModal: React.SFC<CategoryModalMergedProps> = props => {
  const { categories, currentUser, dispatch } = props;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>('');

  React.useEffect(() => {
    const {
      match: { params }
    } = props;
    // TODO: Load category from id
    if (params.id) {
      setLoading(true);
      if (categories.length === 0) {
        setLoading(true);
        loadCategories();
      } else {
        setLoading(false);
      }
      const [category] = categories.filter(cat => cat.id === params.id);
      console.log(params.id, category);
      if (category) {
        setName(category.name);
      }
    } else {
      if (name) {
        resetFields();
      }
    }
  }, [props.match.params.id]);

  const loadCategories = async () => {
    if (currentUser) {
      const cats = await requests.categories.getAllCategories(currentUser.id);
      dispatch(categoriesState.setCategories(sort(cats, 'desc', 'name')));
      setLoading(false);
    }
  };

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
  };

  // TODO: Handle add
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const {
      match: { params },
      onSuccess
    } = props;
    e.preventDefault();
    // setError(true);
    console.log(name);

    // TODO: Handle edit
    if (params.id) {
      const [category] = categories.filter(cat => cat.id === params.id);
      console.log(category);
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
        <div className="categoryModal_loading">
          <Loading />
        </div>
      ) : (
        <Grid className="categoryModal_grid" container={true} alignItems="center" justify="center" spacing={24}>
          <Alert onClose={() => setError(false)} open={error} variant="error" message="This is an error message!" />
          <Grid item={true} xs={12}>
            <TextField
              id="category-name"
              label="Category Name"
              autoFocus={true}
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
  currentUser: state.sessionState.currentUser
});

export const CategoryModal = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedCategoryModal) as any;
