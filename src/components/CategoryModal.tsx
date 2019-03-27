import { Grid, TextField } from '@material-ui/core';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { categories } from '../mock';
import { Alert, Loading, ModalForm } from './';

interface RouteParams {
  id: string;
}

interface CategoryModalProps extends RouteComponentProps<RouteParams> {
  buttonText: string;
  onClose: () => void;
  onSuccess?: () => void;
  open: boolean;
  title: string;
}

const DisconnectedCategoryModal: React.SFC<CategoryModalProps> = props => {
  const [loading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>('');

  React.useEffect(() => {
    const {
      match: { params }
    } = props;
    // TODO: Load category from id
    if (params.id) {
      const [subcategory] = categories.filter(cat => cat.id === params.id);
      console.log(params.id, subcategory);
      if (subcategory) {
        setName(subcategory.name);
      }
    }
  }, [props.match.params.id]);

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

export const CategoryModal = withRouter(DisconnectedCategoryModal);
