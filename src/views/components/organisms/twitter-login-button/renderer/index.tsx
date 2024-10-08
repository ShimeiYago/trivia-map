import React from 'react';
import { TWITTER_LOGIN_LINK } from 'constant/links';
import { LoadingButton } from '@mui/lab';
import { getDomain } from 'utils/get-domain.ts';
import { TwitterAccessTokenResponse } from 'api/auths-api/twitter-access-token';
import { twitterLogin } from 'api/auths-api/twitter-login';
import { User } from 'types/user';
import { ApiError } from 'api/utils/handle-axios-error';
import { MyIcon } from 'views/components/atoms/my-icon';

export class Renderer extends React.Component<Props, State> {
  state: State = {
    loading: false,
  };

  componentDidMount() {
    window.onmessage = this.handleMessage;
  }

  componentWillUnmount() {
    window.onmessage = null;
  }

  render() {
    return (
      <LoadingButton
        variant="outlined"
        startIcon={<MyIcon variant="x-twitter" />}
        onClick={this.handleClick}
        loading={this.state.loading}
        fullWidth={true}
        disabled={!!this.props.userInfo}
        sx={{ textTransform: 'none' }}
      >
        (Twitter)で簡単ログイン
      </LoadingButton>
    );
  }

  protected handleMessage = async (event: MessageEvent<TwitterAccessTokenResponse>) => {
    if (event.origin !== getDomain(window) || !event.data.accessToken) {
      return;
    }

    const twitterAccessTokenResponse = event.data;

    try {
      const loginResponse = await twitterLogin(twitterAccessTokenResponse);

      this.props.setAccessTokenExpiration(new Date(loginResponse.access_token_expiration));
      this.props.setRefreshTokenExpiration(new Date(loginResponse.refresh_token_expiration));

      this.setState({
        loading: false,
      });

      this.props.loginSuccess(loginResponse.user);
      this.props.onLoginSucceed?.();
    } catch (error) {
      const apiError = error as ApiError<unknown>;
      this.props.throwError(apiError.status);
    }
  };

  protected handleClick = async () => {
    this.setState({
      loading: true,
    });

    window.open(TWITTER_LOGIN_LINK, '_blank', 'width=640, height=480');
  };
}

export type Props = {
  userInfo?: User;
  throwError: (status: number) => void;
  loginSuccess: (user: User) => void;
  onLoginSucceed?: () => void;
  setAccessTokenExpiration: (expirationDate: Date) => void;
  setRefreshTokenExpiration: (expirationDate: Date) => void;
};

export type State = {
  loading: boolean;
};
