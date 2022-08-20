import React from 'react';
import { Alert, Avatar, Box, Divider, Stack, Typography } from '@mui/material';
import { LoadingState } from 'types/loading-state';
import { Image } from 'views/components/atoms/image';
import { TriviaMap } from 'views/components/organisms/trivia-map';
import { createdAtBox } from '../styles';
import MapIcon from '@mui/icons-material/Map';
import { deepOrange } from '@mui/material/colors';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import {
  GetArticleResponse,
  getRemoteArticle,
} from 'api/articles-api/get-remote-article';
import { ApiError } from 'api/utils/handle-axios-error';
import { ArticleWrapper } from 'views/components/organisms/article-wrapper';
import { autoRefreshApiWrapper } from 'utils/auto-refresh-api-wrapper';

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
    return <ArticleWrapper>{this.renderMainArticle()}</ArticleWrapper>;
  }

  protected renderMainArticle = () => {
    const { article, loadingState } = this.state;

    if (!article || loadingState === 'waiting' || loadingState === 'loading') {
      return <CenterSpinner />;
    }

    const {
      title,
      description,
      marker,
      image,
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

        {image && <Image src={image} width="full" />}

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

  protected fetchArticle = async () => {
    this.setState({
      article: undefined,
      loadingState: 'loading',
    });
    try {
      const res = await autoRefreshApiWrapper(() =>
        getRemoteArticle(this.props.postId),
      );
      this.setState({
        article: res,
        loadingState: 'success',
      });
    } catch (error) {
      const apiError = error as ApiError<unknown>;

      if (
        apiError.status === 404 ||
        apiError.status === 401 ||
        apiError.status === 403
      ) {
        this.props.throwError(404);
      } else {
        this.props.throwError(500);
      }
    }
  };
}

export type Props = {
  postId: number;

  throwError: (errorStatus: number) => void;
};

export type State = {
  article?: GetArticleResponse;
  loadingState: LoadingState;
};
