import React from 'react';
import { Box } from '@mui/material';
import { LoadingState } from 'types/loading-state';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import { User } from 'types/user';
import { Navigate } from 'react-router-dom';
import { LOGIN_LINK, MAP_PAGE_LINK } from 'constant/links';
import { SingleRowPageWrapper } from 'views/components/moleculars/single-row-page-wrapper';

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

    const { children } = this.props;

    return <SingleRowPageWrapper>{children}</SingleRowPageWrapper>;
  }
}

export type Props = {
  user?: User;
  autoLoggingInState: LoadingState;
  loggedOutSuccessfully: boolean;
  children: React.ReactNode;
};
