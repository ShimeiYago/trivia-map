import React from 'react';
import { Box, Button, Dialog, DialogActions, DialogTitle, Stack, Typography } from '@mui/material';
import { User } from 'types/user';
import { AdminWrapper } from 'views/components/organisms/admin-wrapper';
import { LoadingButton } from '@mui/lab';
import { LoadingState } from 'types/loading-state';
import { autoRefreshApiWrapper } from 'utils/auto-refresh-api-wrapper';
import { BackToNavi } from 'views/components/moleculars/back-to-navi';
import 'react-image-crop/dist/ReactCrop.css';
import { COOKIE_NAME } from 'constant';
import { ACCOUNT_SETTINGS_LINK, MAP_PAGE_LINK } from 'constant/links';
import { PAGE_NAMES } from 'constant/page-names';
import { deactivate } from 'api/auths-api/deactivate';
import { TextList } from 'views/components/atoms/text-list';
import { Image } from 'views/components/atoms/image';
import logoImage from 'images/trivia-map-logo-black.png';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loadingState: 'waiting',
      openComfirmDialog: false,
    };
  }

  render() {
    if (this.state.loadingState === 'success') {
      return this.renderSuccessMessage();
    }

    return (
      <AdminWrapper>
        <Stack spacing={3}>
          <BackToNavi text={PAGE_NAMES.accountSettings} link={ACCOUNT_SETTINGS_LINK} />
          {this.renderContents()}
        </Stack>
        {this.renderConfirmDialog()}
      </AdminWrapper>
    );
  }

  protected renderSuccessMessage = () => {
    return (
      <Typography align="center" component="div" sx={{ mt: 3 }}>
        <Box sx={{ mb: 5 }}>
          <Image src={logoImage} width="200px" />
        </Box>

        <Stack spacing={2}>
          <Typography component="h1" fontSize={18}>
            アカウントの削除が完了しました。
          </Typography>
          <Typography>
            アカウントの復元を希望する場合は、３０日以内にお問い合わせください。
          </Typography>
          <Typography>ご利用ありがとうございました。</Typography>
        </Stack>

        <Typography fontSize={20} sx={{ mt: 3 }}>
          <a href={MAP_PAGE_LINK}>トップへ戻る</a>
        </Typography>
      </Typography>
    );
  };

  protected renderContents = () => {
    return (
      <Stack spacing={3}>
        <Typography component="h2" variant="h5" align="center">
          {PAGE_NAMES.deactivateAccount}
        </Typography>

        <TextList
          list={[
            'アカウントを削除すると、このアカウントから投稿された全てのトリビアも自動的に削除されます。',
            'アカウント削除後にアカウントの復元を希望する場合は、３０日以内にお問い合わせください。',
          ]}
        />

        <Typography align="center">
          <Button
            disabled={this.state.loadingState === 'loading'}
            onClick={this.toggleConfirmModal}
            variant="contained"
            color="error"
          >
            アカウントを削除する
          </Button>
        </Typography>
      </Stack>
    );
  };

  protected renderConfirmDialog() {
    const { openComfirmDialog, loadingState } = this.state;
    if (!openComfirmDialog) {
      return null;
    }

    return (
      <Dialog open onClose={this.toggleConfirmModal}>
        <DialogTitle>アカウントを削除しますか？</DialogTitle>
        <DialogActions>
          <Button onClick={this.toggleConfirmModal}>削除しない</Button>
          <LoadingButton onClick={this.handleDeactivate} loading={loadingState === 'loading'}>
            削除する
          </LoadingButton>
        </DialogActions>
      </Dialog>
    );
  }

  protected toggleConfirmModal = () => {
    this.setState({
      openComfirmDialog: !this.state.openComfirmDialog,
    });
  };

  protected handleDeactivate = async () => {
    this.setState({
      loadingState: 'loading',
    });

    try {
      await autoRefreshApiWrapper(() => deactivate());
      this.setState({
        loadingState: 'success',
      });
      this.props.removeCookie(COOKIE_NAME.hasAccessToken);
      this.props.removeCookie(COOKIE_NAME.hasRefreshToken);
      this.props.updateUser();
    } catch (error) {
      this.props.throwError(500);
    }
  };
}

export type Props = {
  user?: User;

  throwError: (errorStatus: number) => void;
  removeCookie: (name: string) => void;
  updateUser: (user?: User) => void;
};

export type State = {
  openComfirmDialog: boolean;
  loadingState: LoadingState;
};
