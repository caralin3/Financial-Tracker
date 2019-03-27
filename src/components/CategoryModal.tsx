import { Grid, TextField } from '@material-ui/core';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Alert, Loading, ModalForm } from '.';

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
    console.log(params.id);
    // TODO: Load category from id
  });

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
      // match: { params },
      onSuccess
    } = props;
    e.preventDefault();
    // setError(true);

    // TODO: Handle edit
    // if (params.id) {}

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
