import React from 'react';
import { Alert, Avatar, Box, Divider, Stack, Typography } from '@mui/material';
import { LoadingState } from 'types/loading-state';
import { Image } from 'views/components/atoms/image';
import { TriviaMap } from 'views/components/organisms/trivia-map';
import { createdAtBox } from '../styles';
import MapIcon from '@mui/icons-material/Map';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import { GetArticleResponse, getRemoteArticle } from 'api/articles-api/get-remote-article';
import { ApiError } from 'api/utils/handle-axios-error';
import { ArticleWrapper } from 'views/components/organisms/article-wrapper';
import { autoRefreshApiWrapper } from 'utils/auto-refresh-api-wrapper';
import { AreaNames } from 'views/components/atoms/area-names';
import { ZOOMS } from 'constant';
import noIcon from 'images/no-icon.jpg';
import { AUTHER_PAGE_LINK, CATEGORY_PAGE_LINK, EDIT_LINK } from 'constant/links';
import { Link } from 'react-router-dom';
import { categoryMapper } from 'utils/category-mapper';
import FolderIcon from '@mui/icons-material/Folder';
import { User } from 'types/user';
import EditIcon from '@mui/icons-material/Edit';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { Helmet } from 'react-helmet-async';

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
    return <ArticleWrapper showSidebar>{this.renderMainArticle()}</ArticleWrapper>;
  }

  protected renderMainArticle = () => {
    const { article, loadingState } = this.state;

    if (!article || loadingState === 'waiting' || loadingState === 'loading') {
      return <CenterSpinner />;
    }

    const { title, description, marker, image, author, createdAt, updatedAt, isDraft, category } =
      article;

    return (
      <>
        <Helmet>
          <title>{pageTitleGenerator(title)}</title>
        </Helmet>

        <Stack spacing={2}>
          {isDraft && (
            <Alert severity="info">この記事は下書きです。あなただけが閲覧できます。</Alert>
          )}

          {this.renderEditLink()}

          <Link to={AUTHER_PAGE_LINK(author.userId.toString())}>
            <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
              <Avatar sx={{ width: 30, height: 30 }} src={author.icon ?? noIcon} />
              <Typography color="gray">{author.nickname}</Typography>
            </Stack>
          </Link>

          <Typography component="h2" variant="h4" align="center">
            {title}
          </Typography>

          <Link to={CATEGORY_PAGE_LINK(category.toString())}>
            <Typography color="gray" component="div">
              <IconAndText
                iconComponent={<FolderIcon />}
                text={categoryMapper(category)}
                align="left"
                iconPosition="left"
              />
            </Typography>
          </Link>

          <Box sx={createdAtBox}>
            <Typography>{`投稿日 ${createdAt}`}</Typography>
            {createdAt !== updatedAt && <Typography>{`更新日 ${updatedAt}`}</Typography>}
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

          <AreaNames areaNames={marker.areaNames} variant="body2" />

          <TriviaMap
            height={300}
            initZoom={ZOOMS.miniMap}
            initCenter={marker}
            disabled
            doNotShowPostMarkers
            additinalMarkers={[marker]}
            park={marker.park}
          />
        </Stack>
      </>
    );
  };

  protected fetchArticle = async () => {
    this.setState({
      article: undefined,
      loadingState: 'loading',
    });
    try {
      const res = await autoRefreshApiWrapper(() => getRemoteArticle(this.props.postId));
      this.setState({
        article: res,
        loadingState: 'success',
      });
    } catch (error) {
      const apiError = error as ApiError<unknown>;

      if (apiError.status === 404 || apiError.status === 401 || apiError.status === 403) {
        this.props.throwError(404);
      } else {
        this.props.throwError(500);
      }
    }
  };

  protected renderEditLink = () => {
    if (
      !this.props.user ||
      !this.state.article ||
      this.props.user.userId !== this.state.article.author.userId
    ) {
      return null;
    }

    return (
      <Link to={EDIT_LINK(this.props.postId.toString())}>
        <IconAndText iconComponent={<EditIcon />} text="編集" iconPosition="left" align="right" />
      </Link>
    );
  };
}

export type Props = {
  postId: number;
  user?: User;

  throwError: (errorStatus: number) => void;
};

export type State = {
  article?: GetArticleResponse;
  loadingState: LoadingState;
};
