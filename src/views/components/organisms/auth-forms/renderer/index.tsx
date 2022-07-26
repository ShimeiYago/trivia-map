import { Box } from '@mui/material';
import React from 'react';
import { LoadingState } from 'types/loading-state';
import { User } from 'types/user';
import { LoginForm } from '../helper-components/login-form';
import { PasswordResetRequestForm } from '../helper-components/password-reset-request-form';
import { ResendEmailForm } from '../helper-components/resend-email-form';
import { SignupForm } from '../helper-components/signup-form';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mode: props.initialMode,
      email: '',
    };
    props.autoLogin();
  }

  render() {
    let content;
    switch (this.state.mode) {
      case 'signup':
        content = (
          <SignupForm
            email={this.state.email}
            onChangeEmail={this.handleChangeEmail}
            switchMode={this.switchMode}
          />
        );
        break;
      case 'reset-password':
        content = (
          <PasswordResetRequestForm
            email={this.state.email}
            onChangeEmail={this.handleChangeEmail}
            switchMode={this.switchMode}
          />
        );
        break;
      case 'resend-email':
        content = (
          <ResendEmailForm
            email={this.state.email}
            onChangeEmail={this.handleChangeEmail}
            switchMode={this.switchMode}
          />
        );
        break;
      default:
        content = (
          <LoginForm
            email={this.state.email}
            onChangeEmail={this.handleChangeEmail}
            autoLoggingInState={this.props.autoLoggingInState}
            loginSuccess={this.props.loginSuccess}
            switchMode={this.switchMode}
          />
        );
    }

    return (
      <Box width="340px" sx={{ mx: 'auto' }}>
        {content}
      </Box>
    );
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
  autoLoggingInState: LoadingState;
  initialMode: AuthFormMode;

  loginSuccess: (user: User) => void;
  autoLogin: () => void;
};

export type State = {
  mode: AuthFormMode;
  email: string;
};

export type AuthFormMode =
  | 'login'
  | 'signup'
  | 'reset-password'
  | 'resend-email';
