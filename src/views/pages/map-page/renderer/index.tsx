import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { FloatingButton } from 'views/components/atoms/floating-button';
import { SwipeableEdgeDrawer } from 'views/components/moleculars/swipeable-edge-drawer';
import { ArticleForm } from 'views/components/organisms/article-form';
import { CloseFormButton } from 'views/components/organisms/close-form-button';
import { GlobalMessage } from 'views/components/organisms/global-messge';
import { TriviaMapMarkersLoadingProgressBar } from 'views/components/organisms/loading-progress-bar';
import { TriviaMap } from 'views/components/organisms/trivia-map';
import {
  verticalScroll,
  categoryBar,
  categoryBarProceedButton,
  authorMapMessage,
  parkSelectBox,
} from './styles';
import { mapWrapper, wrapper } from 'views/common-styles/map-page';
import { GlobalMenu } from 'views/components/organisms/global-menu';
import { Park } from 'types/park';
import { RoundButton } from 'views/components/atoms/round-button';
import { CATEGORIES, PARKS, SITE_NAME } from 'constant';
import { AUTHER_PAGE_LINK, EDIT_LINK, MAP_PAGE_LINK, NEW_LINK } from 'constant/links';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Author } from 'types/author';
import { getAuthorInfo } from 'api/users-api';
import { ApiError } from 'api/utils/handle-axios-error';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { MapFocus } from 'types/map-focus';
import { CommonHelmet } from 'helper-components/common-helmet';
import { PAGE_DESCRIPTIONS } from 'constant/head-tags';
import { ParkSelectBox } from 'views/components/moleculars/park-select-box';
import { SubmitSuccessModal } from 'views/components/organisms/submit-success-modal';
import { RightDrawer } from 'views/components/atoms/right-drawer';

