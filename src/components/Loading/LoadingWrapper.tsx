import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Loading } from './Loading';

interface WrapperProps extends
  RouteComponentProps<any>{}

export const LoadingWrapper = (Component: any) => {
  class Wrapper extends React.Component<WrapperProps> {

    public timeout: NodeJS.Timer;
    public isLoading: boolean = true;

    public componentDidMount = () => this.setTimer();

    public componentDidUpdate = (prevProps: WrapperProps) => {
      if (this.props.location !== prevProps.location) {
        this.clearTimer();
        this.isLoading = false;
        this.setTimer();
      }
    };

    public clearTimer = () => clearTimeout(this.timeout);

    public timer = () => {this.isLoading = false; this.clearTimer()};

    public setTimer = () => (this.timeout = setTimeout(this.timer, 1500));

    public render = () => (
      <div>
        {this.isLoading ? (
          <Loading />
        ) : (
          <Component {...this.props} />
        )}
      </div>
    );
  }
  return withRouter(Wrapper);
}
