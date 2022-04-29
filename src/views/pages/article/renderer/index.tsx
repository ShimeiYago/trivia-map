import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { LoadingState } from 'types/loading-state';

export class Renderer extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchArticle();
  }

  render() {
    if (
      this.props.articleLoadingState === 'waiting' ||
      this.props.articleLoadingState === 'loading'
    ) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      );
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
  articleLoadingState: LoadingState;

  fetchArticle: () => void;
};
