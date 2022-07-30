import React from 'react';
import {
  Pagination,
  Stack,
  Typography,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { LoadingState } from 'types/loading-state';
import {
  getArticlesPreviews,
  GetArticlesPreviewsResponseEachItem,
} from 'api/articles-api/get-articles-previews';
import { ApiError } from 'api/utils/handle-axios-error';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { Link } from 'react-router-dom';
import classes from './index.module.css';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
    const { loadingState, articlesPreviews, errorMessage } = this.state;
    if (loadingState === 'waiting' || loadingState === 'loading') {
      return <CenterSpinner />;
    }

    if (loadingState === 'error') {
      return <Alert severity="error">{errorMessage}</Alert>;
    }

    if (articlesPreviews?.length === 0) {
      return (
        <Typography align="center">まだ記事が投稿されていません。</Typography>
      );
    }

    return (
      <Stack spacing={1}>
        {this.renderPagination()}
        {this.renderTable()}
      </Stack>
    );
  }

  protected renderTable() {
    const { articlesPreviews } = this.state;

    const tableRows = articlesPreviews?.map((preview) => {
      const { postId, title } = preview;

      return (
        <TableRow key={`preview-${postId}`}>
          <TableCell>
            <Link to={`/article/${postId}`}>{title}</Link>
          </TableCell>
          <TableCell>
            <Link to={`/edit/${postId}`}>
              <EditIcon />
            </Link>
          </TableCell>
          <TableCell>
            <DeleteIcon />
          </TableCell>
        </TableRow>
      );
    });

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>タイトル（表示）</TableCell>
            <TableCell>編集</TableCell>
            <TableCell>削除</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    );
  }

  protected renderPagination() {
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
        key: 'mine',
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

// eslint-disable-next-line @typescript-eslint/ban-types
export type Props = {};

export type State = {
  loadingState: LoadingState;
  totalPages?: number;
  articlesPreviews?: GetArticlesPreviewsResponseEachItem[];
  errorMessage?: string;
};
