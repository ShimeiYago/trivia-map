import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { FloatingButton } from 'views/components/atoms/floating-button';
import { SwipeableEdgeDrawer } from 'views/components/moleculars/swipeable-edge-drawer';
import { ArticleForm } from 'views/components/organisms/article-form';
import { CloseFormButton } from 'views/components/organisms/close-form-button';
import { GlobalMessage } from 'views/components/organisms/global-messge';
import { LoadingProgressBar } from 'views/components/organisms/loading-progress-bar';
import { TriviaMap } from 'views/components/organisms/trivia-map';
import {
  rightDrawerStyle,
  mapWrapper,
  wrapper,
  parkSelectBox,
  categoryButtonsPC,
  categoryButtonsMobile,
} from './styles';
import { GlobalMenu } from 'views/components/organisms/global-menu';
import { Park } from 'types/park';
import { RoundButton } from 'views/components/atoms/round-button';
import { CATEGORIES } from 'constant';
import { EDIT_LINK } from 'constant/links';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openFormModal: props.isFormEditting,
      newMarkerMode: false,
      openDialogToConfirmDeleting: false,
      openDoubleEditAlartDialog: false,
      edittingPostId: props.postIdToEdit,
      park: 'S',
    };
  }

  componentDidMount() {
    if (this.props.postIdToEdit) {
      this.setState({
        openFormModal: true,
      });
      history.replaceState('', '', EDIT_LINK(`${this.props.postIdToEdit}`));
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevProps.isFormChangedFromLastSaved && this.props.isFormChangedFromLastSaved) {
      window.addEventListener('beforeunload', this.handleBeforeUnload);
    }
    if (prevProps.isFormChangedFromLastSaved && !this.props.isFormChangedFromLastSaved) {
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }

    if (!this.props.isFormEditting && prevState.openFormModal && !this.state.openFormModal) {
      history.replaceState('', '', '/');
    }
  }

  protected handleBeforeUnload(e: BeforeUnloadEvent) {
    e.preventDefault();
    e.returnValue = '未保存のデータがありますが、本当に閉じてもよろしいですか？';
  }

  render() {
    const { openFormModal, edittingPostId, park, selectedCategoryId } = this.state;
    const { isFormEditting, isMobile } = this.props;
    return (
      <Box sx={wrapper(openFormModal && !isMobile)}>
        <GlobalMenu topBarPosition="static" mapPage>
          <Box sx={mapWrapper(isMobile)}>
            <TriviaMap
              newMarkerMode={this.state.newMarkerMode}
              endToSelectPosition={this.endToSelectPosition}
              hiddenMarkerIds={edittingPostId ? [edittingPostId] : []}
              shouldCurrentPositionAsyncWithForm
              park={park}
              categoryId={selectedCategoryId}
            />

            {!isFormEditting && (
              <FloatingButton icon="add-marker" onClick={this.handleClickAddButton} />
            )}

            <LoadingProgressBar />

            {this.renderParkSelectBox()}

            {this.renderCategoryButtons()}
          </Box>
        </GlobalMenu>

        {this.renderEditForm()}

        <GlobalMessage closeFormModal={this.handleCloseFormModal} />

        {this.renderDoubleEditAlartDialog()}
      </Box>
    );
  }

  protected renderParkSelectBox = () => {
    const { isMobile } = this.props;
    const { park, openFormModal } = this.state;

    return (
      <Box sx={parkSelectBox(!isMobile && openFormModal, isMobile, park)}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography fontSize="0.875rem">ランド</Typography>
          <Switch
            checked={park === 'S'}
            onChange={this.handleChangePark}
            size="small"
            color="primary"
          />
          <Typography fontSize="0.875rem">シー</Typography>
        </Stack>
      </Box>
    );
  };

  protected renderCategoryButtons = () => {
    const { isMobile } = this.props;

    const buttons = CATEGORIES.map((category, index) => (
      <RoundButton
        key={`category-button-${index}`}
        selected={this.state.selectedCategoryId === category.categoryId}
        onClick={this.handleClickCategoryButton(category.categoryId)}
      >
        {category.categoryName}
      </RoundButton>
    ));

    if (isMobile) {
      return (
        <Stack direction="row" spacing={1} sx={categoryButtonsMobile}>
          {buttons}
        </Stack>
      );
    }

    return (
      <Box sx={categoryButtonsPC(!isMobile && this.state.openFormModal)}>
        <Stack direction="row" spacing={1} justifyContent="center">
          {buttons}
        </Stack>
      </Box>
    );
  };

  protected handleChangePark = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      park: event.target.checked ? 'S' : 'L',
    });
  };

  protected handleClickCategoryButton = (categoryId: number) => () => {
    this.setState({
      selectedCategoryId: this.state.selectedCategoryId === categoryId ? undefined : categoryId,
    });
  };

  protected handleClickAddButton = () =>
    this.setState({
      openFormModal: true,
      edittingPostId: undefined,
    });

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
    });
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
    const { edittingPostId, openFormModal, park } = this.state;
    const { isFormEditting, isMobile } = this.props;

    const closeButton = <CloseFormButton onClose={this.handleCloseFormModal} />;

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
          park={park}
        />
      </SwipeableEdgeDrawer>
    ) : (
      <Drawer sx={rightDrawerStyle} variant="persistent" anchor="right" open={openFormModal}>
        {openFormModal && (
          <ArticleForm
            postId={edittingPostId}
            onClickSelectPosition={this.startToSelectPosition}
            onClose={this.handleCloseFormModal}
            park={park}
          />
        )}
      </Drawer>
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
}

export type Props = {
  isFormEditting: boolean;
  isMobile: boolean;
  isFormChangedFromLastSaved: boolean;
  postIdToEdit?: number;
};

export type State = {
  openFormModal: boolean;
  readingArticleId?: number;
  edittingPostId?: number;
  newMarkerMode: boolean;
  openDialogToConfirmDeleting: boolean;
  openDoubleEditAlartDialog: boolean;
  park: Park;
  selectedCategoryId?: number;
};
