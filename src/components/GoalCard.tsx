import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Alert, DashboardCard, GoalModal, Loading, ProgressBar } from '../components';
import { routes } from '../routes';
import { Goal, Transaction } from '../types';
import {
  calcPercent,
  formatMoney,
  getArrayTotal,
  getExpensesByAmount,
  getExpensesByCriteria,
  getExpensesByDates,
  getObjectByType
} from '../util';

interface GoalCardProps extends RouteComponentProps {
  action?: JSX.Element;
  currentTrans: Transaction[];
  goals: Goal[];
  subheader?: string;
}

const DisconnectedGoalCard: React.SFC<GoalCardProps> = ({ action, goals, currentTrans, history, subheader }) => {
  const [loading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [successMsg, setSuccessMsg] = React.useState<string>('');
  const [adding, setAdding] = React.useState<boolean>(false);
  const [editing, setEditing] = React.useState<boolean>(false);

  const calcSpent = (goal: Goal) => {
    const item = goal.criteria === 'item' ? (goal.item as Transaction).item : (goal.item as any).name;
    const expenses = getObjectByType(currentTrans, 'expense');
    const dateFilteredExps = getExpensesByDates(goal.frequency, expenses, goal.startDate, goal.endDate);
    const criteriaFilteredExps = getExpensesByCriteria(goal.criteria, item, dateFilteredExps);
    const amountFilteredExps = getExpensesByAmount(goal.amount, goal.comparator, criteriaFilteredExps);
    return getArrayTotal(amountFilteredExps);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) => {
    history.push(`${routes.dashboard}/edit/${id}`);
    setSuccessMsg(`Goal has been updated`);
    setEditing(true);
  };

  return (
    <DashboardCard
      className="gridItem"
      action={action}
      title="Goals"
      subheader={subheader}
      onClick={() => setAdding(true)}
    >
      <Alert onClose={() => setSuccess(false)} open={success} variant="success" message={successMsg} />
      <GoalModal
        title="Add Goal"
        buttonText="Add"
        open={adding}
        onClose={() => setAdding(false)}
        onSuccess={() => {
          setSuccessMsg('Goal added');
          setSuccess(true);
        }}
      />
      <GoalModal
        title="Edit Goal"
        buttonText="Edit"
        open={editing}
        onClose={() => setEditing(false)}
        onSuccess={() => setSuccess(true)}
      />
      <List className="dashboard_card">
        {loading ? (
          <Loading />
        ) : goals.length === 0 ? (
          <ListItem>No goals</ListItem>
        ) : (
          goals.map(goal => {
            const label = goal.criteria === 'item' ? (goal.item as Transaction).item : (goal.item as any).name;
            const spent = calcSpent(goal);
            const total = goal.amount;
            const percent = calcPercent(spent, total);
            return (
              <ListItem key={goal.id} button={true} onClick={e => handleClick(e, goal.id)}>
                <ProgressBar
                  percent={percent}
                  leftLabel={label}
                  rightLabel={`${formatMoney(spent, true)} ${goal.comparator} ${formatMoney(total, true)}`}
                  subLabel={goal.frequency}
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

export const GoalCard = withRouter(DisconnectedGoalCard);
