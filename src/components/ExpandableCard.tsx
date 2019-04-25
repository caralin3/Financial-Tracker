import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as React from 'react';

export interface ExpandableCardProps {
  className?: string;
  expanded: boolean;
  onToggle: () => void;
  title: string;
}

export const ExpandableCard: React.SFC<ExpandableCardProps> = ({ children, className, expanded, onToggle, title }) => (
  <Card className={className} raised={true}>
    <CardHeader
      action={<IconButton onClick={onToggle}>{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>}
      title={title}
    />
    <Collapse in={expanded} timeout="auto" unmountOnExit={true}>
      <CardContent>{children}</CardContent>
    </Collapse>
  </Card>
);
