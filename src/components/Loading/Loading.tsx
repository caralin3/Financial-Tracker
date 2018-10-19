import * as React from 'react';

export const Loading: React.SFC = () => (
  <div className="loading">
    <div className="loading_flipper">
      <div className="loading_front fa-spin fa-stack fa-2x">
        <i className=" loading_circle fas fa-circle fa-stack-2x" />
        <i className=" loading_icon fa-stack-1x fas fa-university " />
      </div>
      {/* <div className="loading_back fa-stack fa-2x">
        <i className=" loading_circle fas fa-circle fa-stack-2x" />
        <i className=" loading_icon fa-stack-1x fas fa-university " />
      </div> */}
    </div>
  </div>
)
