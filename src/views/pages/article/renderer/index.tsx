import React from 'react';
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { LoadingState } from 'types/loading-state';
import { GlobalMenu } from 'views/components/organisms/global-menu';
import { Link } from 'react-router-dom';
import { ArticlePaper } from 'views/components/atoms/article-paper';
import { Position } from 'types/position';
import { Image } from 'views/components/atoms/image';
import { TriviaMap } from 'views/components/organisms/trivia-map';
import { wrapper, contentWrapper, mapTitle } from '../styles';
import MapIcon from '@mui/icons-material/Map';

export class Renderer extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchArticle();
  }

  render() {
    const { isMobile } = this.props;

    return (
      <Box sx={wrapper}>
        <GlobalMenu topBarPosition="static" permanentLeftNavi={!isMobile}>
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
                <ArticlePaper variant="side">
                  {this.renderSideBar()}
                </ArticlePaper>
              </Grid>
            </Grid>
          </Box>
        </GlobalMenu>
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

        {imageUrl && <Image src={imageUrl} width="full" />}

        <Typography>{content}</Typography>

        <Divider />

        <Typography sx={mapTitle} component="h3" variant="h5">
          <MapIcon fontSize="inherit" />
          地図
        </Typography>

        <TriviaMap
          height={300}
          initZoom={3}
          initCenter={position}
          disabled
          doNotShowPostMarkers
          additinalMarkers={[position]}
        />
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
