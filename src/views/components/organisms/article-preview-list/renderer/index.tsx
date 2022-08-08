import React from 'react';
import { Pagination, Stack, Typography, Card, Alert, Box } from '@mui/material';
import { LoadingState } from 'types/loading-state';
import {
  getArticlesPreviews,
  GetArticlesPreviewsParam,
  GetArticlesPreviewsResponseEachItem,
} from 'api/articles-api/get-articles-previews';
import { ApiError } from 'api/utils/handle-axios-error';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { Link } from 'react-router-dom';
import { Image } from 'views/components/atoms/image';
import classes from './index.module.css';
import * as sxProps from './styles';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import { ARTICLE_PAGE_LINK } from 'constant/links';

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

  render() {
    return (
      <Stack spacing={2}>
        {this.renderPreviewList()}
        {this.renderPagination()}
      </Stack>
    );
  }

  protected renderPreviewList() {
    const { loadingState, articlesPreviews, errorMessage } = this.state;
    if (loadingState === 'waiting' || loadingState === 'loading') {
      return <CenterSpinner />;
    }

    if (loadingState === 'error') {
      return <Alert severity="error">{errorMessage}</Alert>;
    }

    if (articlesPreviews?.length === 0) {
      return <Typography align="center">表示する投稿がありません。</Typography>;
    }

    const previewList = articlesPreviews?.map((preview) => {
      const { postId, title, imageUrl } = preview;

      return (
        <Link
          to={ARTICLE_PAGE_LINK(String(postId))}
          key={`preview-${postId}`}
          className={classes['preview-link']}
        >
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
        </Link>
      );
    });

    return (
      <Box maxHeight={300} sx={{ overflow: 'scroll', py: 1 }}>
        <Stack spacing={2}>{previewList}</Stack>
      </Box>
    );
  }

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
      errorMessage: undefined,
    });

    try {
      const res = await getArticlesPreviews({
        page: page,
        ...this.props,
      });

      this.setState({
        loadingState: 'success',
        totalPages: res.totalPages,
        articlesPreviews: res.results,
      });
    } catch (error) {
      const apiError = error as ApiError<unknown>;
      const errorMsg = globalAPIErrorMessage(apiError.status, 'get');

      this.setState({
        loadingState: 'error',
        errorMessage: errorMsg,
      });
    }
  }

  protected handleChangePagination = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    this.fetchArticlesPreviews(page);
  };
}

export type Props = Omit<GetArticlesPreviewsParam, 'page'>;

export type State = {
  loadingState: LoadingState;
  totalPages?: number;
  articlesPreviews?: GetArticlesPreviewsResponseEachItem[];
  errorMessage?: string;
};
