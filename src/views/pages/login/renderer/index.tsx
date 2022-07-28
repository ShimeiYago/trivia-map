import React from 'react';
import { Navigate } from 'react-router-dom';
import { sleep } from 'utils/sleep';
import { AuthForms } from 'views/components/organisms/auth-forms';

export class Renderer extends React.Component<unknown, State> {
  state: State = {
    redirect: false,
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to="/admin" />;
    }

    return (
      <AuthForms
        initialMode="login"
        onLoginSucceed={this.redirectAfterSeveralSeconds}
      />
    );
  }

  protected redirectAfterSeveralSeconds = async () => {
    await sleep(1000);
    this.setState({
      redirect: true,
    });
  };
}

export type State = {
  redirect: boolean;
};
