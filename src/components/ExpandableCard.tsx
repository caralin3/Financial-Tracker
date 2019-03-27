import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as React from 'react';

export interface ExpandableCardProps {
  className?: string;
  expanded: boolean;
  onToggle: () => void;
  title: string;
}

export const ExpandableCard: React.SFC<ExpandableCardProps> = props => (
  <Card className={props.className} raised={true}>
    <CardHeader
      action={
        <IconButton onClick={props.onToggle}>
          <ExpandMoreIcon />
        </IconButton>
      }
      title={props.title}
    />
    <Collapse in={props.expanded} timeout="auto" unmountOnExit={true}>
      <CardContent>{props.children}</CardContent>
    </Collapse>
  </Card>
);
