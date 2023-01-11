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
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Box,
  Divider,
} from '@mui/material';
import { LoadingState } from 'types/loading-state';
import {
  getMyArticles,
  GetMyArticlesResponse,
  GetMyArticlesResponseEachItem,
} from 'api/articles-api/get-my-articles';
import classes from './index.module.css';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import { Image } from 'views/components/moleculars/image';
import { ARTICLE_PAGE_LINK, EDIT_LINK } from 'constant/links';
import { autoRefreshApiWrapper } from 'utils/auto-refresh-api-wrapper';
import { deleteRemoteArticle } from 'api/articles-api/delete-remote-article';
import { ApiError } from 'api/utils/handle-axios-error';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { NonStyleLink } from 'views/components/atoms/non-style-link';
import { categoryMapper } from 'utils/category-mapper';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import FolderIcon from '@mui/icons-material/Folder';
import { LoadingButton } from '@mui/lab';
import { Park } from 'types/park';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

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
    return (
      <>
        {this.renderTable()}
        {this.renderDeleteConfirmDialog()}
        {this.renderMessage()}
      </>
    );
  }

  renderTable() {
    const { loadingState, articlesPreviews } = this.state;
    if (loadingState === 'waiting' || loadingState === 'loading') {
      return <CenterSpinner />;
    }

    if (articlesPreviews?.results.length === 0) {
      return <Typography align="center">まだ記事が投稿されていません。</Typography>;
    }

    return (
      <Stack spacing={1}>
        {this.renderPagination()}
        {this.props.isMobile ? this.renderMobileTable() : this.renderDesktopTable()}
      </Stack>
    );
  }

  protected renderDesktopTable() {
    const { articlesPreviews } = this.state;

    const tableRows = articlesPreviews?.results.map((preview) => {
      const { postId, isDraft, category, image, numberOfLikes } = preview;

      return (
        <TableRow key={`preview-${postId}`}>
          <TableCell>{this.renderTitleAndButtons(preview)}</TableCell>
          <TableCell>
            <IconAndText
              iconComponent={<FolderIcon fontSize="inherit" />}
              iconPosition="left"
              text={categoryMapper(category)}
              align="left"
              fontSize={14}
            />
          </TableCell>
          <TableCell>{isDraft ? '下書き' : '公開中'}</TableCell>
          <TableCell>
            <IconAndText
              iconComponent={<ThumbUpIcon fontSize="inherit" />}
              iconPosition="left"
              text={String(numberOfLikes)}
              align="left"
            />
          </TableCell>
          <TableCell>
            {image && <Image src={image} objectFit="cover" width="80px" height="80px" />}
          </TableCell>
        </TableRow>
      );
    });

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    );
  }

  protected renderMobileTable() {
    const { articlesPreviews } = this.state;

    const tableRows = articlesPreviews?.results.map((preview) => {
      const { postId, isDraft, category, image, numberOfLikes } = preview;

      return (
        <TableRow key={`preview-${postId}`}>
          <TableCell>
            <Typography color="gray" component="div" marginBottom={1}>
              <Typography variant="subtitle2" marginBottom={1}>
                {isDraft ? '下書き' : '公開中'}
              </Typography>

              <Stack direction="row" spacing={1} justifyContent="space-between">
                <IconAndText
                  iconComponent={<FolderIcon fontSize="inherit" />}
                  iconPosition="left"
                  text={categoryMapper(category)}
                  variant="subtitle2"
                  align="left"
                />
                <IconAndText
                  iconComponent={<ThumbUpIcon fontSize="inherit" />}
                  iconPosition="left"
                  text={String(numberOfLikes)}
                  variant="subtitle2"
                  align="left"
                />
              </Stack>
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="space-between">
              {this.renderTitleAndButtons(preview)}
              <Box>
                {image && <Image src={image} objectFit="cover" width="80px" height="80px" />}
              </Box>
            </Stack>
          </TableCell>
        </TableRow>
      );
    });

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    );
  }

  protected renderTitleAndButtons(preview: GetMyArticlesResponseEachItem) {
    const { postId, title } = preview;

    return (
      <Box height={80}>
        <Stack height={55} justifyContent="center">
          <Typography component="h3" variant="body1" sx={{ wordBreak: 'break-all' }}>
            {title}
          </Typography>
        </Stack>

        <Box marginBottom={0}>
          <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1}>
            <NonStyleLink to={ARTICLE_PAGE_LINK(String(postId))}>
              <Button sx={{ p: 0, minWidth: 0 }}>表示</Button>
            </NonStyleLink>
            <NonStyleLink to={EDIT_LINK(String(postId))}>
              <Button sx={{ p: 0, minWidth: 0 }} onClick={this.props.initialize}>
                編集
              </Button>
            </NonStyleLink>
            <Button
              onClick={this.openDeleteConfirmDialog(postId, title)}
              disabled={this.state.deleting}
              sx={{ p: 0, minWidth: 0 }}
            >
              削除
            </Button>
          </Stack>
        </Box>
      </Box>
    );

    // return (
    //   <Stack justifyContent="space-between" height={80}>
    //     <Typography component="h3" variant="body1" sx={{ mb: 1, wordBreak: 'break-all' }}>
    //       {title}
    //     </Typography>

    //     <Box>
    //       <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1}>
    //         <NonStyleLink to={ARTICLE_PAGE_LINK(String(postId))}>
    //           <Button sx={{ p: 0, minWidth: 0 }}>表示</Button>
    //         </NonStyleLink>
    //         <NonStyleLink to={EDIT_LINK(String(postId))}>
    //           <Button sx={{ p: 0, minWidth: 0 }} onClick={this.props.initialize}>
    //             編集
    //           </Button>
    //         </NonStyleLink>
    //         <Button
    //           onClick={this.openDeleteConfirmDialog(postId, title)}
    //           disabled={this.state.deleting}
    //           sx={{ p: 0, minWidth: 0 }}
    //         >
    //           削除
    //         </Button>
    //       </Stack>
    //     </Box>
    //   </Stack>
    // );
  }

  protected renderPagination() {
    if (!this.state.articlesPreviews) {
      return null;
    }

    const { totalPages, totalRecords, currentPage, startIndex, endIndex } =
      this.state.articlesPreviews;

    const showPagination = totalPages <= 1 ? false : true;

    return (
      <Stack spacing={1}>
        <Typography align="center" fontSize={14} component="div">
          {startIndex}〜{endIndex}件 / 全{totalRecords}件
        </Typography>

        {showPagination && (
          <div className={classes['pagination-wrapper']}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={this.handleChangePagination}
              siblingCount={0}
              boundaryCount={1}
            />
          </div>
        )}
      </Stack>
    );
  }

  protected renderMessage() {
    if (!this.state.message) {
      return null;
    }

    return (
      <Snackbar open={true} autoHideDuration={6000} onClose={this.handleCloseMessage}>
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
      const res = await autoRefreshApiWrapper(() => getMyArticles(page), this.props.refreshUser);

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
  };

  protected renderDeleteConfirmDialog() {
    const { deleteDialog, deleting } = this.state;
    if (!deleteDialog) {
      return null;
    }

    return (
      <Dialog open onClose={this.closeDeleteConfirmDialog}>
        <DialogTitle sx={{ wordBreak: 'break-all' }}>
          投稿「{deleteDialog.title}」を削除しますか？
        </DialogTitle>
        <DialogActions>
          <Button onClick={this.closeDeleteConfirmDialog}>削除しない</Button>
          <LoadingButton
            onClick={this.deleteArticle(deleteDialog.postId, deleteDialog.title)}
            autoFocus
            loading={deleting}
          >
            削除する
          </LoadingButton>
        </DialogActions>
      </Dialog>
    );
  }

  protected openDeleteConfirmDialog = (postId: number, title: string) => () => {
    this.setState({
      deleteDialog: {
        postId: postId,
        title: title,
      },
    });
  };

  protected closeDeleteConfirmDialog = () => {
    this.setState({
      deleteDialog: undefined,
    });
  };

  protected deleteArticle = (postId: number, title: string) => async () => {
    const { park, fetchMarkers, refreshUser } = this.props;

    this.setState({
      message: undefined,
      deleting: true,
    });

    try {
      await autoRefreshApiWrapper(() => deleteRemoteArticle(postId), refreshUser);
      park && fetchMarkers(park);

      this.setState({
        message: {
          text: `「${title}」を削除しました。`,
          type: 'success',
        },
        deleting: false,
        deleteDialog: undefined,
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
        deleteDialog: undefined,
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
  isMobile: boolean;
  park?: Park;
  throwError: (status: number) => void;
  fetchMarkers: (park: Park) => void;
  initialize: () => void;
  refreshUser: () => void;
};

export type State = {
  loadingState: LoadingState;
  deleting: boolean;
  deleteDialog?: {
    postId: number;
    title: string;
  };
  articlesPreviews?: GetMyArticlesResponse;
  message?: {
    text: string;
    type: 'error' | 'success';
  };
};
