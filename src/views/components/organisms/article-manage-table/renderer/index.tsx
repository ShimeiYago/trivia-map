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
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  Grid,
  InputLabel,
} from '@mui/material';
import { LoadingState } from 'types/loading-state';
import {
  getMyArticles,
  GetMyArticlesParam,
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
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { patchRemoteArticle } from 'api/articles-api/patch-remote-article';
import { CATEGORIES } from 'constant';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loadingState: 'waiting',
      deleting: false,
      swichingDraft: false,
      searchParam: {},
    };
  }

  componentDidMount() {
    this.fetchArticlesPreviews();
  }

  render() {
    return (
      <>
        {this.renderSearchOptions()}

        {this.renderTable()}
        {this.renderDeleteConfirmDialog()}
        {this.renderSwitchDraftStatusConfirmMessage()}
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
          <TableCell>
            <FormControl variant="standard">
              <Select value={String(isDraft)} onChange={this.handleChangeDraftStatus(preview)}>
                <MenuItem value="false">
                  <Typography fontSize={14}>公開</Typography>
                </MenuItem>
                <MenuItem value="true">
                  <Typography fontSize={14}>下書き</Typography>
                </MenuItem>
              </Select>
            </FormControl>
          </TableCell>
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
              <Box marginBottom={2}>
                <FormControl variant="standard">
                  <Select value={String(isDraft)} onChange={this.handleChangeDraftStatus(preview)}>
                    <MenuItem value="false">
                      <Typography variant="subtitle2">公開</Typography>
                    </MenuItem>
                    <MenuItem value="true">
                      <Typography variant="subtitle2">下書き</Typography>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>

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
      const res = await autoRefreshApiWrapper(
        () => getMyArticles({ page, ...this.state.searchParam }),
        this.props.refreshUser,
      );

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

  protected renderSwitchDraftStatusConfirmMessage() {
    const { switchDraftDialog, swichingDraft } = this.state;
    if (!switchDraftDialog) {
      return null;
    }

    const { title, isDraft, postId } = switchDraftDialog;
    const message = isDraft
      ? `投稿「${title}」を下書き（非公開）に切り替えますか？`
      : `投稿「${title}」を公開しますか？`;

    return (
      <Dialog open onClose={this.closeSwitchDraftConfirmDialog}>
        <DialogTitle sx={{ wordBreak: 'break-all' }}>{message}</DialogTitle>
        <DialogActions>
          <Button onClick={this.closeSwitchDraftConfirmDialog}>いいえ</Button>
          <LoadingButton
            onClick={this.switchDraftStatus(postId, isDraft, title)}
            autoFocus
            loading={swichingDraft}
          >
            はい
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

  protected closeSwitchDraftConfirmDialog = () => {
    this.setState({
      switchDraftDialog: undefined,
    });
  };

  protected deleteArticle = (postId: number, title: string) => async () => {
    const { initializeFetchingState, refreshUser } = this.props;

    this.setState({
      message: undefined,
      deleting: true,
    });

    try {
      await autoRefreshApiWrapper(() => deleteRemoteArticle(postId), refreshUser);
      initializeFetchingState();

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

  protected handleChangeDraftStatus =
    (preview: GetMyArticlesResponseEachItem) => (e: SelectChangeEvent) => {
      const { title, postId } = preview;

      this.setState({
        switchDraftDialog: {
          title: title,
          isDraft: e.target.value === 'false' ? false : true,
          postId: postId,
        },
      });
    };

  protected switchDraftStatus = (postId: number, isDraft: boolean, title: string) => async () => {
    const { initializeFetchingState, refreshUser } = this.props;

    this.setState({
      message: undefined,
      swichingDraft: true,
    });

    try {
      await autoRefreshApiWrapper(
        () => patchRemoteArticle({ postId: postId, isDraft: isDraft }),
        refreshUser,
      );
      initializeFetchingState();

      this.setState({
        message: {
          text: isDraft ? `「${title}」を下書きに切り替えました。` : `「${title}」を公開しました。`,
          type: 'success',
        },
        swichingDraft: false,
        switchDraftDialog: undefined,
      });
      this.fetchArticlesPreviews(this.state.articlesPreviews?.currentPage);
    } catch (error) {
      const apiError = error as ApiError<unknown>;
      this.setState({
        message: {
          text: globalAPIErrorMessage(apiError.status, 'submit'),
          type: 'error',
        },
        swichingDraft: false,
        switchDraftDialog: undefined,
      });
    }
  };

  protected renderSearchOptions = () => {
    const { searchParam } = this.state;
    const categoryValue = searchParam.category !== undefined ? String(searchParam.category) : '';

    const menuItems = CATEGORIES.map((category) => (
      <MenuItem key={`category-${category.categoryId}`} value={category.categoryId.toString()}>
        {category.categoryName}
      </MenuItem>
    ));

    const parkValue = searchParam.park !== undefined ? String(searchParam.park) : '';

    const draftValue = searchParam.isDraft !== undefined ? String(searchParam.isDraft) : '';

    return (
      <Grid container spacing={2} marginBottom={3}>
        <Grid item xs={6} sm={4}>
          <FormControl size="small" fullWidth>
            <InputLabel>公開状態</InputLabel>
            <Select value={draftValue} label="公開状態" onChange={this.handleChangeDraft}>
              <MenuItem value="">
                <em>未選択</em>
              </MenuItem>
              <MenuItem value="false">公開中</MenuItem>
              <MenuItem value="true">下書き</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={4}>
          <FormControl size="small" fullWidth>
            <InputLabel>パーク</InputLabel>
            <Select value={parkValue} label="パーク" onChange={this.handleChangePark}>
              <MenuItem value="">
                <em>未選択</em>
              </MenuItem>
              <MenuItem value="L">ランド</MenuItem>
              <MenuItem value="S">シー</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl size="small" fullWidth>
            <InputLabel>カテゴリー</InputLabel>
            <Select value={categoryValue} label="カテゴリー" onChange={this.handleChangeCategory}>
              <MenuItem value="">
                <em>未選択</em>
              </MenuItem>
              {menuItems}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    );
  };

  protected handleChangeCategory = (event: SelectChangeEvent) => {
    this.setState(
      {
        searchParam: {
          ...this.state.searchParam,
          category: event.target.value === '' ? undefined : Number(event.target.value),
        },
      },
      this.fetchArticlesPreviews,
    );
  };

  protected handleChangePark = (event: SelectChangeEvent) => {
    this.setState(
      {
        searchParam: {
          ...this.state.searchParam,
          park: event.target.value === 'L' ? 'L' : event.target.value === 'S' ? 'S' : undefined,
        },
      },
      this.fetchArticlesPreviews,
    );
  };

  protected handleChangeDraft = (event: SelectChangeEvent) => {
    this.setState(
      {
        searchParam: {
          ...this.state.searchParam,
          isDraft:
            event.target.value === 'true'
              ? 'true'
              : event.target.value === 'false'
              ? 'false'
              : undefined,
        },
      },
      this.fetchArticlesPreviews,
    );
  };
}

export type Props = {
  isMobile: boolean;
  throwError: (status: number) => void;
  initializeFetchingState: () => void;
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
  swichingDraft: boolean;
  switchDraftDialog?: {
    postId: number;
    title: string;
    isDraft: boolean;
  };
  articlesPreviews?: GetMyArticlesResponse;
  searchParam: Omit<GetMyArticlesParam, 'page'>;
  message?: {
    text: string;
    type: 'error' | 'success';
  };
};
