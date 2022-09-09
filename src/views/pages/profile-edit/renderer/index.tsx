import React from 'react';
import { Alert, Box, Stack, TextField, Typography } from '@mui/material';
import { User } from 'types/user';
import { AdminWrapper } from 'views/components/organisms/admin-wrapper';
import { LoadingButton } from '@mui/lab';
import { LoadingState } from 'types/loading-state';
import { HeaderErrorMessages } from 'views/components/moleculars/header-error-messages';
import {
  updateUserInfo,
  ValidationError,
} from 'api/auths-api/update-user-info';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { ApiError } from 'api/utils/handle-axios-error';
import { autoRefreshApiWrapper } from 'utils/auto-refresh-api-wrapper';
import { BackToAccountSettingNavi } from 'views/components/moleculars/back-to-account-setting-navi';
import { SelializedImageFile } from 'types/selialized-image-file';
import { ImageField } from 'views/components/moleculars/image-field';
import { resizeAndConvertToSelializedImageFile } from 'utils/resize-and-convert-to-selialized-image-file.ts';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      nickname: props.user?.nickname ?? '',
      loadingState: 'waiting',
      icon: props.user?.icon ?? null,
    };
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user)) {
      this.setState({
        nickname: this.props.user?.nickname ?? '',
        icon: this.props.user?.icon ?? null,
      });
    }
  }

  render() {
    return <AdminWrapper>{this.renderContents()}</AdminWrapper>;
  }

  protected renderContents = () => {
    return (
      <Stack spacing={3}>
        <BackToAccountSettingNavi />
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

          <Box>
            <ImageField
              variant="icon"
              src={this.getSrc()}
              onChange={this.handleFileInputChange}
              disabled={disabled}
              helperText={this.state.formError?.nickname}
              error={!!this.state.formError?.nickname}
            />
          </Box>

          {this.renderEmail()}
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
              value={this.state.nickname}
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
              更新
            </LoadingButton>
          </Box>
        </Stack>
      </Box>
    );
  };

  protected getSrc() {
    const { icon } = this.state;

    if (typeof icon === 'string') {
      return icon;
    }

    if (icon === null) {
      return undefined;
    }

    return icon.dataUrl;
  }

  protected renderEmail = () => {
    return (
      <Box sx={{ pl: 1.5 }}>
        <Typography fontSize={12} color="gray" sx={{ pb: 0.5 }}>
          メールアドレス（非公開）
        </Typography>
        <Typography fontSize={18}>{this.props.user?.email}</Typography>
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

  protected handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // convert file to SelializedImageFile
      try {
        const selializedImageFile = await resizeAndConvertToSelializedImageFile(
          file,
        );
        this.setState({
          icon: selializedImageFile,
        });
      } catch (error: unknown) {
        this.props.throwError(500);
      }
    } else {
      this.setState({
        icon: null,
      });
    }
  };

  protected handleSubmit = async () => {
    this.setState({
      loadingState: 'loading',
      errorTitle: undefined,
      errorMessages: undefined,
      formError: undefined,
    });

    try {
      const res = await autoRefreshApiWrapper(() =>
        updateUserInfo({ nickname: this.state.nickname }),
      );
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
            icon: apiError.data.icon,
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
  throwError: (errorStatus: number) => void;
};

export type State = {
  nickname: string;
  icon: string | SelializedImageFile | null;
  loadingState: LoadingState;
  errorTitle?: string;
  errorMessages?: string[];
  formError?: FormError;
};

type FormError = {
  nickname?: string[];
  icon?: string[];
};