const CATEGORY_BUTTON_ID = (categoryId: number) => `category-button-${categoryId}`;
const INITIAL_PARK = PARKS.sea;

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openFormModal: props.isFormEditting,
      newMarkerMode: false,
      openDialogToConfirmDeleting: false,
      openDoubleEditAlartDialog: false,
      edittingPostId: props.postIdToEdit,
    };

    this.categoryScrollBarRef = React.createRef();
  }

  categoryScrollBarRef: React.RefObject<HTMLDivElement>;

  componentDidMount() {
    if (this.props.postIdToEdit) {
      this.setState({
        openFormModal: true,
      });
      history.replaceState('', '', EDIT_LINK(`${this.props.postIdToEdit}`));
    } else {
      !this.props.park && this.props.updateFoocusingPark(INITIAL_PARK);
    }

    if (this.props.new) {
      this.setState({
        openFormModal: true,
      });
    }

    if (!this.props.postIdToEdit && this.props.isFormEditting) {
      history.replaceState('', '', NEW_LINK);
    }

    if (this.props.isFormChangedFromLastSaved) {
      window.addEventListener('beforeunload', this.handleBeforeUnload);
    }

    if (this.props.userId) {
      this.fetchAuthorInfo(this.props.userId);
    }

    if (!this.props.new && !this.props.postIdToEdit && !this.props.isFormEditting) {
      this.initializeCategoryStatus();
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevProps.isFormChangedFromLastSaved && this.props.isFormChangedFromLastSaved) {
      window.addEventListener('beforeunload', this.handleBeforeUnload);
    }
    if (prevProps.isFormChangedFromLastSaved && !this.props.isFormChangedFromLastSaved) {
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }

    if (prevProps.isFormEditting && !this.props.isFormEditting) {
      this.setState({
        openFormModal: false,
      });
    }

    if (!this.props.isFormEditting && prevState.openFormModal && !this.state.openFormModal) {
      this.replaceUrlWithParam('/');
    }

    if (!prevProps.new && this.props.new) {
      this.setState({
        openFormModal: true,
      });
    }

    if (!prevProps.userId && this.props.userId) {
      this.fetchAuthorInfo(this.props.userId);
    }

    if (
      !this.props.isFormEditting &&
      prevProps.filteringCategoryId !== this.props.filteringCategoryId
    ) {
      this.replaceUrlWithParam(window.location.pathname);
    }
  }

  componentWillUnmount(): void {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }

  protected handleBeforeUnload(e: BeforeUnloadEvent) {
    e.preventDefault();
    e.returnValue = '未保存のデータがありますが、本当に閉じてもよろしいですか？';
  }

  render() {
    const { openFormModal, edittingPostId } = this.state;
    const {
      isFormEditting,
      isMobile,
      park,
      filteringCategoryId,
      windowWidth,
      windowHeight,
      userId,
      initMapFocus,
    } = this.props;

    const triviaMap = windowWidth !== 0 && windowHeight !== 0 && park && (
      <TriviaMap
        newMarkerMode={this.state.newMarkerMode}
        endToSelectPosition={this.endToSelectPosition}
        hiddenMarkerIds={edittingPostId ? [edittingPostId] : []}
        shouldCurrentPositionAsyncWithForm
        park={park}
        categoryId={filteringCategoryId}
        userId={userId}
        initZoom={initMapFocus.zoom}
        initCenter={{ lat: initMapFocus.lat, lng: initMapFocus.lng }}
        keepMapFocus
      />
    );

    return (
      <>
        <CommonHelmet
          title={SITE_NAME}
          description={PAGE_DESCRIPTIONS.main}
          canonicalUrlPath={MAP_PAGE_LINK}
        />

        <Box sx={wrapper(openFormModal && !isMobile)}>
          <GlobalMenu topBarPosition="static" mapPage>
            <Box sx={mapWrapper(isMobile, windowWidth, windowHeight)}>
              {triviaMap}

              {!isFormEditting && !this.props.userId && (
                <FloatingButton
                  color="error"
                  icon="add-marker"
                  text="新しい投稿を追加"
                  size="large"
                  onClick={this.handleClickAddButton}
                />
              )}

              <TriviaMapMarkersLoadingProgressBar />

              {this.renderParkSelectBox()}

              {this.renderCategoryButtons()}

              {this.renderAuthorMapMessage()}
            </Box>
          </GlobalMenu>

          {this.renderEditForm()}

          <GlobalMessage />

          <SubmitSuccessModal />

          {this.renderDoubleEditAlartDialog()}
        </Box>
      </>
    );
  }

  protected initializeCategoryStatus = () => {
    const { filteringCategoryId, queryCategoryId, updateFilteringCategoryId } = this.props;

    let categoryId = undefined;

    if (queryCategoryId !== undefined) {
      updateFilteringCategoryId(queryCategoryId);
      categoryId = queryCategoryId;
    }

    if (filteringCategoryId !== undefined && queryCategoryId === undefined) {
      categoryId = filteringCategoryId;
      this.replaceUrlWithParam(window.location.pathname);
    }

    categoryId !== undefined &&
      document.getElementById(CATEGORY_BUTTON_ID(categoryId))?.scrollIntoView({ inline: 'center' });
  };

  protected renderParkSelectBox = () => {
    const { isMobile, park } = this.props;
    const { openFormModal } = this.state;

    if (!park) {
      return;
    }

    return (
      <Box sx={parkSelectBox(!isMobile && openFormModal, isMobile)}>
        <ParkSelectBox park={park} onChangePark={this.props.updateFoocusingPark} />
      </Box>
    );
  };

  protected renderCategoryButtons = () => {
    const { isMobile, filteringCategoryId } = this.props;

    const buttons = CATEGORIES.map((category) => (
      <RoundButton
        key={CATEGORY_BUTTON_ID(category.categoryId)}
        id={CATEGORY_BUTTON_ID(category.categoryId)}
        selected={filteringCategoryId === category.categoryId}
        onClick={this.handleClickCategoryButton(category.categoryId)}
      >
        {category.categoryName}
      </RoundButton>
    ));

    if (isMobile || this.state.openFormModal) {
      return (
        <Box sx={categoryBar(isMobile, this.state.openFormModal)}>
          <Stack direction="row" spacing={1} sx={verticalScroll} ref={this.categoryScrollBarRef}>
            {buttons}
          </Stack>
          <Box sx={categoryBarProceedButton} onClick={this.handleClickCategoryBarProceed}>
            <ArrowForwardIosIcon />
          </Box>
        </Box>
      );
    }

    return (
      <Box sx={categoryBar(isMobile, this.state.openFormModal)}>
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ py: 1, width: '100%' }}>
          {buttons}
        </Stack>
      </Box>
    );
  };

  protected renderAuthorMapMessage = () => {
    if (!this.props.userId || !this.state.author) {
      return null;
    }

    return (
      <Box sx={authorMapMessage}>
        <Stack direction="row" alignItems="center">
          <IconButton onClick={this.handleClickAuthorClose}>
            <CloseIcon />
          </IconButton>
          <Typography>
            <Link to={AUTHER_PAGE_LINK(String(this.props.userId))}>
              {this.state.author?.nickname}
            </Link>
            さんの投稿
          </Typography>
        </Stack>
      </Box>
    );
  };

  protected handleClickAuthorClose = () => {
    return this.props.navigate(MAP_PAGE_LINK);
  };

  protected fetchAuthorInfo = async (userId: number) => {
    try {
      const author = await getAuthorInfo(userId);
      this.setState({
        author: author,
      });
    } catch (error) {
      const apiError = error as ApiError<unknown>;
      this.props.throwError(apiError.status ?? 500);
    }
  };

  protected handleClickCategoryBarProceed = () => {
    this.categoryScrollBarRef.current?.scrollBy({ left: 100, behavior: 'smooth' });
  };

  protected handleClickCategoryButton = (categoryId: number) => () => {
    this.props.updateFilteringCategoryId(
      this.props.filteringCategoryId === categoryId ? undefined : categoryId,
    );
  };

  protected handleClickAddButton = () => {
    this.setState({
      openFormModal: true,
      edittingPostId: undefined,
    });

    history.replaceState('', '', NEW_LINK);
  };

  protected handleClickPostEdit = () => {
    if (this.props.isFormChangedFromLastSaved) {
      return this.setState({
        openDoubleEditAlartDialog: true,
      });
    }
    return this.setState({
      openFormModal: true,
      edittingPostId: this.state.readingArticleId,
    });
  };

  protected handleClickPostDelete = () => {
    this.setState({
      openDialogToConfirmDeleting: true,
    });
  };

  protected handleCancelToDeleteMarker = () => {
    this.setState({
      openDialogToConfirmDeleting: false,
    });
  };

  protected handleOpenEditForm = () =>
    this.setState({
      openFormModal: true,
    });

  protected handleCloseFormModal = () => {
    this.setState({
      openFormModal: false,
      edittingPostId: undefined,
      newMarkerMode: false,
    });

    this.replaceUrlWithParam(MAP_PAGE_LINK);
  };

  protected handleHideFormModal = () => {
    this.setState({
      openFormModal: false,
    });
  };

  protected startToSelectPosition = () => {
    this.setState({
      openFormModal: false,
      newMarkerMode: true,
    });
  };

  protected endToSelectPosition = () => {
    this.setState({
      openFormModal: true,
      newMarkerMode: false,
    });
  };

  protected renderEditForm = () => {
    const { edittingPostId, openFormModal } = this.state;
    const { isFormEditting, isMobile, park } = this.props;

    const closeButton = <CloseFormButton onClose={this.handleCloseFormModal} />;

    const formPark = park ?? INITIAL_PARK;

    return isMobile ? (
      <SwipeableEdgeDrawer
        show={isFormEditting || openFormModal}
        open={openFormModal}
        onOpen={this.handleOpenEditForm}
        onClose={this.handleHideFormModal}
        edgeLabel={closeButton}
        edgeLabelWhenClosed="編集中"
        heightRatio={80}
      >
        <ArticleForm
          postId={edittingPostId}
          onClickSelectPosition={this.startToSelectPosition}
          park={formPark}
        />
      </SwipeableEdgeDrawer>
    ) : (
      <RightDrawer open={openFormModal} onClose={this.handleCloseFormModal}>
        <ArticleForm
          postId={edittingPostId}
          onClickSelectPosition={this.startToSelectPosition}
          park={formPark}
        />
      </RightDrawer>
    );
  };

  protected renderDoubleEditAlartDialog() {
    return (
      <Dialog
        open={this.state.openDoubleEditAlartDialog}
        onClose={this.handleCloseDoubleEditAlartDialog}
      >
        <DialogTitle>入力内容の変更が保存されていません。</DialogTitle>
        <DialogContent>
          <DialogContentText>
            現在編集中の投稿を「下書き保存」、「保存して公開」、または「編集を破棄」してからもう一度お試しください。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseDoubleEditAlartDialog} variant="outlined">
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  protected handleCloseDoubleEditAlartDialog = () => {
    this.setState({
      openDoubleEditAlartDialog: false,
    });
  };

  protected replaceUrlWithParam = (url: string) => {
    let params = '';
    if (this.props.filteringCategoryId !== undefined) {
      params = `?category=${this.props.filteringCategoryId}`;
    }

    history.replaceState('', '', url + params);
  };
}

export type Props = {
  park?: Park;
  filteringCategoryId?: number;
  queryCategoryId?: number;
  isFormEditting: boolean;
  isMobile: boolean;
  isFormChangedFromLastSaved: boolean;
  postIdToEdit?: number;
  windowWidth: number;
  windowHeight: number;
  new: boolean;
  userId?: number;
  initMapFocus: MapFocus;

  updateFoocusingPark: (park: Park) => void;
  updateFilteringCategoryId: (categoryId?: number) => void;
  navigate: (to: string) => void;
  throwError: (errorStatus: number) => void;
};

export type State = {
  openFormModal: boolean;
  readingArticleId?: number;
  edittingPostId?: number;
  newMarkerMode: boolean;
  openDialogToConfirmDeleting: boolean;
  openDoubleEditAlartDialog: boolean;
  author?: Author;
};
