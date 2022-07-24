import React from 'react';
import {
  AppBar,
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
import { appBarStyle, contentStyle, leftNaviBox } from '../styles';
import { User } from 'types/user';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import { Link } from 'react-router-dom';
import { authMenuLinks } from '../constants';
import { BoxModal } from 'views/components/moleculars/box-modal';
import { AuthForms } from '../../auth-forms';

export class Renderer extends React.Component<Props, State> {
  static readonly defaultProps: Pick<Props, 'topBarPosition'> = {
    topBarPosition: 'fixed',
  };

  constructor(props: Props) {
    super(props);
    props.autoLogin();
  }

  state = {
    openLeftNavi: false,
    authMenuAnchorEl: null,
  };

  render() {
    return (
      <>
        <AppBar
          position={this.props.topBarPosition}
          sx={appBarStyle(!!this.props.permanentLeftNavi)}
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
            <Typography variant="h6" sx={{ flexGrow: 1 }} component="div">
              Persistent drawer
            </Typography>
            {this.renderAuthMenu()}
          </Toolbar>
        </AppBar>

        {this.renderLeftNavi()}

        <Box sx={contentStyle(!!this.props.permanentLeftNavi)}>
          {this.props.children}
        </Box>

        <BoxModal
          open={this.props.openAuthFormModal}
          onClose={this.props.toggleAuthFormModal(false)}
        >
          <AuthForms initialMode={'login'} />
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
        <Box sx={leftNaviBox}>{leftNaviContents}</Box>
      </SwipeableDrawer>
    ) : (
      <Drawer open={true} variant="permanent">
        <Box sx={leftNaviBox}>{leftNaviContents}</Box>
      </Drawer>
    );
  };

  protected renderAuthMenu = () => {
    const welcomeText = `ようこそ ${
      this.props.userInfo?.nickname ?? 'ゲストさん'
    }`;

    return (
      <Box>
        <Box
          onClick={this.handleClickAuthMenu}
          sx={{ cursor: 'pointer', py: 2 }}
        >
          <IconAndText
            iconComponent={<ArrowDropDownIcon />}
            text={welcomeText}
            iconPosition="right"
          />
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
            <Button
              variant="contained"
              onClick={this.props.toggleAuthFormModal(true)}
            >
              ログイン
            </Button>
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

    return <Stack spacing={2}>{menuList}</Stack>;
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
}

export type Props = {
  topBarPosition: 'static' | 'fixed';
  children: React.ReactNode;
  permanentLeftNavi?: boolean;
  userInfo?: User;
  openAuthFormModal: boolean;

  autoLogin: () => void;
  toggleAuthFormModal: (open: boolean) => () => void;
};

export type State = {
  openLeftNavi: boolean;
  authMenuAnchorEl: HTMLElement | null;
};
