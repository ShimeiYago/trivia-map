import React from 'react';
import { Box, Typography } from '@mui/material';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import { twitterAccessToken } from 'api/auths-api/twitter-access-token';
import { User } from 'types/user';

export class Renderer extends React.Component<Props> {
  componentDidMount() {
    this.getTwitterAccessToken();
  }

  render() {
    return (
      <Box sx={{ mt: 3 }}>
        <CenterSpinner />
        <Typography align="center" sx={{ mt: 3 }}>
          Twitterでログイン中
        </Typography>
      </Box>
    );
  }

  protected getTwitterAccessToken = async () => {
    try {
      const twitterAccessTokenResponse = await twitterAccessToken({
        oauthToken: this.props.oauthToken,
        oauthVerifier: this.props.oauthVerifier,
      });

      window.opener.postMessage(twitterAccessTokenResponse);
      window.close();
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
