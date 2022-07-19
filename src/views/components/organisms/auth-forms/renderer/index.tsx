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
      email: '',
    };
  }

  render() {
    switch (this.state.mode) {
      case 'signup':
        return (
          <SignupForm
            email={this.state.email}
            onChangeEmail={this.handleChangeEmail}
            logginingInState={this.props.logginingInState}
            loginSuccess={this.props.loginSuccess}
            switchMode={this.switchMode}
          />
        );
      default:
        return (
          <LoginForm
            email={this.state.email}
            onChangeEmail={this.handleChangeEmail}
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

  protected handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      email: e.target.value,
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
  email: string;
};

export type AuthFormMode = 'login' | 'signup';
