import React from 'react';
import { LoadingState } from 'types/loading-state';
import { User } from 'types/user';
import { LoginForm } from '../helper-components/login-form';
import { SignupForm } from '../helper-components/signup-form';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mode: props.initialMode,
    };
  }

  render() {
    switch (this.state.mode) {
      case 'signup':
        return (
          <SignupForm
            logginingInState={this.props.logginingInState}
            loginSuccess={this.props.loginSuccess}
            switchMode={this.switchMode}
          />
        );
      default:
        return (
          <LoginForm
            logginingInState={this.props.logginingInState}
            loginSuccess={this.props.loginSuccess}
            switchMode={this.switchMode}
          />
        );
    }
  }

  protected switchMode = (mode: AuthFormMode) => () => {
    this.setState({
      mode: mode,
    });
  };
}

export type Props = {
  logginingInState: LoadingState;
  initialMode: AuthFormMode;

  loginSuccess: (user: User) => void;
};

export type State = {
  mode: AuthFormMode;
};

export type AuthFormMode = 'login' | 'signup';
