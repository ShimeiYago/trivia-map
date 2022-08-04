import React from 'react';
import { Box, Typography } from '@mui/material';
import { LoadingState } from 'types/loading-state';
import { verifyEmail } from 'api/auths-api/verify-email';
import { wrapper } from '../styles';
import { LoadingButton } from '@mui/lab';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loadingState: 'waiting',
    };
  }

  render() {
    if (this.state.loadingState === 'success') {
      return (
        <Box sx={wrapper}>
          <Typography align="center">ユーザー登録が完了しました。</Typography>
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
  }

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
      this.props.throwError(500);
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
