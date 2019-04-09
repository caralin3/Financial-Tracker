import { Theme, withStyles } from '@material-ui/core';
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
import { sort } from '../util';

export interface CategoriesPageProps {
  classes: any;
}

interface DispatchMappedProps {
  dispatch: Dispatch<any>;
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

const DisconnectedCategoriesPage: React.SFC<CategoriesMergedProps> = props => {
  const { categories, currentUser, dispatch, subcategories } = props;
  const [loading, setLoading] = React.useState<boolean>(true);
  const [openAdd, setOpenAdd] = React.useState<boolean>(false);
  const [openSubAdd, setOpenSubAdd] = React.useState<boolean>(false);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [openSubDialog, setOpenSubDialog] = React.useState<boolean>(false);
  const [openEdit, setOpenEdit] = React.useState<boolean>(false);
  const [openSubEdit, setOpenSubEdit] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<string>('');

  React.useEffect(() => {
    if (categories.length === 0 || subcategories.length === 0) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadData = async () => {
    const cats = await requests.categories.getAllCategories(currentUser ? currentUser.id : '');
    const subs = await requests.subcategories.getAllSubcategories(currentUser ? currentUser.id : '');
    dispatch(categoriesState.setCategories(sort(cats, 'desc', 'name')));
    dispatch(subcategoriesState.setSubcategories(sort(subs, 'desc', 'name')));
    setLoading(false);
  };

  const handleDelete = (id: string, type: string) => {
    if (type === 'category') {
      setOpenDialog(true);
      setDeleteId(id);
    } else {
      setOpenSubDialog(true);
      setDeleteId(id);
    }
  };

  // TODO: Handle delete
  const deleteCategory = () => null;

  const deleteSubcategory = () => null;

  const handleEdit = (id: string, type: string) => {
    const { history } = props;
    console.log(id, type);
    history.push(`${routes.categories}/edit/${id}`);
    if (type === 'category') {
      setOpenEdit(true);
    } else {
      setOpenSubEdit(true);
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
    <Button color="primary" onClick={() => setOpenAdd(!openAdd)} variant="contained" fullWidth={fullWidth}>
      Add Category
    </Button>
  );

  return (
    <Layout title="Categories" buttons={addButton(false)}>
      <div className="show-small category_add">{addButton(true)}</div>
      <AlertDialog
        cancelText="Cancel"
        confirmText="Confirm"
        description={`Deleting ${deleteId}`}
        onClose={() => setOpenDialog(false)}
        onConfirm={() => handleConfirm('category')}
        open={openDialog}
        title="Are you sure you want to delete this category?"
      />
      <AlertDialog
        cancelText="Cancel"
        confirmText="Confirm"
        description={`Deleting ${deleteId}`}
        onClose={() => setOpenSubDialog(false)}
        onConfirm={() => handleConfirm('subcategory')}
        open={openSubDialog}
        title="Are you sure you want to delete this subcategory?"
      />
      <Alert onClose={() => setSuccess(false)} open={success} variant="success" message="This is a success message!" />
      <Alert onClose={() => setError(false)} open={error} variant="error" message="This is an error message!" />
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
                      <Button
                        color="primary"
                        onClick={() => setOpenSubAdd(!openSubAdd)}
                        variant="contained"
                        fullWidth={true}
                      >
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

const styles = (theme: Theme) => ({});

const authCondition = (authUser: any) => !!authUser;

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({ dispatch });

const mapStateToProps = (state: ApplicationState) => ({
  categories: state.categoriesState.categories,
  currentUser: state.sessionState.currentUser,
  subcategories: state.subcategoriesState.subcategories
});

export const CategoriesPage = compose(
  withAuthorization(authCondition),
  withStyles(styles as any, { withTheme: true }),
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DisconnectedCategoriesPage);
