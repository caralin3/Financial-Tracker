import { Grid, TextField } from '@material-ui/core';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { categories, categoryOptions, subcategories } from '../mock';
import { Alert, Loading, ModalForm, SelectInput } from './';

interface RouteParams {
  id: string;
}

interface SubcategoryModalProps extends RouteComponentProps<RouteParams> {
  buttonText: string;
  onClose: () => void;
  onSuccess?: () => void;
  open: boolean;
  title: string;
}

const DisconnectedSubcategoryModal: React.SFC<SubcategoryModalProps> = props => {
  const [loading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>('');
  const [categoryId, setCategoryId] = React.useState<string>('');

  React.useEffect(() => {
    const {
      match: { params }
    } = props;
    // TODO: Load subcategory from id
    if (params.id) {
      const [subcategory] = subcategories.filter(sub => sub.id === params.id);
      console.log(params.id, subcategory);
    }
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
    const [category] = categories.filter(cat => cat.id === categoryId);
    console.log(category, name);
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
              handleChange={e => setCategoryId(e.target.value)}
              options={categoryOptions()}
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

export const SubcategoryModal = withRouter(DisconnectedSubcategoryModal);
