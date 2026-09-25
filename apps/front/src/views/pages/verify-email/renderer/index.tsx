import React from 'react';
import { Alert, Box, Typography } from '@mui/material';
import { LoadingState } from 'types/loading-state';
import { verifyEmail } from 'api/auths-api/verify-email';
import { wrapper } from '../styles';
import { LoadingButton } from '@mui/lab';
import { Image } from 'views/components/moleculars/image';
import logoImage from 'images/logo-blue.png';
import { MAP_PAGE_LINK } from 'constant/links';
import { ApiError } from 'api/utils/handle-axios-error';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loadingState: 'waiting',
    };
  }

  render() {
    return (
      <>
        <Box sx={{ my: 3, textAlign: 'center' }}>
          <a href={MAP_PAGE_LINK}>
            <Image src={logoImage} width="200px" />
          </a>
        </Box>
        {this.renderContent()}
      </>
    );
  }

  protected renderContent = () => {
    if (this.state.loadingState === 'success') {
      return (
        <Box sx={wrapper}>
          <Alert severity="success" sx={{ mb: 3 }}>
            ユーザー登録が完了しました。
          </Alert>
          <Typography align="center">
            元々のページに戻り、登録した内容でログインしてください。
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={wrapper}>
        <Typography align="center" sx={{ mb: 2 }}>
          下のボタンをクリックして登録を完了させてください。
        </Typography>
        <Typography align="center">
          <LoadingButton
            variant="outlined"
            onClick={this.handleClickVerify}
            loading={this.state.loadingState === 'loading'}
          >
            アカウント有効化
          </LoadingButton>
        </Typography>
      </Box>
    );
  };

  protected handleClickVerify = async () => {
    this.setState({
      loadingState: 'loading',
    });

    try {
      await verifyEmail(this.props.verifyKey);
      this.setState({
        loadingState: 'success',
      });
    } catch (error) {
      const apiError = error as ApiError<unknown>;
      this.props.throwError(apiError.status);
    }
  };
}

export type Props = {
  verifyKey: string;
  throwError: (status: number) => void;
};

export type State = {
  loadingState: LoadingState;
};
