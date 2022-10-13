import React from 'react';
import { Box, Typography } from '@mui/material';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import { twitterAccessToken } from 'api/auths-api/twitter-access-token';
import { twitterLogin } from 'api/auths-api/twitter-login';
import { User } from 'types/user';
import { MAP_PAGE_LINK } from 'constant/links';
import { Navigate } from 'react-router-dom';

export class Renderer extends React.Component<Props, State> {
  state: State = {
    redirect: false,
  };

  componentDidMount() {
    this.twitterLogin();
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={MAP_PAGE_LINK} />;
    }

    return (
      <Box sx={{ mt: 3 }}>
        <CenterSpinner />
        <Typography align="center" sx={{ mt: 3 }}>
          Twitterでログイン中
        </Typography>
      </Box>
    );
  }

  protected twitterLogin = async () => {
    try {
      const twitterAccessTokenResponse = await twitterAccessToken({
        oauthToken: this.props.oauthToken,
        oauthVerifier: this.props.oauthVerifier,
      });

      const loginResponse = await twitterLogin(twitterAccessTokenResponse);

      this.props.loginSuccess(loginResponse.user);

      this.props.setAccessTokenExpiration(new Date(loginResponse.access_token_expiration));
      this.props.setRefreshTokenExpiration(new Date(loginResponse.refresh_token_expiration));

      this.setState({
        redirect: true,
      });
    } catch (e: unknown) {
      this.props.throwError(500);
    }
  };
}

export type Props = {
  oauthToken: string;
  oauthVerifier: string;
  loginSuccess: (user: User) => void;
  throwError: (status: number) => void;
  setAccessTokenExpiration: (expirationDate: Date) => void;
  setRefreshTokenExpiration: (expirationDate: Date) => void;
};

export type State = {
  redirect: boolean;
};
