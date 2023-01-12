import React from 'react';
import { Alert, Avatar, Box, Divider, Stack, Typography, Link } from '@mui/material';
import { LoadingState } from 'types/loading-state';
import { Image } from 'views/components/moleculars/image';
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
import { categoryMapper } from 'utils/category-mapper';
import FolderIcon from '@mui/icons-material/Folder';
import { User } from 'types/user';
import EditIcon from '@mui/icons-material/Edit';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { CommonHelmet } from 'helper-components/common-helmet';
import { NonStyleLink } from 'views/components/atoms/non-style-link';
import { ShareButtons } from 'views/components/atoms/share-buttons';
import { LoadingButton } from '@mui/lab';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { checkLikeStatus } from 'api/likes-api/check-like-status';
import { toggleLike } from 'api/likes-api/toggle-like';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loadingArticleState: 'waiting',
      loadingLikeState: 'waiting',
      haveLiked: false,
    };
  }

  componentDidMount() {
    this.fetchArticle();
    this.checkLikeStatus();
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (prevProps.postId !== this.props.postId) {
      this.fetchArticle();
    }

    if (prevProps.user?.userId !== this.props.user?.userId) {
      this.checkLikeStatus();
    }
  }

  render() {
    return <ArticleWrapper showSidebar>{this.renderMainArticle()}</ArticleWrapper>;
  }

  protected renderMainArticle = () => {
    const { article, loadingArticleState } = this.state;

    if (!article || loadingArticleState === 'waiting' || loadingArticleState === 'loading') {
      return <CenterSpinner />;
    }

    const { title, description, marker, image, author, createdAt, updatedAt, isDraft, category } =
      article;

    const pageTitle = pageTitleGenerator(title);

    return (
      <>
        <CommonHelmet
          title={pageTitle}
          description={description ?? undefined}
          imageUrl={image ?? undefined}
          ogType="article"
        />

        <Stack spacing={2}>
          {isDraft && (
            <Alert severity="info">この記事は下書きです。あなただけが閲覧できます。</Alert>
          )}

          {this.renderEditLink()}

          <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
            <NonStyleLink to={AUTHER_PAGE_LINK(author.userId.toString())}>
              <Avatar sx={{ width: 30, height: 30 }} src={author.icon ?? noIcon} />
            </NonStyleLink>
            <NonStyleLink to={AUTHER_PAGE_LINK(author.userId.toString())}>
              <Typography color="gray" sx={{ textDecoration: 'underline' }}>
                {author.nickname}
              </Typography>
            </NonStyleLink>
          </Stack>

          <Typography component="h2" variant="h4" align="center" sx={{ wordBreak: 'break-all' }}>
            {title}
          </Typography>

          <Typography component="div" color="gray" sx={{ textDecoration: 'underline' }}>
            <IconAndText
              iconComponent={<FolderIcon />}
              text={categoryMapper(category)}
              align="left"
              iconPosition="left"
              link={CATEGORY_PAGE_LINK(category.toString())}
            />
          </Typography>

          <Box sx={createdAtBox}>
            <Typography>{`投稿日 ${createdAt}`}</Typography>
            {createdAt !== updatedAt && <Typography>{`更新日 ${updatedAt}`}</Typography>}
          </Box>

          <Divider />

          {image && <Image src={image} width="full" />}

          <Typography whiteSpace="pre-wrap" fontSize={20}>
            {description}
          </Typography>

          <Divider />

          <IconAndText
            iconComponent={<MapIcon />}
            text="地図"
            component="h3"
            variant="h5"
            iconPosition="left"
          />

          <Typography component="div">
            エリア：
            <AreaNames areaNames={marker.areaNames} />
          </Typography>

          <TriviaMap
            height={300}
            initZoom={ZOOMS.miniMap}
            initCenter={marker}
            disabled
            doNotShowPostMarkers
            additinalMarkers={[marker]}
            park={marker.park}
          />

          <Divider />

          {this.renderLikeButton()}

          <ShareButtons title={pageTitle} url={window.location.href} />
        </Stack>
      </>
    );
  };

  protected fetchArticle = async () => {
    this.setState({
      article: undefined,
      loadingArticleState: 'loading',
    });
    try {
      const res = await autoRefreshApiWrapper(
        () => getRemoteArticle(this.props.postId),
        this.props.refreshUser,
      );
      this.setState({
        article: res,
        loadingArticleState: 'success',
        numberOfLikes: res.numberOfLikes,
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
      <Link component="div">
        <IconAndText
          iconComponent={<EditIcon />}
          text="編集"
          iconPosition="left"
          align="right"
          link={EDIT_LINK(this.props.postId.toString())}
          onClick={this.props.initialize}
        />
      </Link>
    );
  };

  protected renderLikeButton = () => {
    const { haveLiked, numberOfLikes, loadingLikeState } = this.state;

    return (
      <Box textAlign="right">
        <LoadingButton
          startIcon={haveLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
          variant={haveLiked ? 'contained' : 'outlined'}
          loading={loadingLikeState === 'loading'}
          onClick={this.handleClickLikeButton}
        >
          {numberOfLikes === 0 ? 'いいね' : numberOfLikes}
        </LoadingButton>
      </Box>
    );
  };

  protected checkLikeStatus = async () => {
    if (!this.props.user) {
      return;
    }

    this.setState({
      loadingLikeState: 'loading',
    });

    try {
      const res = await autoRefreshApiWrapper(
        () => checkLikeStatus(this.props.postId),
        this.props.refreshUser,
      );
      this.setState({
        haveLiked: res.haveLiked,
        loadingLikeState: 'success',
      });
    } catch (error) {
      this.props.throwError(500);
    }
  };

  protected handleClickLikeButton = async () => {
    if (!this.props.user) {
      this.props.toggleAuthFormModal(true);
      return;
    }

    this.setState({
      loadingLikeState: 'loading',
    });

    try {
      const res = await autoRefreshApiWrapper(
        () => toggleLike(this.props.postId),
        this.props.refreshUser,
      );
      this.setState({
        haveLiked: res.haveLiked,
        loadingLikeState: 'success',
        numberOfLikes: res.numberOfLikes,
      });
    } catch (error) {
      this.props.throwError(500);
    }
  };
}

export type Props = {
  postId: number;
  user?: User;

  initialize: () => void;
  throwError: (errorStatus: number) => void;
  refreshUser: () => void;
  toggleAuthFormModal: (open: boolean) => void;
};

export type State = {
  article?: GetArticleResponse;
  loadingArticleState: LoadingState;
  loadingLikeState: LoadingState;
  numberOfLikes?: number;
  haveLiked: boolean;
};
