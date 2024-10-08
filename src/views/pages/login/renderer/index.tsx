import { ADMIN_LINK } from 'constant/links';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { sleep } from 'utils/sleep';
import { AuthForms } from 'views/components/organisms/auth-forms';
import { AuthFormMode } from 'views/components/organisms/auth-forms/renderer';
import { GlobalMenu } from 'views/components/organisms/global-menu';

export class Renderer extends React.Component<Props, State> {
  state: State = {
    redirect: false,
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to={ADMIN_LINK} />;
    }

    return (
      <GlobalMenu topBarPosition="static">
        <AuthForms
          initialMode={this.props.initialMode}
          onLoginSucceed={this.redirectAfterSeveralSeconds}
        />
      </GlobalMenu>
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

export type Props = {
  initialMode: AuthFormMode;
};
