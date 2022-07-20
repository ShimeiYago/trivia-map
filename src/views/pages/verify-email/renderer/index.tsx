import React from 'react';
import { Box, Typography } from '@mui/material';
import { LoadingState } from 'types/loading-state';
import { ValidationError, verifyEmail } from 'api/auths-api/verify-email';
import { ApiError } from 'api/utils/handle-axios-error';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { HeaderErrorMessages } from 'views/components/moleculars/header-error-messages';
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
        {this.state.errorTitle && (
          <HeaderErrorMessages
            errorTitle={this.state.errorTitle}
            errorMessages={this.state.errorMessages}
          />
        )}

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
      errorTitle: undefined,
      errorMessages: undefined,
    });

    try {
      await verifyEmail(this.props.verifyKey);
      this.setState({
        loadingState: 'success',
      });
    } catch (error) {
      const apiError = error as ApiError<ValidationError>;

      this.setState({
        errorTitle: globalAPIErrorMessage(apiError.status, 'submit'),
      });

      if (apiError.status === 400 && apiError.data) {
        // validation Error
        this.setState({
          errorMessages: apiError.data.key,
        });
      }

      this.setState({
        loadingState: 'error',
      });
    }
  };
}

export type Props = {
  verifyKey: string;
};

export type State = {
  loadingState: LoadingState;
  errorTitle?: string;
  errorMessages?: string[];
};
