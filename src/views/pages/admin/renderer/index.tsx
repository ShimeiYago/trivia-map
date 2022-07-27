import React from 'react';
import { Box, Grid, Stack } from '@mui/material';
import { LoadingState } from 'types/loading-state';
import { GlobalMenu } from 'views/components/organisms/global-menu';
import { ArticlePaper } from 'views/components/atoms/article-paper';
import { wrapper, contentWrapper } from '../styles';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import { User } from 'types/user';
import { Navigate } from 'react-router-dom';

export class Renderer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.autoLogin();
  }

  render() {
    const { autoLoggingInState } = this.props;

    if (autoLoggingInState === 'error') {
      return <Navigate to="/login" />;
    }

    if (autoLoggingInState === 'waiting' || autoLoggingInState === 'loading') {
      return (
        <Box sx={{ mt: 3 }}>
          <CenterSpinner />
        </Box>
      );
    }

    const { isMobile } = this.props;

    return (
      <Box sx={wrapper}>
        <GlobalMenu topBarPosition="static" permanentLeftNavi={!isMobile}>
          <Box sx={contentWrapper(isMobile)}>
            <Grid container spacing={isMobile ? 2 : 4}>
              <Grid item xs={12}>
                <ArticlePaper variant="main">
                  {this.renderContents()}
                </ArticlePaper>
              </Grid>
            </Grid>
          </Box>
        </GlobalMenu>
      </Box>
    );
  }

  protected renderContents = () => {
    const { user } = this.props;

    return (
      <Stack spacing={2}>
        <Box>ようこそ {user?.nickname}さん</Box>
      </Stack>
    );
  };
}

export type Props = {
  user?: User;
  autoLoggingInState: LoadingState;
  isMobile: boolean;

  autoLogin: () => void;
};
