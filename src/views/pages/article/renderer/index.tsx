import React from 'react';
import {
  Alert,
  Avatar,
  Box,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { LoadingState } from 'types/loading-state';
import { GlobalMenu } from 'views/components/organisms/global-menu';
import { Link } from 'react-router-dom';
import { ArticlePaper } from 'views/components/atoms/article-paper';
import { Image } from 'views/components/atoms/image';
import { TriviaMap } from 'views/components/organisms/trivia-map';
import { wrapper, contentWrapper, createdAtBox } from '../styles';
import MapIcon from '@mui/icons-material/Map';
import { deepOrange } from '@mui/material/colors';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import { MAP_PAGE_LINK } from 'constant/links';
import {
  GetArticleResponse,
  getRemoteArticle,
} from 'api/articles-api/get-remote-article';
import { ApiError } from 'api/utils/handle-axios-error';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';

// TODO: apiが404のときも403のときも401のときも等しく404エラーページ。500だけは別。
export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loadingState: 'waiting',
    };
  }

  componentDidMount() {
    this.fetchArticle();
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
    const { article, loadingState, errorMsg } = this.state;

    if (loadingState === 'error') {
      return <Alert severity="error">{errorMsg}</Alert>;
    }

    if (!article || loadingState === 'waiting' || loadingState === 'loading') {
      return <CenterSpinner />;
    }

    const {
      title,
      description,
      marker,
      imageUrl,
      author,
      createdAt,
      updatedAt,
      isDraft,
    } = article;

    return (
      <Stack spacing={2}>
        {isDraft && (
          <Alert>この記事は下書きです。あなただけが閲覧できます。</Alert>
        )}

        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
        >
          <Avatar sx={{ bgcolor: deepOrange[500], width: 30, height: 30 }}>
            {author.nickname.slice(0, 1)}
          </Avatar>
          <Typography color="gray">{author.nickname}</Typography>
        </Stack>

        <Typography component="h2" variant="h4" align="center">
          {title}
        </Typography>

        <Box sx={createdAtBox}>
          <Typography>{`投稿日 ${createdAt}`}</Typography>
          {<Typography>{`更新日 ${updatedAt}`}</Typography>}
        </Box>

        <Divider />

        {imageUrl && <Image src={imageUrl} width="full" />}

        <Typography>{description}</Typography>

        <Divider />

        <IconAndText
          iconComponent={<MapIcon />}
          text="地図"
          component="h3"
          variant="h5"
          iconPosition="left"
        />

        <TriviaMap
          height={300}
          initZoom={3}
          initCenter={marker}
          disabled
          doNotShowPostMarkers
          additinalMarkers={[marker]}
        />
      </Stack>
    );
  };

  protected renderSideBar = () => {
    return <>サイドバー</>;
  };

  protected renderLocalNavi = () => {
    return <Link to={MAP_PAGE_LINK}>マップへ戻る</Link>;
  };

  protected fetchArticle = async () => {
    this.setState({
      article: undefined,
      loadingState: 'loading',
      errorMsg: undefined,
    });
    try {
      const res = await getRemoteArticle(this.props.postId);
      this.setState({
        article: res,
        loadingState: 'success',
      });
    } catch (error) {
      const apiError = error as ApiError<unknown>;

      const errorMsg = globalAPIErrorMessage(apiError.status, 'get');
      this.setState({
        loadingState: 'error',
        errorMsg: errorMsg,
      });
    }
  };
}

export type Props = {
  postId: number;
  isMobile: boolean;
};

export type State = {
  article?: GetArticleResponse;
  loadingState: LoadingState;
  errorMsg?: string;
};
