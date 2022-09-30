import React from 'react';
import { LoadingState } from 'types/loading-state';
import { Alert, Box, Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { HeaderErrorMessages } from 'views/components/moleculars/header-error-messages';
import { resetPasswordConfirm, ValidationError } from 'api/auths-api/reset-password-confirm';
import { ApiError } from 'api/utils/handle-axios-error';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { PAGE_NAMES } from 'constant/page-names';
import { HeadAppender } from 'helper-components/head-appender';
import { pageTitleGenerator } from 'utils/page-title-generator';

export class Renderer extends React.Component<Props, State> {
  state: State = {
    password1: '',
    password2: '',
    loadingState: 'waiting',
  };

  render() {
    const disabled = this.state.loadingState === 'loading' || this.state.loadingState === 'success';

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
          required
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
          required
        />
        <LoadingButton
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={this.handleSubmit}
          loading={this.state.loadingState === 'loading'}
          disabled={disabled}
        >
          再設定する
        </LoadingButton>
      </Box>
    );

    return (
      <HeadAppender title={pageTitleGenerator(PAGE_NAMES.passwordInitialize)}>
        <Box>
          <Stack spacing={1} sx={{ px: 1, py: 2, maxWidth: '400px', mx: 'auto' }}>
            <Typography component="h1" variant="h5" align="center">
              {PAGE_NAMES.passwordInitialize}
            </Typography>
            {this.renderHeaderInfo()}
            {form}
          </Stack>
        </Box>
      </HeadAppender>
    );
  }

  protected renderHeaderInfo() {
    const { errorTitle, errorMessages, loadingState } = this.state;

    if (loadingState === 'success') {
      return <Alert>パスワードが設定されました。</Alert>;
    }

    if (errorTitle) {
      return (
        <Box>
          <HeaderErrorMessages errorTitle={errorTitle} errorMessages={errorMessages} />
        </Box>
      );
    }

    return null;
  }

  protected handleChangeTextField =
    (fieldType: 'password1' | 'password2') => (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const { uid, token } = this.props;
    const { password1, password2 } = this.state;
    this.setState({
      loadingState: 'loading',
      errorTitle: undefined,
      errorMessages: undefined,
      formError: undefined,
    });

    try {
      await resetPasswordConfirm(uid, token, password1, password2);
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
          errorMessages: [...(apiError.data.uid ?? []), ...(apiError.data.token ?? [])],
        });
      }

      this.setState({
        loadingState: 'error',
      });
    }
  };
}

export type Props = {
  uid: string;
  token: string;
};

export type State = {
  password1: string;
  password2: string;
  loadingState: LoadingState;
  errorTitle?: string;
  errorMessages?: string[];
  formError?: FormError;
};

type FormError = {
  password1?: string[];
  password2?: string[];
};
