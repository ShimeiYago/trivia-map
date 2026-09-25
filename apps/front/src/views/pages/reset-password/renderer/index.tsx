import React from 'react';
import { LoadingState } from 'types/loading-state';
import { Alert, Box, Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { HeaderErrorMessages } from 'views/components/moleculars/header-error-messages';
import { resetPasswordConfirm, ValidationError } from 'api/auths-api/reset-password-confirm';
import { ApiError } from 'api/utils/handle-axios-error';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { PAGE_NAMES } from 'constant/page-names';
import { Image } from 'views/components/moleculars/image';
import logoImage from 'images/logo-blue.png';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { LOGIN_LINK } from 'constant/links';

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
      <Box>
        <Box sx={{ my: 3, textAlign: 'center' }}>
          <Image src={logoImage} width="200px" />
        </Box>

        <Stack spacing={1} sx={{ px: 1, py: 2, maxWidth: '400px', mx: 'auto' }}>
          <Typography component="h1" variant="h5" align="center">
            {PAGE_NAMES.passwordInitialize}
          </Typography>
          {this.renderHeaderInfo()}
          {form}
        </Stack>
      </Box>
    );
  }

  protected renderHeaderInfo() {
    const { errorTitle, errorMessages, loadingState } = this.state;

    if (loadingState === 'success') {
      return (
        <Stack spacing={0.5}>
          <Alert>パスワードが再設定されました。</Alert>
          <Link to={LOGIN_LINK}>
            <IconAndText
              text="ログインページへ"
              iconComponent={<KeyboardArrowRightIcon />}
              iconPosition="left"
              align="right"
            />
          </Link>
        </Stack>
      );
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
      await resetPasswordConfirm({ uid, token, password1, password2 });
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
            password1: apiError.data.new_password1,
            password2: apiError.data.new_password2,
          },
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
