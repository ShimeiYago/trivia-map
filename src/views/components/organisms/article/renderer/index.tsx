import React from 'react';
import { Button, Typography } from '@mui/material';
import { LoadingState } from 'types/loading-state';

export class Renderer extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchArticle();
  }

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

        {this.props.onClickEdit && (
          <Button onClick={this.props.onClickEdit}>編集</Button>
        )}
      </>
    );
  }
}

export type Props = {
  title: string;
  content: string;
  loadingState: LoadingState;

  fetchArticle: () => void;
  onClickEdit?: () => void;
};
