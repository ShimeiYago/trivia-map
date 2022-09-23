import React from 'react';
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { User } from 'types/user';
import { LoadingButton } from '@mui/lab';
import { LoadingState } from 'types/loading-state';
import { HeaderErrorMessages } from 'views/components/moleculars/header-error-messages';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { ApiError } from 'api/utils/handle-axios-error';
import { GlobalMenu } from 'views/components/organisms/global-menu';
import { inquiry, ValidationError } from 'api/inquiry-api';
import { INQUIRY_CATEGORIES } from 'constant';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: props.user?.nickname ?? '',
      email: props.user?.email ?? '',
      tagIndex: null,
      message: '',
      loadingState: 'waiting',
    };
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user)) {
      this.setState({
        name: this.props.user?.nickname ?? '',
        email: this.props.user?.email ?? '',
      });
    }
  }

  render() {
    return (
      <GlobalMenu
        topBarPosition="static"
        permanentLeftNavi={!this.props.isMobile}
      >
        <Stack spacing={1} sx={{ px: 1, maxWidth: '400px', mx: 'auto', my: 3 }}>
          <Typography component="h1" variant="h5" align="center">
            お問い合わせ
          </Typography>
          {this.renderHeaderInfo()}
          {this.renderForm()}
        </Stack>
      </GlobalMenu>
    );
  }

  protected renderForm = () => {
    const disabled =
      this.state.loadingState === 'loading' ||
      this.state.loadingState === 'success';

    return (
      <Stack spacing={2}>
        <TextField
          margin="normal"
          fullWidth
          name="email"
          label="メールアドレス"
          type="email"
          id="email"
          autoComplete="email"
          value={this.state.email}
          disabled={disabled}
          helperText={this.state.formError?.email}
          error={!!this.state.formError?.email}
          onChange={this.handleChangeTextField('email')}
          required
        />
        <TextField
          margin="normal"
          fullWidth
          name="name"
          label="お名前"
          type="nickname"
          id="name"
          autoComplete="nickname"
          value={this.state.name}
          disabled={disabled}
          helperText={this.state.formError?.name}
          error={!!this.state.formError?.name}
          onChange={this.handleChangeTextField('name')}
          required
        />
        <FormControl fullWidth>
          <InputLabel>カテゴリー</InputLabel>
          <Select
            value={
              this.state.tagIndex === null ? '' : this.state.tagIndex.toString()
            }
            label="カテゴリー"
            onChange={this.handleChangeCategory}
            disabled={disabled}
          >
            {INQUIRY_CATEGORIES.map((category, index) => (
              <MenuItem value={index} key={`category-${index}`}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="normal"
          fullWidth
          minRows={4}
          multiline
          name="message"
          label="お問い合わせ内容"
          type="message"
          id="message"
          value={this.state.message}
          disabled={disabled}
          helperText={this.state.formError?.message}
          error={!!this.state.formError?.message}
          onChange={this.handleChangeTextField('message')}
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
          送信
        </LoadingButton>
      </Stack>
    );
  };

  protected renderHeaderInfo() {
    const { errorTitle, errorMessages, loadingState } = this.state;

    if (loadingState === 'success') {
      window.scroll({ top: 0 });
      return (
        <Alert>
          お問い合わせを受け付けました。後日ご指定のメールアドレスへお返事をお送り致します。
        </Alert>
      );
    }

    if (errorTitle) {
      window.scroll({ top: 0 });
      return (
        <HeaderErrorMessages
          errorTitle={errorTitle}
          errorMessages={errorMessages}
        />
      );
    }

    return null;
  }

  protected handleChangeTextField =
    (fieldType: 'name' | 'email' | 'message') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      switch (fieldType) {
        case 'name':
          this.setState({
            name: e.target.value,
          });
          break;
        case 'email':
          this.setState({
            email: e.target.value,
          });
          break;
        case 'message':
          this.setState({
            message: e.target.value,
          });
          break;
      }
    };

  protected handleChangeCategory = (event: SelectChangeEvent) => {
    this.setState({
      tagIndex: Number(event.target.value),
    });
  };

  protected handleSubmit = async () => {
    const { email, name, tagIndex, message } = this.state;
    this.setState({
      loadingState: 'loading',
      errorTitle: undefined,
      errorMessages: undefined,
      formError: undefined,
    });

    try {
      await inquiry({
        email: email,
        name: name,
        tag: tagIndex === null ? '' : INQUIRY_CATEGORIES[tagIndex],
        message: message,
      });
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
            email: apiError.data.email,
            name: apiError.data.name,
            message: apiError.data.message,
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
  isMobile: boolean;
};

export type State = {
  email: string;
  name: string;
  tagIndex: number | null;
  message: string;
  loadingState: LoadingState;
  errorTitle?: string;
  errorMessages?: string[];
  formError?: FormError;
};

type FormError = {
  email?: string[];
  name?: string[];
  message?: string[];
};
