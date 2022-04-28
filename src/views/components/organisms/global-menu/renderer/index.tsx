import React from 'react';
import {
  AppBar,
  Box,
  IconButton,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { leftNaviContents } from './left-navi-contents';

export class Renderer extends React.Component<Props, State> {
  static readonly defaultProps: Pick<Props, 'barPosition'> = {
    barPosition: 'fixed',
  };

  state = {
    openLeftNavi: false,
  };

  render() {
    return (
      <>
        <AppBar
          position={this.props.barPosition}
          sx={{ borderBottom: '2px solid rgba(255, 255, 255, 0.7)' }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              sx={{ mr: 2 }}
              onClick={this.toggleLeftMenu(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }} component="div">
              Persistent drawer
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Toolbar>
        </AppBar>
        <SwipeableDrawer
          open={this.state.openLeftNavi}
          onOpen={this.toggleLeftMenu(true)}
          onClose={this.toggleLeftMenu(false)}
        >
          <Box sx={{ width: 250, height: '100%' }}>{leftNaviContents}</Box>
        </SwipeableDrawer>
      </>
    );
  }

  protected toggleLeftMenu(open: boolean) {
    return () =>
      this.setState({
        openLeftNavi: open,
      });
  }
}

export type Props = {
  barPosition: 'static' | 'fixed';
};

export type State = {
  openLeftNavi: boolean;
};
