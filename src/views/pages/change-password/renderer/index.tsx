import React from 'react';
import { LoadingState } from 'types/loading-state';
import { Alert, Box, Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { HeaderErrorMessages } from 'views/components/moleculars/header-error-messages';
import { changePassword, ValidationError } from 'api/auths-api/change-password';
import { ApiError } from 'api/utils/handle-axios-error';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { AdminWrapper } from 'views/components/organisms/admin-wrapper';
import { autoRefreshApiWrapper } from 'utils/auto-refresh-api-wrapper';

export class Renderer extends React.Component<unknown, State> {
  state: State = {
    password1: '',
    password2: '',
    loadingState: 'waiting',
  };

  render() {
    const disabled = this.state.loadingState === 'loading';

    const form = (
      <Box component="form" noValidate>
        <TextField
          margin="normal"
          fullWidth
          name="password1"
          label="パスワード"
          type="password"
          id="password1"
          autoComplete="current-password"
          disabled={disabled}
          helperText={this.state.formError?.password1}
          error={!!this.state.formError?.password1}
          onChange={this.handleChangeTextField('password1')}
        />
        <TextField
          margin="normal"
          fullWidth
          name="password2"
          label="パスワード（確認）"
          type="password"
          id="password2"
          autoComplete="current-password"
          disabled={disabled}
          helperText={this.state.formError?.password2}
          error={!!this.state.formError?.password2}
          onChange={this.handleChangeTextField('password2')}
        />
        <LoadingButton
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={this.handleSubmit}
          loading={this.state.loadingState === 'loading'}
          disabled={disabled}
        >
          パスワード更新
        </LoadingButton>
      </Box>
    );

    return (
      <AdminWrapper>
        <Box>
          <Stack spacing={1} sx={{ px: 1, maxWidth: '400px', mx: 'auto' }}>
            <Typography component="h1" variant="h5" align="center">
              パスワード変更
            </Typography>
            {this.renderHeaderInfo()}
            {form}
          </Stack>
        </Box>
      </AdminWrapper>
    );
  }

  protected renderHeaderInfo() {
    const { errorTitle, loadingState } = this.state;

    if (loadingState === 'success') {
      return <Alert>パスワードが変更されました。</Alert>;
    }

    if (errorTitle) {
      return (
        <Box>
          <HeaderErrorMessages errorTitle={errorTitle} />
        </Box>
      );
    }

    return null;
  }

  protected handleChangeTextField =
    (fieldType: 'password1' | 'password2') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      switch (fieldType) {
        case 'password1':
          this.setState({
            password1: e.target.value,
          });
          break;
        case 'password2':
          this.setState({
            password2: e.target.value,
          });
          break;
      }
    };

  protected handleSubmit = async () => {
    const { password1, password2 } = this.state;
    this.setState({
      loadingState: 'loading',
      errorTitle: undefined,
      formError: undefined,
    });

    try {
      await autoRefreshApiWrapper(() => changePassword(password1, password2));
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
          formError: {
            password1: apiError.data.password1,
            password2: apiError.data.password2,
          },
        });
      }

      this.setState({
        loadingState: 'error',
      });
    }
  };
}

export type State = {
  password1: string;
  password2: string;
  loadingState: LoadingState;
  errorTitle?: string;
  formError?: FormError;
};

type FormError = {
  password1?: string[];
  password2?: string[];
};
