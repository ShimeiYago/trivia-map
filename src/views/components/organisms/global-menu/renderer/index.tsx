import React from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  Popover,
  Stack,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { leftNaviContents } from './left-navi-contents';
import { appBarStyle, contentStyle, leftNaviBox, localNavi, logoImageBox } from '../styles';
import { User } from 'types/user';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import { Link, Navigate } from 'react-router-dom';
import { authMenuLinks } from '../constants';
import { BoxModal } from 'views/components/moleculars/box-modal';
import { AuthForms } from '../../auth-forms';
import { sleep } from 'utils/sleep';
import { MAP_PAGE_LINK } from 'constant/links';
import { ArticlePaper } from 'views/components/atoms/article-paper';
import { BackToNavi } from 'views/components/moleculars/back-to-navi';
import logoImage from 'images/logo.png';
import { Image } from 'views/components/moleculars/image';
import { SITE_NAME } from 'constant';
import { AuthFormMode } from '../../auth-forms/renderer';
import noIcon from 'images/no-icon.jpg';
import { TwitterLoginButton } from '../../twitter-login-button';
import EmailIcon from '@mui/icons-material/Email';
export class Renderer extends React.Component<Props, State> {
  static readonly defaultProps: Pick<Props, 'topBarPosition'> = {
    topBarPosition: 'fixed',
  };

  state: State = {
    openLeftNavi: false,
    authMenuAnchorEl: null,
    redirectToTop: false,
    authFormInitialMode: 'login',
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevProps.loggedOutSuccessfully && this.props.loggedOutSuccessfully) {
      this.setState({
        redirectToTop: true,
        authMenuAnchorEl: null,
      });
    }

