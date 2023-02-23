import React from 'react';
import {
  Pagination,
  Stack,
  Typography,
  Card,
  Box,
  CardMedia,
  CardContent,
  Grid,
  Divider,
} from '@mui/material';
import { LoadingState } from 'types/loading-state';
import {
  getArticlesPreviews,
  GetArticlesPreviewsParam,
  GetArticlesPreviewsResponse,
} from 'api/articles-api/get-articles-previews';
import { Link } from 'react-router-dom';
import { Image } from 'views/components/moleculars/image';
import classes from './index.module.css';
import * as sxProps from './styles';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import { ARTICLE_PAGE_LINK } from 'constant/links';
import { categoryMapper } from 'utils/category-mapper';
import notImage from 'images/no-image-16x7.jpg';
import FolderIcon from '@mui/icons-material/Folder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const POPUP_SCROLL_HEIGHT = '240px';
const POPUP_SCROLL_GRADATION_HEIGHT = '50px';

export class Renderer extends React.Component<Props, State> {
  topRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      loadingState: 'waiting',
    };

    this.topRef = React.createRef();
  }

  componentDidMount() {
    this.fetchArticlesPreviews();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      JSON.stringify(prevProps.searchConditions) !== JSON.stringify(this.props.searchConditions)
    ) {
      this.fetchArticlesPreviews();
    }
  }

  render() {
    const { variant } = this.props;

    return (
      <>
        <div ref={this.topRef}></div>
        <Stack spacing={variant === 'popup' ? 1 : 3}>
          {variant === 'large' && this.renderPagination()}
          {this.renderPreviewList()}
          {this.renderPagination()}
        </Stack>
      </>
    );
  }

  protected renderPreviewList() {
    const { loadingState, articlesPreviews } = this.state;
    if (loadingState === 'waiting' || loadingState === 'loading') {
      return <CenterSpinner />;
    }

    if (articlesPreviews?.results.length === 0) {
      return <Typography align="center">表示する投稿がありません。</Typography>;
    }

    const previewList = articlesPreviews?.results.map((preview) => {
      const { postId, title, image, category, createdAt, numberOfGoods } = preview;

      let card = null;
      switch (this.props.variant) {
        case 'popup':
          card = this.renderPopupCard(title, image, category, numberOfGoods);
          break;
        case 'large':
          card = this.renderLargeCard(title, image, category, createdAt, numberOfGoods);
          break;
        case 'sidebar':
          card = this.renderSidebarCard(title, image);
      }

      return (
        <Box key={`preview-list-${postId}`}>
          <Link
            to={ARTICLE_PAGE_LINK(String(postId))}
            key={`preview-${postId}`}
            className={classes['preview-link']}
          >
            {card}
          </Link>
        </Box>
      );
    });

    if (this.props.variant === 'popup') {
      return (
        <Box maxHeight={POPUP_SCROLL_HEIGHT} sx={{ position: 'relative' }}>
          <Box maxHeight={POPUP_SCROLL_HEIGHT} sx={{ overflow: 'scroll' }}>
            <Stack spacing={2} sx={{ pb: POPUP_SCROLL_GRADATION_HEIGHT }}>
              {previewList}
            </Stack>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.8))',
              width: '100%',
              height: POPUP_SCROLL_GRADATION_HEIGHT,
              bottom: 0,
              left: 0,
            }}
          />
        </Box>
      );
    } else {
      return <Stack spacing={this.props.variant === 'large' ? 3 : 1}>{previewList}</Stack>;
    }
  }

  protected renderPopupCard = (
    title: string,
    imageUrl: string | null,
    category: number,
    numberOfGoods: number,
  ) => {
    return (
      <Card sx={{ ...sxProps.card, p: 1 }}>
        <Stack spacing={1}>
          <Typography component="h2" variant="h6" align="center" sx={{ wordBreak: 'break-all' }}>
            {title}
          </Typography>

          {imageUrl && (
            <Box textAlign="center">
              <Image src={imageUrl} width="200px" height="100px" objectFit="cover" borderRadius />
            </Box>
          )}

          <Divider />

          <Box>
            <Typography sx={{ pr: 2 }} component="div">
              <IconAndText
                iconComponent={<FolderIcon />}
                text={categoryMapper(category)}
                iconPosition={'left'}
                align="right"
                fontSize={12}
              />
            </Typography>

            {numberOfGoods > 0 && (
              <Typography sx={{ pr: 2 }} component="div">
                <IconAndText
                  iconComponent={<ThumbUpIcon fontSize="inherit" />}
                  text={String(numberOfGoods)}
                  iconPosition={'left'}
                  align="right"
                  fontSize={14}
                />
              </Typography>
            )}
          </Box>

          <Typography align="center">
            <IconAndText
              iconComponent={<ArrowRightIcon />}
              text="くわしく読む"
              component="span"
              variant="button"
              iconPosition="left"
            />
          </Typography>
        </Stack>
      </Card>
    );
  };

  protected renderLargeCard = (
    title: string,
    imageUrl: string | null,
    category: number,
    createdAt: string,
    numberOfGoods: number,
  ) => {
    return (
      <Card sx={sxProps.card}>
        <CardMedia component="img" className={classes['card-media']} image={imageUrl ?? notImage} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h3" sx={{ wordBreak: 'break-all' }}>
            {title}
          </Typography>

          <Typography sx={{ mb: 1 }} component="div">
            <IconAndText
              iconComponent={<FolderIcon />}
              text={categoryMapper(category)}
              iconPosition={'left'}
              align="left"
            />
          </Typography>

          {numberOfGoods > 0 && (
            <Typography sx={{ mb: 1 }} component="div">
              <IconAndText
                iconComponent={<ThumbUpIcon />}
                text={String(numberOfGoods)}
                iconPosition="left"
                align="left"
              />
            </Typography>
          )}

          <Typography sx={{ mb: 2 }} component="div">
            <IconAndText
              iconComponent={<AccessTimeIcon />}
              text={createdAt}
              iconPosition={'left'}
              align="right"
            />
          </Typography>

          <Typography align="center" component="div">
            <IconAndText
              iconComponent={<ArrowRightIcon />}
              text="くわしく読む"
              component="span"
              iconPosition="left"
            />
          </Typography>
        </CardContent>
      </Card>
    );
  };

  protected renderSidebarCard = (title: string, imageUrl: string | null) => {
    return (
      <Card sx={sxProps.card}>
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={5}>
              <Image src={imageUrl ?? notImage} width="full" height="100px" objectFit="cover" />
            </Grid>
            <Grid item xs={7}>
              <Typography
                gutterBottom
                variant="body1"
                component="h3"
                sx={{ wordBreak: 'break-all' }}
              >
                {title}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  protected renderPagination() {
    const { variant } = this.props;

    if (!this.state.articlesPreviews || variant === 'sidebar') {
      return null;
    }

    const { totalPages, currentPage, totalRecords, startIndex, endIndex } =
      this.state.articlesPreviews;

    let showPagination = true;
    let showPageNumbers = true;

    if (totalPages <= 1) {
      showPagination = false;
    }

    if (startIndex === endIndex) {
      showPageNumbers = false;
    }

    return (
      <Stack spacing={1}>
        {showPageNumbers && (
          <Typography
            align={variant === 'popup' ? 'right' : 'center'}
            fontSize={variant === 'popup' ? 14 : 16}
            component="div"
          >
            {startIndex}〜{endIndex}件 / 全{totalRecords}件
          </Typography>
        )}
        {showPagination && (
          <div className={classes['pagination-wrapper']}>
            <Pagination
              count={this.state.articlesPreviews?.totalPages}
              page={currentPage}
              onChange={this.handleChangePagination}
              size={variant === 'popup' ? 'small' : 'large'}
              siblingCount={0}
              boundaryCount={1}
            />
          </div>
        )}
      </Stack>
    );
  }

  protected async fetchArticlesPreviews(page?: number) {
    this.setState({
      loadingState: 'loading',
      articlesPreviews: undefined,
    });

    try {
      const res = await getArticlesPreviews({
        page: page,
        ...this.props.searchConditions,
      });

      this.setState({
        loadingState: 'success',
        articlesPreviews: res,
      });
    } catch (error) {
      this.props.throwError(500);
    }
  }

  protected handleChangePagination = (event: React.ChangeEvent<unknown>, page: number) => {
    this.fetchArticlesPreviews(page);
    this.topRef.current && this.topRef.current.scrollIntoView({ block: 'center' });
  };
}

export type Props = {
  variant: 'popup' | 'large' | 'sidebar';
  searchConditions: Omit<GetArticlesPreviewsParam, 'page'>;

  throwError: (status: number) => void;
  refreshUser: () => void;
};

export type State = {
  loadingState: LoadingState;
  articlesPreviews?: GetArticlesPreviewsResponse;
};
