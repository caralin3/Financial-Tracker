import * as React from 'react';

export const Loading: React.SFC = () => (
  <div className="loading">
    <span className="loading_front fa-stack fa-2x">
      <i className=" loading_circle fas fa-circle fa-stack-2x" />
      <i className=" loading_icon fa-stack-1x fas fa-university " />
    </span>
    {/* <span className="loading_back fa-stack fa-2x">
      <i className=" loading_circle fas fa-circle fa-stack-2x" />
      <i className=" loading_icon fa-stack-1x fas fa-university " />
    </span> */}
  </div>
)
