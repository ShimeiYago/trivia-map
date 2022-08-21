import React from 'react';
import {
  Pagination,
  Stack,
  Typography,
  Card,
  Box,
  CardMedia,
  CardContent,
} from '@mui/material';
import { LoadingState } from 'types/loading-state';
import {
  getArticlesPreviews,
  GetArticlesPreviewsParam,
  GetArticlesPreviewsResponseEachItem,
} from 'api/articles-api/get-articles-previews';
import { Link } from 'react-router-dom';
import { Image } from 'views/components/atoms/image';
import classes from './index.module.css';
import * as sxProps from './styles';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import { ARTICLE_PAGE_LINK } from 'constant/links';
import { categoryMapper } from 'utils/category-mapper';
import notImage from 'images/no-image-16x7.jpg';
import FolderIcon from '@mui/icons-material/Folder';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loadingState: 'waiting',
    };
  }

  componentDidMount() {
    this.fetchArticlesPreviews();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      JSON.stringify(prevProps.searchConditions) !==
      JSON.stringify(this.props.searchConditions)
    ) {
      this.fetchArticlesPreviews();
      this.setState({
        totalPages: undefined,
      });
    }
  }

  render() {
    return (
      <Stack spacing={2}>
        {this.renderPreviewList()}
        {this.renderPagination()}
      </Stack>
    );
  }

  protected renderPreviewList() {
    const { loadingState, articlesPreviews } = this.state;
    if (loadingState === 'waiting' || loadingState === 'loading') {
      return <CenterSpinner />;
    }

    if (articlesPreviews?.length === 0) {
      return <Typography align="center">表示する投稿がありません。</Typography>;
    }

    const previewList = articlesPreviews?.map((preview) => {
      const { postId, title, image, category } = preview;

      return (
        <Link
          to={ARTICLE_PAGE_LINK(String(postId))}
          key={`preview-${postId}`}
          className={classes['preview-link']}
        >
          {this.props.variant === 'popup'
            ? this.renderPopupCard(title, image, category)
            : this.renderLargeCard(title, image, category)}
        </Link>
      );
    });

    if (this.props.variant === 'popup') {
      return (
        <Box maxHeight={300} sx={{ overflow: 'scroll', py: 1 }}>
          <Stack spacing={2}>{previewList}</Stack>
        </Box>
      );
    } else {
      return <Stack spacing={3}>{previewList}</Stack>;
    }
  }

  protected renderPopupCard = (
    title: string,
    imageUrl: string | null,
    category: number,
  ) => {
    return (
      <Card sx={sxProps.card}>
        <Stack spacing={1}>
          <Typography component="h2" variant="h6" align="center">
            {title}
          </Typography>

          {imageUrl && (
            <Typography align="center">
              <Image
                src={imageUrl}
                width="200px"
                height="100px"
                objectFit="cover"
                borderRadius
              />
            </Typography>
          )}

          <Typography sx={{ pr: 2 }} component="div">
            <IconAndText
              iconComponent={<FolderIcon />}
              text={categoryMapper(category)}
              iconPosition={'left'}
              align="right"
              fontSize={14}
            />
          </Typography>

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
  ) => {
    return (
      <Card sx={{ mx: 'auto', maxWidth: 700 }}>
        <CardMedia
          component="img"
          className={classes['card-media']}
          image={imageUrl ?? notImage}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography align="left" sx={{ mb: 2 }} component="div">
            <IconAndText
              iconComponent={<FolderIcon />}
              text={categoryMapper(category)}
              iconPosition={'left'}
              align="left"
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

  protected renderPagination() {
    const showPagination = this.state.totalPages && this.state.totalPages > 1;
    if (!showPagination) {
      return null;
    }

    return (
      <div className={classes['pagination-wrapper']}>
        <Pagination
          count={this.state.totalPages}
          onChange={this.handleChangePagination}
        />
      </div>
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
        totalPages: res.totalPages,
        articlesPreviews: res.results,
      });
    } catch (error) {
      this.props.throwError(500);
    }
  }

  protected handleChangePagination = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    this.fetchArticlesPreviews(page);
  };
}

export type Props = {
  variant: 'popup' | 'large';
  searchConditions: Omit<GetArticlesPreviewsParam, 'page'>;

  throwError: (status: number) => void;
};

export type State = {
  loadingState: LoadingState;
  totalPages?: number;
  articlesPreviews?: GetArticlesPreviewsResponseEachItem[];
};
