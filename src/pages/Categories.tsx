// import { Theme, withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Dispatch } from 'redux';
import { withAuthorization } from '../auth/withAuthorization';
import { Alert, AlertDialog, CategoryModal, Layout, Loading, SubcategoryModal } from '../components';
import { requests } from '../firebase/db';
import { routes } from '../routes';
import { categoriesState, subcategoriesState } from '../store';
import { ApplicationState, Category, Subcategory, User } from '../types';
import { disableScroll } from '../util';

export interface CategoriesPageProps {
  classes: any;
}

interface DispatchMappedProps {
  removeCategory: (id: string) => void;
  removeSubcategory: (id: string) => void;
}

interface StateMappedProps {
  categories: Category[];
  subcategories: Subcategory[];
  currentUser: User | null;
}

interface CategoriesMergedProps
  extends RouteComponentProps,
    StateMappedProps,
    DispatchMappedProps,
    CategoriesPageProps {}

const DisconnectedCategoriesPage: React.SFC<CategoriesMergedProps> = ({
  categories,
  history,
  removeCategory,
  removeSubcategory,
  subcategories
}) => {
  const [loading] = React.useState<boolean>(false);
  const [openAdd, setOpenAdd] = React.useState<boolean>(false);
  const [openSubAdd, setOpenSubAdd] = React.useState<boolean>(false);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [openSubDialog, setOpenSubDialog] = React.useState<boolean>(false);
  const [openEdit, setOpenEdit] = React.useState<boolean>(false);
  const [openSubEdit, setOpenSubEdit] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [successMsg, setSuccessMsg] = React.useState<string>('');
  const [error, setError] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<string>('');

  const handleDelete = (id: string, type: string) => {
    if (type === 'category') {
      setOpenDialog(true);
      setDeleteId(id);
    } else {
      setOpenSubDialog(true);
      setDeleteId(id);
    }
  };

  const [deleteCat] = categories.filter(cat => cat.id === deleteId);
  const [deleteSub] = subcategories.filter(sub => sub.id === deleteId);

  const deleteCategory = async () => {
    const deleted = await requests.categories.deleteCategory(deleteId, removeCategory);
    const subs = subcategories.filter(sub => sub.category.id === deleteId);
    await subs.forEach(async sub => {
      await requests.subcategories.deleteSubcategory(sub.id, removeSubcategory);
    });
    setSuccessMsg(`${deleteCat.name} has been deleted`);
    if (deleted) {
      setSuccess(true);
    } else {
      setError(true);
    }
  };

  const deleteSubcategory = async () => {
    const deleted = await requests.subcategories.deleteSubcategory(deleteId, removeSubcategory);
    setSuccessMsg(`${deleteSub.name} has been deleted`);
    if (deleted) {
      setSuccess(true);
    } else {
      setError(true);
    }
  };

  const handleAdd = (e: React.MouseEvent<HTMLElement>, id?: string) => {
    if (id) {
      history.push(`${routes.categories}/add/${id}`);
      setSuccessMsg('Subcategory has been added');
      setOpenSubAdd(true);
      disableScroll();
    } else {
      setSuccessMsg(`Category has been added`);
      setOpenAdd(true);
      disableScroll();
    }
  };

  const handleEdit = (id: string, type: string) => {
    history.push(`${routes.categories}/edit/${id}`);
    if (type === 'category') {
      const [editCat] = categories.filter(cat => cat.id === id);
      setSuccessMsg(`${editCat.name} has been updated`);
      setOpenEdit(true);
      disableScroll();
    } else {
      const [editSub] = subcategories.filter(sub => sub.id === id);
      setSuccessMsg(`${editSub.name} has been updated`);
      setOpenSubEdit(true);
      disableScroll();
    }
  };

  const handleConfirm = (type: string) => {
    if (type === 'category') {
      deleteCategory();
      setOpenDialog(false);
    } else {
      deleteSubcategory();
      setOpenSubDialog(false);
    }
    setSuccess(true);
  };

  const addButton = (fullWidth: boolean) => (
    <Button color="primary" onClick={handleAdd} variant="contained" fullWidth={fullWidth}>
      Add Category
    </Button>
  );

  return (
    <Layout title="Categories" buttons={addButton(false)}>
      <div className="show-small category_add">{addButton(true)}</div>
      <AlertDialog
        cancelText="Cancel"
        confirmText="Confirm"
        description={`${deleteCat ? deleteCat.name : ''}`}
        onClose={() => setOpenDialog(false)}
        onConfirm={() => handleConfirm('category')}
        open={openDialog}
        title="Are you sure you want to delete this category?"
      />
      <AlertDialog
        cancelText="Cancel"
        confirmText="Confirm"
        description={`${deleteSub ? deleteSub.name : ''}`}
        onClose={() => setOpenSubDialog(false)}
        onConfirm={() => handleConfirm('subcategory')}
        open={openSubDialog}
        title="Are you sure you want to delete this subcategory?"
      />
      <Alert onClose={() => setSuccess(false)} open={success} variant="success" message={successMsg} />
      <Alert
        onClose={() => setError(false)}
        open={error}
        variant="error"
        message="Submission failed, please try again later."
      />
      <CategoryModal
        title="Add Category"
        buttonText="Add"
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={() => setSuccess(true)}
      />
      <SubcategoryModal
        title="Add Subcategory"
        buttonText="Add"
        open={openSubAdd}
        onClose={() => setOpenSubAdd(false)}
        onSuccess={() => setSuccess(true)}
      />
      <CategoryModal
        title="Edit Category"
        buttonText="Edit"
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSuccess={() => setSuccess(true)}
      />
      <SubcategoryModal
        title="Edit Subcategory"
        buttonText="Edit"
        open={openSubEdit}
        onClose={() => setOpenSubEdit(false)}
        onSuccess={() => setSuccess(true)}
      />
      {loading ? (
        <Loading />
      ) : (
        <Grid container={true} spacing={24}>
          {categories.map(cat => (
            <Grid item={true} xs={12} md={6} key={cat.id}>
              <ExpansionPanel className="category" elevation={8}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon className="category_expand" />}>
                  <Typography className="category_title">{cat.name}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className="category_sub">
                  <List className="category_list">
                    <ListItem className="category_actions">
                      <ListItemText primary="Category Actions" primaryTypographyProps={{ color: 'primary' }} />
                      <div>
                        <IconButton className="subcategory_button" onClick={() => handleEdit(cat.id, 'category')}>
                          <EditIcon color="primary" />
                        </IconButton>
                        <IconButton className="subcategory_button" onClick={() => handleDelete(cat.id, 'category')}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </div>
                    </ListItem>
                    {subcategories.filter(sub => sub.category.id === cat.id).length > 0 && (
                      <ListItem className="subcategory">
                        <ListItemText primary="Subcategories" primaryTypographyProps={{ color: 'primary' }} />
                      </ListItem>
                    )}
                    <List className="category_subs">
                      {subcategories
                        .filter(sub => sub.category.id === cat.id)
                        .map(sub => (
                          <ListItem className="subcategory" key={sub.id}>
                            <ListItemText primary={sub.name} />
                            <div>
                              <IconButton
                                className="subcategory_button"
                                onClick={() => handleEdit(sub.id, 'subcategory')}
                              >
                                <EditIcon color="primary" />
                              </IconButton>
                              <IconButton
                                className="subcategory_button"
                                onClick={() => handleDelete(sub.id, 'subcategory')}
                              >
                                <DeleteIcon color="error" />
                              </IconButton>
                            </div>
                          </ListItem>
                        ))}
                    </List>
                    <ListItem className="subcategory">
                      <Button color="primary" onClick={e => handleAdd(e, cat.id)} variant="contained" fullWidth={true}>
                        Add Subcategory
                      </Button>
                    </ListItem>
                  </List>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
          ))}
        </Grid>
      )}
    </Layout>
  );
};

// const styles = (theme: Theme) => ({});

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchMappedProps => ({
  removeCategory: (id: string) => dispatch(categoriesState.deleteCategory(id)),
  removeSubcategory: (id: string) => dispatch(subcategoriesState.deleteSubcategory(id))
});

const mapStateToProps = (state: ApplicationState) => ({
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  subcategories: state.subcategoriesState.subcategories
});

export const CategoriesPage = compose(
  withAuthorization(authCondition),
  // withStyles(styles as any, { withTheme: true }),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedCategoriesPage);
