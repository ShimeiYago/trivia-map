import React from 'react';
import { LoadingState } from 'types/loading-state';
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { HeaderErrorMessages } from 'views/components/moleculars/header-error-messages';
import { AuthFormMode } from '../../renderer';
import { resetPassword, ValidationError } from 'api/auths-api/reset-password';
import { ApiError } from 'api/utils/handle-axios-error';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';

export class PasswordResetRequestForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      localLoadingState: 'waiting',
    };
  }

  render() {
    const disabled = this.state.localLoadingState === 'loading';

    return (
      <Container component="main" maxWidth="xs">
        <Stack spacing={1} sx={{ px: 1, py: 2 }}>
          <Typography component="h1" variant="h5" align="center">
            パスワード再設定
          </Typography>
          <Typography component="p" variant="subtitle2">
            パスワードを忘れた場合はこちらでパスワードの再設定を行なってください。
          </Typography>
          {this.renderHeaderInfo()}
          <Box component="form" noValidate>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="メールアドレス"
              name="email"
              autoComplete="email"
              autoFocus
              disabled={disabled}
              helperText={this.state.formError?.email}
              error={!!this.state.formError?.email}
              onChange={this.props.onChangeEmail}
            />
            <LoadingButton
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={this.handleSubmit}
              loading={this.state.localLoadingState === 'loading'}
              disabled={disabled}
            >
              再設定用のメールを送信する
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                <Button variant="text" onClick={this.props.switchMode('login')}>
                  ログイン
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="text"
                  onClick={this.props.switchMode('signup')}
                >
                  アカウント作成
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Container>
    );
  }

  protected renderHeaderInfo() {
    const { errorTitle, errorMessages, localLoadingState } = this.state;

    if (localLoadingState === 'success') {
      return (
        <Alert>
          入力されたメールアドレス宛に再設定用メールを送信しました。メールの内容に従ってパスワードを再設定してください。
        </Alert>
      );
    }

    if (errorTitle) {
      return (
        <Box>
          <HeaderErrorMessages
            errorTitle={errorTitle}
            errorMessages={errorMessages}
          />
        </Box>
      );
    }

    return null;
  }

  protected handleSubmit = async () => {
    this.setState({
      localLoadingState: 'loading',
      errorTitle: undefined,
      errorMessages: undefined,
    });

    try {
      await resetPassword(this.props.email);
      this.setState({
        localLoadingState: 'success',
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
            email: apiError.data.email,
          },
          errorMessages: apiError.data.non_field_errors,
        });
      }

      this.setState({
        localLoadingState: 'error',
      });
    }
  };
}

export type Props = {
  email: string;

  onChangeEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  switchMode: (mode: AuthFormMode) => () => void;
};

export type State = {
  localLoadingState: LoadingState;
  errorTitle?: string;
  errorMessages?: string[];
  formError?: FormError;
};

type FormError = {
  email?: string[];
};
