import React from 'react';
import { Box, Typography } from '@mui/material';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import { getDomain } from 'utils/get-domain.ts';
import { twitterRequestToken } from 'api/auths-api/twitter-request-token';
import { TWITTER_CALLBACK_LINK } from 'constant/links';
import { ApiError } from 'api/utils/handle-axios-error';

export class Renderer extends React.Component<Props> {
  componentDidMount() {
    this.goToTwitterAuthenticate();
  }

  render() {
    return (
      <Box sx={{ mt: 3 }}>
        <CenterSpinner />
        <Typography align="center" sx={{ mt: 3 }}>
          X(Twitter)でログイン中
        </Typography>
      </Box>
    );
  }

  protected goToTwitterAuthenticate = async () => {
    const domain = getDomain(window);

    try {
      const twitterRequestTokenResponse = await twitterRequestToken({
        callbackUrl: `${domain}${TWITTER_CALLBACK_LINK}`,
      });
      window.location.href = twitterRequestTokenResponse.authenticateUrl;
    } catch (error: unknown) {
      const apiError = error as ApiError<unknown>;
      this.props.throwError(apiError.status);
    }
  };
}

export type Props = {
  throwError: (status: number) => void;
};
