import React from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { leftNaviContents } from './left-navi-contents';
import { appBarStyle, contentStyle, leftNaviBox } from '../styles';

export class Renderer extends React.Component<Props, State> {
  static readonly defaultProps: Pick<Props, 'topBarPosition'> = {
    topBarPosition: 'fixed',
  };

  state = {
    openLeftNavi: false,
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
            <IconButton size="large" color="inherit">
              <AccountCircle />
            </IconButton>
          </Toolbar>
        </AppBar>

        {this.renderLeftNavi()}

        <Box sx={contentStyle(!!this.props.permanentLeftNavi)}>
          {this.props.children}
        </Box>
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
};

export type State = {
  openLeftNavi: boolean;
};
