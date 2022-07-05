import React from 'react';
import {
  CircularProgress,
  Pagination,
  Stack,
  Typography,
  Card,
} from '@mui/material';
import { LoadingState } from 'types/loading-state';
import {
  getArticlesPreviews,
  PreviewKeyType,
  GetArticlesPreviewsResponseEachItem,
} from 'api/articles-api/get-articles-previews';
import { ApiError } from 'api/utils/handle-axios-error';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { Link } from 'react-router-dom';
import { Image } from 'views/components/atoms/image';
import classes from './index.module.css';
import * as sxProps from './styles';

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
    const { loadingState, articlesPreviews } = this.state;
    if (loadingState === 'waiting' || loadingState === 'loading') {
      return <CircularProgress />;
    }

    if (loadingState === 'error') {
      return <>Error Message (TODO)</>;
    }

    const previewList = articlesPreviews?.map((preview) => {
      const { postId, title, imageUrl } = preview;

      return (
        <Link
          to={`/article/${postId}`}
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
                <Typography variant="button">＞ くわしく読む</Typography>
              </Typography>
            </Stack>
          </Card>
        </Link>
      );
    });

    return <>{previewList}</>;
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
        key: this.props.type,
        keyId: this.props.keyId,
        page: page,
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

export type Props = {
  type: PreviewKeyType;
  keyId?: number;
};

export type State = {
  loadingState: LoadingState;
  totalPages?: number;
  articlesPreviews?: GetArticlesPreviewsResponseEachItem[];
  errorMessage?: string;
};
