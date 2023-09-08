import React from 'react';
import {
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
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
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import { ARTICLE_PAGE_LINK, EDIT_LINK, MY_ARTICLES_LINK } from 'constant/links';
import { autoRefreshApiWrapper } from 'utils/auto-refresh-api-wrapper';
import { deleteRemoteArticle } from 'api/articles-api/delete-remote-article';
import { ApiError } from 'api/utils/handle-axios-error';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { categoryMapper } from 'utils/category-mapper';
import { LoadingButton } from '@mui/lab';
import { patchRemoteArticle } from 'api/articles-api/patch-remote-article';
import { CATEGORIES } from 'constant';
import { getUrlParameters } from 'utils/get-url-parameters';
import { ManageTable, ManageTableContent } from 'views/components/moleculars/manage-table';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loadingState: 'waiting',
      deleting: false,
      swichingDraft: false,
      searchParam: props.initialSearchParam,
    };
  }

  componentDidMount() {
    this.fetchArticlesPreviews();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (JSON.stringify(prevState.searchParam) !== JSON.stringify(this.state.searchParam)) {
      const urlParameters = getUrlParameters(this.state.searchParam);
      history.replaceState('', '', `${MY_ARTICLES_LINK}${urlParameters}`);
    }
  }

  render() {
    return (
      <>
        {this.renderSearchOptions()}

        {this.renderTable()}
        {this.renderSwitchDraftStatusConfirmMessage()}
        {this.renderMessage()}
      </>
    );
  }

  renderTable() {
    const { loadingState, articlesPreviews } = this.state;
    if (loadingState === 'waiting' || loadingState === 'loading' || !articlesPreviews) {
      return <CenterSpinner />;
    }

    if (articlesPreviews?.results.length === 0) {
      return <Typography align="center">まだ記事が投稿されていません。</Typography>;
    }

    const contents: ManageTableContent[] = articlesPreviews.results.map((preview) => {
      return {
        title: preview.title,
        isDraft: preview.isDraft,
        onChangeDraftStatus: preview.isDraft ? this.handleChangeDraftStatus(preview) : undefined,
        category: categoryMapper(preview.category),
        image: preview.image,
        numberOfGoods: preview.numberOfGoods,
        viewLink: ARTICLE_PAGE_LINK(String(preview.postId)),
        editLink: EDIT_LINK(String(preview.postId)),
        onClickEdit: this.props.initialize,
        onDelete: this.deleteArticle(preview.postId, preview.title),
      };
    });

    return (
      <ManageTable
        isMobile={this.props.isMobile}
        pagination={articlesPreviews}
        onChangePagination={this.handleChangePagination}
        contents={contents}
        getDraftText={this.getDraftText}
        deleting={this.state.deleting}
      />
    );
  }

  protected getDraftText(isDraft: boolean) {
    return isDraft ? '下書き' : '公開';
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

  protected async fetchArticlesPreviews() {
    this.setState({
      loadingState: 'loading',
      articlesPreviews: undefined,
    });

    try {
      const res = await autoRefreshApiWrapper(
        () => getMyArticles(this.state.searchParam),
        this.props.refreshUser,
      );

      this.setState({
        loadingState: 'success',
        articlesPreviews: res,
      });
    } catch (error) {
      const apiError = error as ApiError<unknown>;
      this.props.throwError(apiError.status);
    }
  }

  protected handleChangePagination = (event: React.ChangeEvent<unknown>, page: number) => {
    this.setState(
      {
        searchParam: {
          ...this.state.searchParam,
          page,
        },
      },
      this.fetchArticlesPreviews,
    );
  };

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
      this.fetchArticlesPreviews();
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
          page: 1,
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
          page: 1,
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
          page: 1,
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
  initialSearchParam: GetMyArticlesParam;
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
  searchParam: GetMyArticlesParam;
  message?: {
    text: string;
    type: 'error' | 'success';
  };
};
