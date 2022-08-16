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
            <Link to={ARTICLE_PAGE_LINK(String(postId))}>{title}</Link>
          </TableCell>
          <TableCell>
            <Link to={EDIT_LINK(String(postId))}>
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
}

export type Props = {
  throwError: (status: number) => void;
};

export type State = {
  loadingState: LoadingState;
  totalPages?: number;
  articlesPreviews?: GetMyArticlesResponseEachItem[];
};
