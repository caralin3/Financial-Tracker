import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Alert, DashboardCard, GoalModal, Loading } from '../components';
import { routes } from '../routes';
import { Goal, Transaction } from '../types';
import {
  // calcPercent,
  comparatorLabels,
  formatMoney,
  getArrayTotal,
  // getExpensesByAmount,
  getExpensesByCriteria,
  getObjectByType
} from '../util';

interface GoalCardProps extends RouteComponentProps {
  action?: JSX.Element;
  currentTrans: Transaction[];
  goals: Goal[];
  subheader: string;
}

const DisconnectedGoalCard: React.SFC<GoalCardProps> = ({ action, goals, currentTrans, history, subheader }) => {
  const [loading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [successMsg, setSuccessMsg] = React.useState<string>('');
  const [adding, setAdding] = React.useState<boolean>(false);
  const [editing, setEditing] = React.useState<boolean>(false);

  const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) => {
    history.push(`${routes.dashboard}/edit/${id}`);
    setEditing(true);
  };

  const calcSpent = (goal: Goal, item: string) => {
    const expenses = getObjectByType(currentTrans, 'expense');
    const criteriaFilteredExps = getExpensesByCriteria(goal.criteria, item, expenses);
    return getArrayTotal(criteriaFilteredExps);
  };

  const getStatus = (goal: Goal, spent: number) => {
    const amount = goal.amount; // TODO: Handle subheader
    switch (goal.comparator) {
      case '<':
        if (spent < amount) {
          return 'Reached';
        }
        if (spent === amount) {
          return 'Equal';
        }
        return `${formatMoney(spent - amount)} over`;
      case '<=':
        if (spent <= amount) {
          return 'Reached';
        }
        return `${formatMoney(spent - amount)} over`;
      case '===':
        if (spent < amount) {
          return `${formatMoney(amount - spent)} under`;
        }
        if (spent > amount) {
          return `${formatMoney(spent - amount)} over`;
        }
        return 'Reached';
      case '>':
        if (spent > amount) {
          return 'Reached';
        }
        if (spent === amount) {
          return 'Equal';
        }
        return `${formatMoney(amount - spent)} under`;
      case '>=':
        if (spent >= amount) {
          return 'Reached';
        }
        return `${formatMoney(spent - amount)} over`;
      default:
        return 'On Track';
    }
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
      {/* TODO: Fix edit? */}
      <GoalModal
        title="Edit Goal"
        buttonText="Edit"
        open={editing}
        onClose={() => setEditing(false)}
        onSuccess={(act: string) => {
          setSuccessMsg(`Goal ${act}`);
          setSuccess(true);
        }}
      />
      <List className="dashboard_card">
        {loading ? (
          <Loading />
        ) : goals.length === 0 ? (
          <ListItem>No goals</ListItem>
        ) : (
          goals.map(goal => {
            const item = goal.criteria === 'item' ? (goal.item as Transaction).item : (goal.item as any).name;
            const spent = calcSpent(goal, item);
            const status = getStatus(goal, spent);
            // const total = goal.amount;
            // const percent = calcPercent(spent, total);
            return (
              <ListItem className="goalCard_col" key={goal.id} button={true} onClick={e => handleClick(e, goal.id)}>
                <span className="goalCard_spend">
                  Spend {comparatorLabels[goal.comparator]} <strong>{formatMoney(goal.amount, true)}</strong> on {item}{' '}
                  {goal.frequency}
                </span>
                <div className="goalCard_row">
                  <strong>Spent: {formatMoney(spent)}</strong>
                  <strong>Status: {status}</strong>
                </div>
                {/* <ProgressBar
                  percent={percent}
                  leftLabel={label}
                  rightLabel={`${formatMoney(spent, true)} ${goal.comparator} ${formatMoney(total, true)}`}
                  subLabel={goal.frequency}
                  textColor="primary"
                /> */}
              </ListItem>
            );
          })
        )}
      </List>
    </DashboardCard>
  );
};

export const GoalCard = withRouter(DisconnectedGoalCard);
