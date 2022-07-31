import React from 'react';
import { Alert, Box, Stack, TextField, Typography } from '@mui/material';
import { User } from 'types/user';
import { AdminWrapper } from 'views/components/organisms/admin-wrapper';
import { NonStyleLink } from 'views/components/atoms/non-style-link';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { LoadingButton } from '@mui/lab';
import { LoadingState } from 'types/loading-state';
import { HeaderErrorMessages } from 'views/components/moleculars/header-error-messages';
import {
  updateUserInfo,
  ValidationError,
} from 'api/auths-api/update-user-info';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { ApiError } from 'api/utils/handle-axios-error';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      nickname: '',
      loadingState: 'waiting',
    };
  }

  render() {
    return <AdminWrapper>{this.renderContents()}</AdminWrapper>;
  }

  protected renderContents = () => {
    return (
      <Stack spacing={3}>
        <NonStyleLink to="/admin/account">
          <IconAndText
            iconComponent={<KeyboardArrowLeftIcon />}
            text="アカウント設定"
            align="left"
            iconPosition="left"
          />
        </NonStyleLink>
        {this.renderForm()}
      </Stack>
    );
  };

  protected renderForm = () => {
    const disabled = this.state.loadingState === 'loading';

    return (
      <Box>
        <Stack spacing={1} sx={{ px: 1, maxWidth: '400px', mx: 'auto' }}>
          <Typography component="h2" variant="h5" align="center">
            プロフィール
          </Typography>
          {this.renderHeaderInfo()}
          <Typography>{this.props.user?.email}</Typography>
          <Box component="form" noValidate>
            <TextField
              margin="normal"
              fullWidth
              name="nickname"
              label="名前"
              type="nickname"
              id="nickname"
              disabled={disabled}
              helperText={this.state.formError?.nickname}
              error={!!this.state.formError?.nickname}
              onChange={this.handleChangeNickname}
              value={this.props.user?.nickname}
            />
            <LoadingButton
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={this.handleSubmit}
              loading={this.state.loadingState === 'loading'}
              disabled={disabled}
            >
              更新
            </LoadingButton>
          </Box>
        </Stack>
      </Box>
    );
  };

  protected renderHeaderInfo() {
    const { errorTitle, errorMessages, loadingState } = this.state;

    if (loadingState === 'success') {
      return <Alert>ユーザー情報を変更しました。</Alert>;
    }

    if (errorTitle) {
      return (
        <HeaderErrorMessages
          errorTitle={errorTitle}
          errorMessages={errorMessages}
        />
      );
    }

    return null;
  }

  protected handleChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      nickname: e.target.value,
    });
  };

  protected handleSubmit = async () => {
    this.setState({
      loadingState: 'loading',
      errorTitle: undefined,
      errorMessages: undefined,
      formError: undefined,
    });

    try {
      const res = await updateUserInfo(this.state.nickname);
      this.props.updateUser(res);
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
            nickname: apiError.data.nickname,
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
  user?: User;

  updateUser: (user: User) => void;
};

export type State = {
  nickname: string;
  loadingState: LoadingState;
  errorTitle?: string;
  errorMessages?: string[];
  formError?: FormError;
};

type FormError = {
  nickname?: string[];
};
