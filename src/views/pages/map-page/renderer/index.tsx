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
} from '@mui/material';
import { FloatingButton } from 'views/components/atoms/floating-button';
import { SwipeableEdgeDrawer } from 'views/components/moleculars/swipeable-edge-drawer';
import { ArticleForm } from 'views/components/organisms/article-form';
import { CloseFormButton } from 'views/components/organisms/close-form-button';
import { GlobalMessage } from 'views/components/organisms/global-messge';
import { LoadingProgressBar } from 'views/components/organisms/loading-progress-bar';
import { TriviaMap } from 'views/components/organisms/trivia-map';
import { rightDrawerStyle, mapWrapper, wrapper } from './styles';
import { GlobalMenu } from 'views/components/organisms/global-menu';

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
  }

  componentDidMount() {
    if (this.props.postIdToEdit) {
      this.setState({
        openFormModal: true,
      });
      history.replaceState('', '', `/edit/${this.props.postIdToEdit}`);
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      !prevProps.isFormChangedFromLastSaved &&
      this.props.isFormChangedFromLastSaved
    ) {
      window.addEventListener('beforeunload', this.handleBeforeUnload);
    }
    if (
      prevProps.isFormChangedFromLastSaved &&
      !this.props.isFormChangedFromLastSaved
    ) {
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }

    if (
      !this.props.isFormEditting &&
      prevState.openFormModal &&
      !this.state.openFormModal
    ) {
      history.replaceState('', '', '/');
    }
  }

  protected handleBeforeUnload(e: BeforeUnloadEvent) {
    e.preventDefault();
    e.returnValue =
      '未保存のデータがありますが、本当に閉じてもよろしいですか？';
  }

  render() {
    const { openFormModal, edittingPostId } = this.state;
    const { isFormEditting, isMobile } = this.props;
    return (
      <Box sx={wrapper(openFormModal && !isMobile)}>
        <GlobalMenu topBarPosition="static">
          <Box sx={mapWrapper(isMobile)}>
            <TriviaMap
              newMarkerMode={this.state.newMarkerMode}
              endToSelectPosition={this.endToSelectPosition}
              hiddenMarkerIds={edittingPostId ? [edittingPostId] : []}
              shouldCurrentPositionAsyncWithForm
              park="L" // TODO
            />

            {!isFormEditting && (
              <FloatingButton
                icon="add-marker"
                onClick={this.handleClickAddButton}
              />
            )}

            <LoadingProgressBar />
          </Box>
        </GlobalMenu>

        {this.renderEditForm()}

        <GlobalMessage closeFormModal={this.handleCloseFormModal} />

        {this.renderDoubleEditAlartDialog()}
      </Box>
    );
  }

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
    const { edittingPostId, openFormModal } = this.state;
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
        />
      </SwipeableEdgeDrawer>
    ) : (
      <Drawer
        sx={rightDrawerStyle}
        variant="persistent"
        anchor="right"
        open={openFormModal}
      >
        {openFormModal && (
          <ArticleForm
            postId={edittingPostId}
            onClickSelectPosition={this.startToSelectPosition}
            onClose={this.handleCloseFormModal}
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
          <Button
            onClick={this.handleCloseDoubleEditAlartDialog}
            variant="outlined"
          >
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
};
