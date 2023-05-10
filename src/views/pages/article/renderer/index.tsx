import React from 'react';
import { Alert, Avatar, Box, Divider, Stack, Typography, Link, Grid } from '@mui/material';
import { LoadingState } from 'types/loading-state';
import { Image } from 'views/components/moleculars/image';
import { TriviaMap } from 'views/components/organisms/trivia-map';
import { createdAtBox } from '../styles';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import { GetArticleResponse, getRemoteArticle } from 'api/articles-api/get-remote-article';
import { ApiError } from 'api/utils/handle-axios-error';
import { ArticleWrapper } from 'views/components/organisms/article-wrapper';
import { autoRefreshApiWrapper } from 'utils/auto-refresh-api-wrapper';
import { AreaNames } from 'views/components/atoms/area-names';
import { ZOOMS } from 'constant';
import noIcon from 'images/no-icon.jpg';
import { AUTHER_PAGE_LINK, CATEGORY_PAGE_LINK, EDIT_LINK, MAP_PAGE_LINK } from 'constant/links';
import { categoryMapper } from 'utils/category-mapper';
import FolderIcon from '@mui/icons-material/Folder';
import { User } from 'types/user';
import EditIcon from '@mui/icons-material/Edit';
import { CommonHelmet } from 'helper-components/common-helmet';
import { NonStyleLink } from 'views/components/atoms/non-style-link';
import { ShareButtons } from 'views/components/atoms/share-buttons';
import { LoadingButton } from '@mui/lab';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { toggleGood } from 'api/goods-api/toggle-good';
import { checkLikeStatus } from 'api/likes-api/check-like-status';
import { toggleLike } from 'api/likes-api/toggle-like';
import { MapFocus } from 'types/map-focus';
import { Park } from 'types/park';
import { MyIcon } from 'views/components/atoms/my-icon';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import { DynamicAlignedText } from 'views/components/atoms/dynamic-aligned-text';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loadingArticleState: 'waiting',
      loadingGoodState: 'waiting',
      haveAddedGood: false,
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
      this.checkLikeStatus();
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

    const { title, description, marker, image, author, isDraft, category } = article;

    const categoryName = categoryMapper(category);

    const pageTitle = `【${categoryName}】${title}`;

    return (
      <>
        <CommonHelmet
          title={pageTitle}
          description={description}
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

          <DynamicAlignedText
            component="h2"
            variant="h4"
            sx={{
              wordBreak: 'break-all',
            }}
          >
            {title}
          </DynamicAlignedText>

          <Typography component="div" color="gray" sx={{ textDecoration: 'underline' }}>
            <IconAndText
              iconComponent={<FolderIcon />}
              text={categoryName}
              align="left"
              iconPosition="left"
              to={CATEGORY_PAGE_LINK(category.toString())}
            />
          </Typography>

          <Box sx={createdAtBox}>{this.renderDates(article)}</Box>

          <Divider />

          {image && <Image src={image} width="full" />}

          <Typography whiteSpace="pre-wrap" fontSize={18}>
            {description}
          </Typography>

          <Divider />

          <IconAndText
            iconComponent={<MyIcon variant="map-marker" />}
            text="地図"
            component="h3"
            variant="h5"
            iconPosition="left"
          />

          <AreaNames areaNames={marker.areaNames} />

          <NonStyleLink to={MAP_PAGE_LINK}>
            <TriviaMap
              height={300}
              initZoom={ZOOMS.miniMap}
              initCenter={marker}
              disabled
              doNotShowPostMarkers
              additinalMarkers={[marker]}
              park={marker.park}
            />
          </NonStyleLink>

          <Divider />

          <Grid container pb={5} justifyContent="space-between">
            <Grid item>{this.renderLikeButton()}</Grid>
            <Grid item>{this.renderGoodButton()}</Grid>
          </Grid>

          <ShareButtons title={pageTitle} url={window.location.href} />
        </Stack>
      </>
    );
  };

  protected fetchArticle = async () => {
    this.setState({
      article: undefined,
      loadingArticleState: 'loading',
      numberOfGoods: undefined,
    });
    try {
      const res = await autoRefreshApiWrapper(
        () => getRemoteArticle(this.props.postId),
        this.props.refreshUser,
      );
      this.setState({
        article: res,
        loadingArticleState: 'success',
        numberOfGoods: res.numberOfGoods,
        haveAddedGood: res.haveAddedGood,
      });

      this.props.updateInitMapFocus({
        lat: res.marker.lat,
        lng: res.marker.lng,
        zoom: ZOOMS.popupOpen,
      });
      if (this.props.focusingPark !== res.marker.park) {
        this.props.initializeFetchingState();
      }
      this.props.updateFocusingPark(res.marker.park);
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
          to={EDIT_LINK(this.props.postId.toString())}
          onClick={this.props.initialize}
        />
      </Link>
    );
  };

  protected renderGoodButton = () => {
    const { haveAddedGood, numberOfGoods, loadingGoodState } = this.state;

    return (
      <Box textAlign="right">
        <LoadingButton
          startIcon={haveAddedGood ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
          variant={haveAddedGood ? 'contained' : 'outlined'}
          loading={loadingGoodState === 'loading'}
          onClick={this.handleClickGoodButton}
        >
          {numberOfGoods === 0 ? 'いいね' : numberOfGoods}
        </LoadingButton>
      </Box>
    );
  };

  protected renderLikeButton = () => {
    const { haveLiked, loadingLikeState } = this.state;

    if (!this.props.user) {
      return null;
    }

    return (
      <Box textAlign="right">
        <LoadingButton
          startIcon={haveLiked ? <BookmarkIcon /> : <BookmarkBorderOutlinedIcon />}
          variant={haveLiked ? 'contained' : 'outlined'}
          loading={loadingLikeState === 'loading'}
          onClick={this.handleClickLikeButton}
          color="warning"
        >
          {haveLiked ? 'お気に入り済み' : 'お気に入り追加'}
        </LoadingButton>
      </Box>
    );
  };

  protected handleClickGoodButton = async () => {
    this.setState({
      loadingGoodState: 'loading',
    });

    try {
      const res = await toggleGood(this.props.postId);
      this.setState({
        haveAddedGood: res.haveAddedGood,
        loadingGoodState: 'success',
        numberOfGoods: res.numberOfGoods,
      });
    } catch (error) {
      this.props.throwError(500);
    }
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
      });
    } catch (error) {
      this.props.throwError(500);
    }
  };

  protected renderDates = (article: GetArticleResponse) => {
    const { createdAt, updatedAt, isDraft } = article;

    if (isDraft) {
      if (createdAt === updatedAt) {
        return <Typography>{`投稿日 ${createdAt}`}</Typography>;
      } else {
        return <Typography>{`投稿日 ${updatedAt}`}</Typography>;
      }
    }

    return (
      <>
        <Typography>{`投稿日 ${createdAt}`}</Typography>
        {createdAt !== updatedAt && <Typography>{`更新日 ${updatedAt}`}</Typography>}
      </>
    );
  };
}

export type Props = {
  postId: number;
  user?: User;
  focusingPark?: Park;

  initialize: () => void;
  throwError: (errorStatus: number) => void;
  refreshUser: () => void;
  updateInitMapFocus: (mapFocus: MapFocus) => void;
  updateFocusingPark: (park: Park) => void;
  initializeFetchingState: () => void;
};

export type State = {
  article?: GetArticleResponse;
  loadingArticleState: LoadingState;
  loadingGoodState: LoadingState;
  numberOfGoods?: number;
  haveAddedGood: boolean;
  loadingLikeState: LoadingState;
  haveLiked: boolean;
};
