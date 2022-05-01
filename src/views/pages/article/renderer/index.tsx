import React from 'react';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { LoadingState } from 'types/loading-state';
import { GlobalMenu } from 'views/components/organisms/global-menu';
import { wrapper, contentWrapper } from '../styles';
import { Link } from 'react-router-dom';
import { ArticlePaper } from 'views/components/atoms/article-paper';

export class Renderer extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchArticle();
  }

  render() {
    const { articleLoadingState, isMobile } = this.props;
    if (
      articleLoadingState === 'waiting' ||
      articleLoadingState === 'loading'
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
        <Box sx={contentWrapper(isMobile)}>
          <Grid container spacing={isMobile ? 2 : 4}>
            <Grid item xs={12}>
              <ArticlePaper variant="navi">
                {this.renderLocalNavi()}
              </ArticlePaper>
            </Grid>
            <Grid item xs={isMobile ? 12 : 8}>
              <ArticlePaper variant="main">
                {this.renderMainArticle()}
              </ArticlePaper>
            </Grid>
            <Grid item xs={isMobile ? 12 : 4}>
              <ArticlePaper variant="side">{this.renderSideBar()}</ArticlePaper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }

  protected renderMainArticle = () => {
    return (
      <>
        <Typography variant="h4" component="h2" align="center">
          {this.props.title}
        </Typography>
        <Typography sx={{ mt: 2 }}>{this.props.content}</Typography>
      </>
    );
  };

  protected renderSideBar = () => {
    return <>サイドバー</>;
  };

  protected renderLocalNavi = () => {
    return <Link to="/">マップへ戻る</Link>;
  };
}

export type Props = {
  title: string;
  content: string;
  articleLoadingState: LoadingState;
  isMobile: boolean;

  fetchArticle: () => void;
};
