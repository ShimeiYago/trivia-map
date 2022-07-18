import React from 'react';
import { LoadingState } from 'types/loading-state';
import { User } from 'types/user';
import { LoginForm } from '../helper-components/login-form';

export class Renderer extends React.Component<Props> {
  // constructor(props: Props) {
  //   super(props);
  //   this.state = {
  //     email: '',
  //     password: '',
  //     localLoadingState: 'waiting',
  //     showResendEmailButton: false,
  //   };
  // }

  render() {
    return (
      <LoginForm
        logginingInState={this.props.logginingInState}
        loginSuccess={this.props.loginSuccess}
      />
    );
  }
}

export type Props = {
  logginingInState: LoadingState;

  loginSuccess: (user: User) => void;
};
