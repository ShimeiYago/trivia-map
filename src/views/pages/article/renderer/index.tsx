import React from 'react';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { LoadingState } from 'types/loading-state';
import { GlobalMenu } from 'views/components/organisms/global-menu';
import { wrapper } from '../styles';
import { Link } from 'react-router-dom';
import { ArticlePaper } from 'views/components/atoms/article-paper';

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
      <Box sx={wrapper}>
        <GlobalMenu barPosition="static" />
        <Box sx={{ marginTop: 5, marginX: 10 }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <ArticlePaper variant="navi">
                <Link to="/">マップへ戻る</Link>
              </ArticlePaper>
            </Grid>
            <Grid item xs={8}>
              <ArticlePaper variant="main">
                {this.renderContents()}
              </ArticlePaper>
            </Grid>
            <Grid item xs={4}>
              <ArticlePaper variant="side">サイドバー</ArticlePaper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }

  protected renderContents = () => {
    return (
      <>
        <Typography variant="h4" component="h2" align="center">
          {this.props.title}
        </Typography>
        <Typography sx={{ mt: 2 }}>{this.props.content}</Typography>
      </>
    );
  };
}

export type Props = {
  title: string;
  content: string;
  articleLoadingState: LoadingState;

  fetchArticle: () => void;
};
