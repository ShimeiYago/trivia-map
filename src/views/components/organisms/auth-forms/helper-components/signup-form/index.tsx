import React from 'react';
import { LoadingState } from 'types/loading-state';
import {
  Alert,
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { HeaderErrorMessages } from 'views/components/moleculars/header-error-messages';
import { AuthFormMode } from '../../renderer';
import { registration, ValidationError } from 'api/auths-api/registration';
import { ApiError } from 'api/utils/handle-axios-error';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';

export class SignupForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      password1: '',
      password2: '',
      nickname: '',
      localLoadingState: 'waiting',
    };
  }

  render() {
    const disabled = this.state.localLoadingState === 'loading';

    return (
      <Container component="main" maxWidth="xs">
        <Stack spacing={1} sx={{ px: 1, py: 2 }}>
          <Typography component="h1" variant="h5" align="center">
            アカウント作成
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
              value={this.props.email}
            />
            <TextField
              margin="normal"
              fullWidth
              id="nickname"
              label="名前"
              name="nickname"
              autoComplete="nickname"
              autoFocus
              disabled={disabled}
              helperText={this.state.formError?.nickname}
              error={!!this.state.formError?.nickname}
              onChange={this.handleChangeTextField('nickname')}
            />
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
              onClick={this.handleClickSignup}
              loading={this.state.localLoadingState === 'loading'}
              disabled={disabled}
            >
              アカウント作成
            </LoadingButton>
            <Typography>
              <Button variant="text" onClick={this.props.switchMode('login')}>
                ログイン
              </Button>
            </Typography>
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
          入力されたメールアドレス宛に確認用メールを送信しました。メールの内容に従ってアカウント作成を完了してください。
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

  protected handleChangeTextField =
    (fieldType: 'password1' | 'password2' | 'nickname') =>
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
        default:
          this.setState({
            nickname: e.target.value,
          });
      }
    };

  protected handleClickSignup = async () => {
    const { nickname, password1, password2 } = this.state;
    this.setState({
      localLoadingState: 'loading',
      errorTitle: undefined,
      errorMessages: undefined,
      formError: undefined,
    });

    try {
      await registration(this.props.email, nickname, password1, password2);
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
            nickname: apiError.data.nickname,
            password1: apiError.data.password1,
            password2: apiError.data.password2,
          },
        });

        apiError.data.non_field_errors &&
          this.handleNonFieldErrors(apiError.data.non_field_errors);
      }

      this.setState({
        localLoadingState: 'error',
      });
    }
  };

  protected handleNonFieldErrors(nonFieldErrors: string[]) {
    const errorMessages = nonFieldErrors.map((error) => {
      switch (error) {
        case "The two password fields didn't match.":
          return '入力された２つのパスワードが一致しません。';
        default:
          return error;
      }
    });

    this.setState({
      errorMessages: errorMessages,
    });
  }
}

export type Props = {
  email: string;

  onChangeEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  switchMode: (mode: AuthFormMode) => () => void;
};

export type State = {
  password1: string;
  password2: string;
  nickname: string;
  localLoadingState: LoadingState;
  errorTitle?: string;
  errorMessages?: string[];
  formError?: FormError;
};

type FormError = {
  email?: string[];
  password1?: string[];
  password2?: string[];
  nickname?: string[];
};
