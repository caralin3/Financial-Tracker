import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Alert, BudgetModal, DashboardCard, Loading, ProgressBar } from '../components';
import { routes } from '../routes';
import { Budget, Transaction } from '../types';
import {
  calcPercent,
  formatMoney,
  getArrayTotal,
  getObjectByType,
  monthlyBudgetFactor,
  yearlyBudgetFactor
} from '../util';

interface BudgetCardProps extends RouteComponentProps {
  action?: JSX.Element;
  budgets: Budget[];
  currentTrans: Transaction[];
  subheader: string;
}

const DisconnectedBudgetCard: React.SFC<BudgetCardProps> = ({ action, budgets, currentTrans, history, subheader }) => {
  const [loading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [successMsg, setSuccessMsg] = React.useState<string>('');
  const [adding, setAdding] = React.useState<boolean>(false);
  const [editing, setEditing] = React.useState<boolean>(false);

  const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) => {
    history.push(`${routes.dashboard}/edit/${id}`);
    setEditing(true);
  };

  const calcSpent = (categoryId: string) => {
    const expenses = getObjectByType(currentTrans, 'expense').filter(trans => trans.category.id === categoryId);
    return getArrayTotal(expenses);
  };

  const calcTotal = (budget: Budget) => {
    if (isNaN(parseInt(subheader, 10)) || subheader.includes('')) {
      return budget.amount / monthlyBudgetFactor(budget.frequency);
    }
    return budget.amount * yearlyBudgetFactor(budget.frequency);
  };

  return (
    <DashboardCard
      className="gridItem"
      action={action}
      title="Budgets"
      subheader={subheader}
      onClick={() => setAdding(true)}
    >
      <Alert onClose={() => setSuccess(false)} open={success} variant="success" message={successMsg} />
      <BudgetModal
        title="Add Budget"
        buttonText="Add"
        open={adding}
        onClose={() => setAdding(false)}
        onSuccess={() => {
          setSuccessMsg('Budget added');
          setSuccess(true);
        }}
      />
      <BudgetModal
        title="Edit Budget"
        buttonText="Edit"
        open={editing}
        onClose={() => setEditing(false)}
        onSuccess={(act: string) => {
          setSuccessMsg(`Budget ${act}`);
          setSuccess(true);
        }}
      />
      <List className="dashboard_card">
        {loading ? (
          <Loading />
        ) : budgets.length === 0 ? (
          <ListItem>No budgets</ListItem>
        ) : (
          budgets.map(budget => {
            const spent = calcSpent(budget.category.id);
            const total = calcTotal(budget);
            const percent = calcPercent(spent, total);
            return (
              <ListItem key={budget.id} button={true} onClick={e => handleClick(e, budget.id)}>
                <ProgressBar
                  percent={percent}
                  endLabel={`${percent.toFixed(0)}%`}
                  leftLabel={budget.category.name}
                  rightLabel={`${formatMoney(spent, true)} of ${formatMoney(total, true)}`}
                  textColor="primary"
                />
              </ListItem>
            );
          })
        )}
      </List>
    </DashboardCard>
  );
};

export const BudgetCard = withRouter(DisconnectedBudgetCard);
