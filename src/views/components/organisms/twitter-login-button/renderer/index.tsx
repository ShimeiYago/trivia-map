import React from 'react';
import { TWITTER_LOGIN_LINK } from 'constant/links';
import TwitterIcon from '@mui/icons-material/Twitter';
import { LoadingButton } from '@mui/lab';
import { getDomain } from 'utils/get-domain.ts';
import { TwitterAccessTokenResponse } from 'api/auths-api/twitter-access-token';
import { twitterLogin } from 'api/auths-api/twitter-login';
import { User } from 'types/user';

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
        startIcon={<TwitterIcon />}
        onClick={this.handleClick}
        loading={this.state.loading}
        fullWidth={true}
        disabled={!!this.props.userInfo}
        sx={{ textTransform: 'none' }}
      >
        Twitterでログイン
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
      this.props.throwError(500);
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
