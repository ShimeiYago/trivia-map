import React from 'react';
import { TWITTER_CALLBACK_LINK } from 'constant/links';
import TwitterIcon from '@mui/icons-material/Twitter';
import { twitterRequestToken } from 'api/auths-api/twitter-request-token';
import { LoadingButton } from '@mui/lab';
import { DOMAIN } from 'constant';

export class Renderer extends React.Component<Props, State> {
  state: State = {
    loading: false,
  };

  render() {
    return (
      <LoadingButton
        variant="outlined"
        startIcon={<TwitterIcon />}
        onClick={this.handleClick}
        loading={this.state.loading}
        fullWidth={true}
      >
        Twitterでログイン
      </LoadingButton>
    );
  }

  protected handleClick = async () => {
    const { throwError } = this.props;

    this.setState({
      loading: true,
    });

    try {
      const twitterRequestTokenResponse = await twitterRequestToken({
        callbackUrl: `${DOMAIN}${TWITTER_CALLBACK_LINK}`,
      });
      this.props.redirectTo(twitterRequestTokenResponse.authenticateUrl);
    } catch (error: unknown) {
      throwError(500);
    }

    this.setState({
      loading: false,
    });
  };
}

export type Props = {
  redirectTo: (url: string) => void;
  throwError: (status: number) => void;
};

export type State = {
  loading: boolean;
};
