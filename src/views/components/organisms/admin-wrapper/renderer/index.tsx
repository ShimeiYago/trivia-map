import React from 'react';
import { Box, Grid } from '@mui/material';
import { LoadingState } from 'types/loading-state';
import { GlobalMenu } from 'views/components/organisms/global-menu';
import { ArticlePaper } from 'views/components/atoms/article-paper';
import { wrapper, contentWrapper } from '../styles';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import { User } from 'types/user';
import { Navigate } from 'react-router-dom';
import { LOGIN_LINK, MAP_PAGE_LINK } from 'constant/links';

export class Renderer extends React.Component<Props> {
  render() {
    const { autoLoggingInState, loggedOutSuccessfully } = this.props;

    if (autoLoggingInState === 'waiting' || autoLoggingInState === 'loading') {
      return (
        <Box sx={{ mt: 3 }}>
          <CenterSpinner />
        </Box>
      );
    }

    if (autoLoggingInState === 'error' || !this.props.user) {
      if (loggedOutSuccessfully) {
        return <Navigate to={MAP_PAGE_LINK} />;
      }
      return <Navigate to={LOGIN_LINK} />;
    }

    const { isMobile, children } = this.props;

    return (
      <Box sx={wrapper}>
        <GlobalMenu topBarPosition="static" permanentLeftNavi={!isMobile}>
          <Box sx={contentWrapper(isMobile)}>
            <Grid container spacing={isMobile ? 2 : 4}>
              <Grid item xs={12}>
                <ArticlePaper variant="main">{children}</ArticlePaper>
              </Grid>
            </Grid>
          </Box>
        </GlobalMenu>
      </Box>
    );
  }
}

export type Props = {
  user?: User;
  autoLoggingInState: LoadingState;
  loggedOutSuccessfully: boolean;
  isMobile: boolean;
  children: React.ReactNode;
};
