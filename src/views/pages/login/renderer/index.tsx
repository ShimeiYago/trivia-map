import { ADMIN_LINK } from 'constant/links';
import { PAGE_NAMES } from 'constant/page-names';
import { HeadAppender } from 'helper-components/head-appender';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { sleep } from 'utils/sleep';
import { AuthForms } from 'views/components/organisms/auth-forms';
import { GlobalMenu } from 'views/components/organisms/global-menu';

export class Renderer extends React.Component<unknown, State> {
  state: State = {
    redirect: false,
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to={ADMIN_LINK} />;
    }

    return (
      <HeadAppender title={pageTitleGenerator(PAGE_NAMES.login)}>
        <GlobalMenu topBarPosition="static">
          <AuthForms initialMode="login" onLoginSucceed={this.redirectAfterSeveralSeconds} />
        </GlobalMenu>
      </HeadAppender>
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
