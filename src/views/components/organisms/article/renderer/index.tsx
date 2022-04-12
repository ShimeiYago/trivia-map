import React from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { LoadingState } from 'types/loading-state';
import { LoadingButton } from '@mui/lab';

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

        {this.props.onClickEdit && (
          <Button onClick={this.props.onClickEdit}>編集</Button>
        )}

        {this.props.onClickDelete && (
          <LoadingButton
            loading={this.props.markerDeletingState === 'loading'}
            variant="outlined"
            onClick={this.props.onClickDelete}
          >
            削除
          </LoadingButton>
        )}
      </>
    );
  }
}

export type Props = {
  title: string;
  content: string;
  articleLoadingState: LoadingState;
  markerDeletingState: LoadingState;

  fetchArticle: () => void;
  onClickEdit?: () => void;
  onClickDelete?: () => void;
};
