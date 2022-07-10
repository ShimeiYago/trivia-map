import React from 'react';
import { LoadingState } from 'types/loading-state';
import { User } from 'types/user';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { login, ValidationError } from 'api/auths-api/login';
import { ApiError } from 'api/utils/handle-axios-error';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      localLoadingState: 'waiting',
    };
  }

  render() {
    const disabled =
      this.props.logginingInState === 'loading' ||
      this.props.logginingInState === 'success' ||
      this.state.localLoadingState === 'loading';

    return (
      <Container component="main" maxWidth="xs">
        <Box>
          <Typography component="h1" variant="h5" align="center">
            ログイン
          </Typography>
          {this.renderHeaderError()}
          <Box component="form" noValidate sx={{ mt: 1 }}>
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
                <Button variant="text">パスワードを忘れた場合</Button>
              </Grid>
              <Grid item>
                <Button variant="text">アカウント作成</Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    );
  }

  protected renderHeaderError() {
    const { errorTitle, errorMessages } = this.state;

    if (!errorTitle) {
      return null;
    }

    return (
      <Alert severity="error">
        <AlertTitle>{errorTitle}</AlertTitle>
        <ul>
          {errorMessages?.map((msg, index) => (
            <li key={`error-${index}`}>{msg}</li>
          ))}
        </ul>
      </Alert>
    );
  }

  protected handleClickLogin = async () => {
    this.setState({
      localLoadingState: 'loading',
    });

    try {
      const res = await login(this.state.email, this.state.password);
      this.props.loginSuccess(res.user);
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
            password: apiError.data.password,
          },
        });

        apiError.data.non_field_errors &&
          this.setState({
            // TODO: map non field errors
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
  logginingInState: LoadingState;

  loginSuccess: (user: User) => void;
};

export type State = {
  email: string;
  password: string;
  localLoadingState: LoadingState;
  errorTitle?: string;
  errorMessages?: string[];
  formError?: FormError;
};

type FormError = {
  email?: string[];
  password?: string[];
};
