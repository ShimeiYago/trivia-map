import React from 'react';
import {
  Pagination,
  Stack,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import { LoadingState } from 'types/loading-state';
import {
  getMyArticles,
  GetMyArticlesResponseEachItem,
} from 'api/articles-api/get-my-articles';
import { Link } from 'react-router-dom';
import classes from './index.module.css';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ARTICLE_PAGE_LINK, EDIT_LINK } from 'constant/links';
import { autoRefreshApiWrapper } from 'utils/auto-refresh-api-wrapper';
import { deleteRemoteArticle } from 'api/articles-api/delete-remote-article';
import { ApiError } from 'api/utils/handle-axios-error';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loadingState: 'waiting',
      deleting: false,
    };
  }

  componentDidMount() {
    this.fetchArticlesPreviews();
  }

  render() {
    const { loadingState, articlesPreviews } = this.state;
    if (loadingState === 'waiting' || loadingState === 'loading') {
      return <CenterSpinner />;
    }

    if (articlesPreviews?.length === 0) {
      return (
        <Typography align="center">まだ記事が投稿されていません。</Typography>
      );
    }

    return (
      <>
        <Stack spacing={1}>
          {this.renderPagination()}
          {this.renderTable()}
        </Stack>
        {this.renderMessage()}
      </>
    );
  }

  protected renderTable() {
    const { articlesPreviews, deleting } = this.state;

    const tableRows = articlesPreviews?.map((preview) => {
      const { postId, title } = preview;

      return (
        <TableRow key={`preview-${postId}`}>
          <TableCell>
            <Link to={ARTICLE_PAGE_LINK(String(postId))}>{title}</Link>
          </TableCell>
          <TableCell>
            <Link to={EDIT_LINK(String(postId))} target="_blank">
              <EditIcon />
            </Link>
          </TableCell>
          <TableCell>
            <IconButton
              onClick={this.deleteArticle(postId, title)}
              disabled={deleting}
            >
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>投稿名</TableCell>
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

  protected renderMessage() {
    if (!this.state.message) {
      return null;
    }

    return (
      <Snackbar
        open={true}
        autoHideDuration={6000}
        onClose={this.handleCloseMessage}
      >
        <Alert
          onClose={this.handleCloseMessage}
          severity={this.state.message.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {this.state.message.text}
        </Alert>
      </Snackbar>
    );
  }

  protected async fetchArticlesPreviews(page?: number) {
    this.setState({
      loadingState: 'loading',
      articlesPreviews: undefined,
    });

    try {
      const res = await autoRefreshApiWrapper(() => getMyArticles(page));

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

  protected deleteArticle = (postId: number, title: string) => async () => {
    this.setState({
      message: undefined,
      deleting: true,
    });

    try {
      await autoRefreshApiWrapper(() => deleteRemoteArticle(postId));

      this.setState({
        message: {
          text: `「${title}」を削除しました。`,
          type: 'success',
        },
        deleting: false,
      });
      this.fetchArticlesPreviews();
    } catch (error) {
      const apiError = error as ApiError<unknown>;
      this.setState({
        message: {
          text: globalAPIErrorMessage(apiError.status, 'delete'),
          type: 'error',
        },
        deleting: false,
      });
    }
  };

  protected handleCloseMessage = () => {
    this.setState({
      message: undefined,
    });
  };
}

export type Props = {
  throwError: (status: number) => void;
};

export type State = {
  loadingState: LoadingState;
  deleting: boolean;
  totalPages?: number;
  articlesPreviews?: GetMyArticlesResponseEachItem[];
  message?: {
    text: string;
    type: 'error' | 'success';
  };
};
