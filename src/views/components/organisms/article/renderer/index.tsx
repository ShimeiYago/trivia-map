import React from 'react';
import { Typography } from '@mui/material';
import { LoadingState } from 'types/loading-state';

export class Renderer extends React.Component<Props> {
  render() {
    if (
      this.props.loadingState === 'waiting' ||
      this.props.loadingState === 'loading'
    ) {
      return <Typography>Loading...</Typography>;
    }

    if (this.props.loadingState === 'error') {
      return <Typography>Something Error!</Typography>;
    }

    return (
      <>
        <Typography variant="h6" component="h2">
          {this.props.title}
        </Typography>
        <Typography sx={{ mt: 2 }}>{this.props.content}</Typography>
      </>
    );
  }
}

export type Props = {
  title: string;
  content: string;
  loadingState: LoadingState;
};
