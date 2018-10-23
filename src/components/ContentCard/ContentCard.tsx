import * as React from 'react';

interface ContentCardProps {
  class?: string;
}

export const ContentCard: React.SFC<ContentCardProps> = (props) => (
  <div className={`contentCard ${props.class}`}>
    {props.children}
  </div>
)
