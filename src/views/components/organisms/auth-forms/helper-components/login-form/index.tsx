import React from 'react';
import { LoadingState } from 'types/loading-state';
import { User } from 'types/user';
import { Alert, Box, Button, Divider, Grid, Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { login, ValidationError } from 'api/auths-api/login';
import { ApiError } from 'api/utils/handle-axios-error';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { HeaderErrorMessages } from 'views/components/moleculars/header-error-messages';
import { AuthFormMode } from '../../renderer';
import { TwitterLoginButton } from 'views/components/organisms/twitter-login-button';
import { grey } from '@mui/material/colors';

export class LoginForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      password: '',
      localLoadingState: 'waiting',
      showResendEmailButton: false,
    };
  }

  render() {
    const disabled = !!this.props.userInfo || this.state.localLoadingState === 'loading';

    return (
      <Stack spacing={1} sx={{ px: 1, py: 2 }}>
        <Typography component="h1" variant="h5" align="center">
          ログイン
        </Typography>
        <Typography component="p" align="center" fontSize={14} color={grey[800]}>
          ログインすると、新しいトリビアを投稿できるようになります。
        </Typography>
        <Stack spacing={2} sx={{ py: 2 }}>
          <Typography align="center" component="div">
            <TwitterLoginButton onLoginSucceed={this.props.onLoginSuceed} />
          </Typography>
          <Typography align="center">または</Typography>
          <Divider />
        </Stack>

        <Typography align="center">メールアドレスでログイン</Typography>

        {this.renderHeaderInfo()}
        <Box component="form" noValidate>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="メールアドレス"
            name="email"
            autoComplete="email"
            disabled={disabled}
            helperText={this.state.formError?.email}
            error={!!this.state.formError?.email}
            onChange={this.props.onChangeEmail}
            value={this.props.email}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="current-password"
            disabled={disabled}
            helperText={this.state.formError?.password}
            error={!!this.state.formError?.password}
            onChange={this.handleChangePassword}
            required
          />
          <LoadingButton
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={this.handleClickLogin}
            loading={this.state.localLoadingState === 'loading'}
            disabled={disabled}
          >
            ログイン
          </LoadingButton>
          <Grid container>
            <Grid item xs>
              <Button variant="text" onClick={this.props.switchMode('reset-password')}>
                パスワードを忘れた場合
              </Button>
            </Grid>
            <Grid item>
              <Button variant="text" onClick={this.props.switchMode('signup')}>
                アカウント作成
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    );
  }

  protected renderHeaderInfo() {
    const { userInfo } = this.props;
    const { errorTitle, errorMessages, showResendEmailButton } = this.state;

    if (userInfo) {
      return (
        <Alert>
          <div>ログインに成功しました。</div>
          <div>ようこそ {userInfo.nickname}さん</div>
        </Alert>
      );
    }

    if (errorTitle) {
      return (
        <Box>
          <HeaderErrorMessages errorTitle={errorTitle} errorMessages={errorMessages} />
          {showResendEmailButton && (
            <Typography align="right">
              <Button variant="text" onClick={this.props.switchMode('resend-email')}>
                確認メールが届いていませんか？
              </Button>
            </Typography>
          )}
        </Box>
      );
    }

    return null;
  }

  protected handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: e.target.value,
    });
  };

  protected handleClickLogin = async () => {
    this.setState({
      localLoadingState: 'loading',
      errorTitle: undefined,
      errorMessages: undefined,
      showResendEmailButton: false,
      formError: undefined,
    });

    try {
      const res = await login(this.props.email, this.state.password);
      this.props.loginSuccess(res.user);
      this.setState({
        localLoadingState: 'success',
      });
      this.props.onLoginSuceed && this.props.onLoginSuceed();

      this.props.setAccessTokenExpiration(new Date(res.access_token_expiration));
      this.props.setRefreshTokenExpiration(new Date(res.refresh_token_expiration));
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
            password: apiError.data.password,
          },
        });

        apiError.data.non_field_errors && this.handleNonFieldErrors(apiError.data.non_field_errors);
      }

      this.setState({
        localLoadingState: 'error',
      });
    }
  };

  protected handleNonFieldErrors(nonFieldErrors: string[]) {
    const errorMessages = nonFieldErrors.map((error) => {
      switch (error) {
        case 'Must include "email" and "password".':
          return 'メールアドレスとパスワードを入力してください。';
        case 'E-mail is not verified.':
          this.setState({
            showResendEmailButton: true,
          });
          return 'このメールアドレスはまだ有効化されていません。アカウント作成時に送信されたメールを確認してください。';
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
  autoLoggingInState: LoadingState;
  email: string;
  userInfo?: User;

  onChangeEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loginSuccess: (user: User) => void;
  switchMode: (mode: AuthFormMode) => () => void;
  onLoginSuceed?: () => void;
  setAccessTokenExpiration: (expirationDate: Date) => void;
  setRefreshTokenExpiration: (expirationDate: Date) => void;
};

export type State = {
  password: string;
  localLoadingState: LoadingState;
  errorTitle?: string;
  errorMessages?: string[];
  formError?: FormError;
  showResendEmailButton: boolean;
};

type FormError = {
  email?: string[];
  password?: string[];
};
