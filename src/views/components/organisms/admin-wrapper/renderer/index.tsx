import React from 'react';
import { Box, Grid } from '@mui/material';
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
  isMobile: boolean;
  children: React.ReactNode;

  autoLogin: () => void;
};