    if (!prevState.redirectToTop && this.state.redirectToTop) {
      this.setState({
        redirectToTop: false,
      });
    }
  }

  render() {
    if (this.state.redirectToTop) {
      return <Navigate to={MAP_PAGE_LINK} />;
    }

    return (
      <>
        <AppBar
          position={this.props.topBarPosition}
          sx={appBarStyle(!!this.props.permanentLeftNavi, !!this.props.mapPage)}
        >
          <Toolbar>
            {!this.props.permanentLeftNavi && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                sx={{ mr: 2 }}
                onClick={this.toggleLeftMenu(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={logoImageBox(this.props.isMobile)}>
              <h1 hidden>{SITE_NAME}</h1>
              <a href={MAP_PAGE_LINK}>
                <Image src={logoImage} height="full" />
              </a>
            </Box>

            {this.renderAuthMenu()}
          </Toolbar>
        </AppBar>

        {this.renderLeftNavi()}

        {this.props.localBackNavi && (
          <Box
            sx={localNavi(
              !!this.props.permanentLeftNavi,
              !!this.props.mapPage,
              this.props.isMobile,
            )}
          >
            <ArticlePaper variant="navi">
              <BackToNavi
                text={this.props.localBackNavi.text}
                link={this.props.localBackNavi.link}
              />
            </ArticlePaper>
          </Box>
        )}

        <Box
          sx={contentStyle(
            !!this.props.permanentLeftNavi,
            !!this.props.mapPage,
            this.props.isMobile,
            !!this.props.localBackNavi,
            this.props.topBarPosition === 'fixed',
          )}
        >
          {this.props.children}
        </Box>

        <BoxModal
          open={this.props.openAuthFormModal}
          onClose={this.toggleAuthModal(false, 'login')}
          showCloseButton
        >
          <AuthForms
            initialMode={this.state.authFormInitialMode}
            onLoginSucceed={this.handleLoginSucceed}
          />
        </BoxModal>
      </>
    );
  }

  protected renderLeftNavi = () => {
    return !this.props.permanentLeftNavi ? (
      <SwipeableDrawer
        open={this.state.openLeftNavi}
        onOpen={this.toggleLeftMenu(true)}
        onClose={this.toggleLeftMenu(false)}
      >
        <Box sx={leftNaviBox}>
          {leftNaviContents(
            !!this.props.userInfo,
            this.props.pathName,
            this.props.isFormEditting,
            this.toggleLeftMenu(false),
          )}
        </Box>
      </SwipeableDrawer>
    ) : (
      <Drawer open={true} variant="permanent">
        <Box sx={leftNaviBox}>
          {leftNaviContents(
            !!this.props.userInfo,
            this.props.pathName,
            this.props.isFormEditting,
            this.toggleLeftMenu(false),
          )}
        </Box>
      </Drawer>
    );
  };

  protected renderAuthMenu = () => {
    let nickname = `${this.props.userInfo?.nickname ?? 'ゲストさん'}`;
    if (this.props.isMobile && nickname.length > 8) {
      nickname = nickname.slice(0, 8) + '...';
    }

    return (
      <Box>
        <Box onClick={this.handleClickAuthMenu} sx={{ cursor: 'pointer', py: 2 }}>
          <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={0.5}>
            <Typography fontSize={12}>{nickname}</Typography>
            <Avatar sx={{ width: 25, height: 25 }} src={this.props.userInfo?.icon ?? noIcon} />
          </Stack>
        </Box>
        <Popover
          open={!!this.state.authMenuAnchorEl}
          anchorEl={this.state.authMenuAnchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          onClose={this.handleCloseAuthPopover}
        >
          <Box sx={{ p: 2 }}>{this.renderPopoverContent()}</Box>
        </Popover>
      </Box>
    );
  };

  protected renderPopoverContent = () => {
    if (!this.props.userInfo) {
      return (
        <Box sx={{ width: 210 }}>
          <Typography align="center" component="div" sx={{ mb: 1 }}>
            ログインして新しいトリビアを投稿しませんか？
          </Typography>
          <Typography align="center" component="div" sx={{ mb: 1 }}>
            <Stack spacing={2}>
              <TwitterLoginButton />

              <Button
                variant="outlined"
                onClick={this.toggleAuthModal(true, 'login')}
                startIcon={<EmailIcon />}
                fullWidth={true}
              >
                メールでログイン
              </Button>
            </Stack>
          </Typography>
        </Box>
      );
    }

    const menuList = authMenuLinks.map((menu, index) => (
      <Link to={menu.path} key={`authmenu-${index}`}>
        <IconAndText
          iconComponent={<ArrowRightIcon />}
          text={menu.text}
          iconPosition="left"
          align="left"
        />
      </Link>
    ));

    return (
      <Stack spacing={2}>
        {menuList}
        <Button variant="outlined" onClick={this.handleClickLogout}>
          ログアウト
        </Button>
      </Stack>
    );
  };

  protected handleClickAuthMenu = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({
      authMenuAnchorEl: event.currentTarget,
    });
  };

  protected handleCloseAuthPopover = () => {
    this.setState({
      authMenuAnchorEl: null,
    });
  };

  protected toggleLeftMenu(open: boolean) {
    return () =>
      this.setState({
        openLeftNavi: open,
      });
  }

  protected toggleAuthModal(open: boolean, initialMode: AuthFormMode) {
    return () => {
      this.setState({
        authFormInitialMode: initialMode,
      });
      this.props.toggleAuthFormModal(open);
    };
  }

  protected handleLoginSucceed = async () => {
    await sleep(1000);
    this.props.toggleAuthFormModal(false);
    this.setState({
      authMenuAnchorEl: null,
    });
  };

  protected handleClickLogout = () => {
    this.props.logout();
  };
}

export type Props = {
  topBarPosition: 'static' | 'fixed';
  children: React.ReactNode;
  permanentLeftNavi?: boolean;
  userInfo?: User;
  openAuthFormModal: boolean;
  loggedOutSuccessfully: boolean;
  isMobile: boolean;
  mapPage?: boolean;
  localBackNavi?: {
    text: string;
    link: string;
  };
  pathName: string;
  isFormEditting: boolean;

  toggleAuthFormModal: (open: boolean) => void;
  logout: () => void;
};

export type State = {
  openLeftNavi: boolean;
  authMenuAnchorEl: HTMLElement | null;
  redirectToTop: boolean;
  authFormInitialMode: AuthFormMode;
};
