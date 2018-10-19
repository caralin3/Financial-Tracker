import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

interface WrapperProps extends
  RouteComponentProps<any>{}

interface WrapperState {
  isLoading: boolean;
}

export default (LoadingWrapper: any) => {
  class Wrapper extends React.Component<WrapperProps, WrapperState> {
    public readonly state: WrapperState = { isLoading: true };

    public timeout: NodeJS.Timer;

    public componentDidMount = () => this.setTimer();

    public componentDidUpdate = (prevProps: WrapperProps) => {
      if (this.props.location !== prevProps.location) {
        this.clearTimer();
        this.setState({ isLoading: true }, () => this.setTimer());
      }
    };

    public clearTimer = () => clearTimeout(this.timeout);

    public timer = () => this.setState({ isLoading: false }, () => this.clearTimer());

    public setTimer = () => (this.timeout = setTimeout(this.timer, 1500));

    public render = () => (
      <div>
        {this.state.isLoading ? (
          <h1>Loading</h1>
        ) : (
          <LoadingWrapper {...this.props} />
        )}
      </div>
    );
  }
  return withRouter(Wrapper);
}
