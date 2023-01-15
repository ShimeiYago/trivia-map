import React from 'react';
import { TWITTER_CALLBACK_LINK } from 'constant/links';
import TwitterIcon from '@mui/icons-material/Twitter';
import { twitterRequestToken } from 'api/auths-api/twitter-request-token';
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
    window.addEventListener('message', this.handleMessage);
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
    const twitterAccessTokenResponse = event.data;

    try {
      const loginResponse = await twitterLogin(twitterAccessTokenResponse);

      this.props.loginSuccess(loginResponse.user);

      this.props.setAccessTokenExpiration(new Date(loginResponse.access_token_expiration));
      this.props.setRefreshTokenExpiration(new Date(loginResponse.refresh_token_expiration));

      this.setState({
        loading: false,
      });
    } catch (error) {
      this.props.throwError(500);
    }
  };

  protected handleClick = async () => {
    this.setState({
      loading: true,
    });

    const domain = getDomain(window);

    try {
      const twitterRequestTokenResponse = await twitterRequestToken({
        callbackUrl: `${domain}${TWITTER_CALLBACK_LINK}`,
      });
      window.open(twitterRequestTokenResponse.authenticateUrl, '_blank', 'width=640, height=480');
    } catch (error: unknown) {
      this.props.throwError(500);
    }
  };
}

export type Props = {
  userInfo?: User;
  throwError: (status: number) => void;
  loginSuccess: (user: User) => void;
  setAccessTokenExpiration: (expirationDate: Date) => void;
  setRefreshTokenExpiration: (expirationDate: Date) => void;
};

export type State = {
  loading: boolean;
};
