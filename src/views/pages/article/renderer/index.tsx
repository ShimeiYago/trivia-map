import React from 'react';
import { Box, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { LoadingState } from 'types/loading-state';
import { GlobalMenu } from 'views/components/organisms/global-menu';
import { Link } from 'react-router-dom';
import { ArticlePaper } from 'views/components/atoms/article-paper';
import { Position } from 'types/position';
import { Image } from 'views/components/atoms/image';
import { TriviaMap } from 'views/components/organisms/trivia-map';
import {
  wrapper,
  contentWrapper,
  miniMapWrapper,
  miniMapLayer,
} from '../styles';

export class Renderer extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchArticle();
  }

  render() {
    const { isMobile } = this.props;

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
    const { articleLoadingState, title, content, position, imageUrl } =
      this.props;

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
      <Stack spacing={2}>
        <Typography component="h2" variant="h4" align="center">
          {title}
        </Typography>

        {imageUrl && (
          <Image
            src={imageUrl}
            width="full"
            height="300px"
            objectFit="cover"
            borderRadius
          />
        )}

        <Typography>{content}</Typography>

        <Box sx={miniMapWrapper}>
          <TriviaMap
            height={400}
            initZoom={3}
            initCenter={position}
            disabled
            doNotShowMarkers
          />
          <Box sx={miniMapLayer}></Box>
        </Box>
      </Stack>
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
  position: Position;
  imageUrl: string | null;
  articleLoadingState: LoadingState;
  isMobile: boolean;

  fetchArticle: () => void;
};
