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
import React from 'react';
import { FloatingButton } from 'views/components/atoms/floating-button';
import { BoxModal } from 'views/components/moleculars/box-modal';
import { SwipeableEdgeDrawer } from 'views/components/moleculars/swipeable-edge-drawer';
import { Article } from 'views/components/organisms/article';
import { ArticleForm } from 'views/components/organisms/article-form';
import { DeletingConfirmModal } from 'views/components/organisms/deleting-confirm-modal';
import { GlobalMessage } from 'views/components/organisms/global-messge';
import { LoadingProgressBar } from 'views/components/organisms/loading-progress-bar';
import { TriviaMap } from 'views/components/organisms/trivia-map';
import { rightDrawerStyle, mapWrapper } from './styles';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openArticleModal: false,
      openFormModal: false,
      newMarkerMode: false,
      openDialogToConfirmDeleting: false,
      openDoubleEditAlartDialog: false,
    };
  }

  componentDidUpdate(prevProps: Props) {
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
  }

  protected handleBeforeUnload(e: BeforeUnloadEvent) {
    e.preventDefault();
    e.returnValue =
      '未保存のデータがありますが、本当に閉じてもよろしいですか？';
  }

  render() {
    const {
      readingArticleId,
      openArticleModal,
      openFormModal,
      edittingArticleId,
      openDialogToConfirmDeleting,
    } = this.state;
    const { isFormEditting, isMobile } = this.props;
    return (
      <>
        <Box sx={mapWrapper(openFormModal && !isMobile)}>
          <TriviaMap
            onClickPostTitle={this.handleClickPostTitle}
            newMarkerMode={this.state.newMarkerMode}
            endToSelectPosition={this.endToSelectPosition}
            hiddenMarkerIds={edittingArticleId ? [edittingArticleId] : []}
          />

          {!isFormEditting && (
            <FloatingButton onClick={this.handleClickAddButton} />
          )}

          <LoadingProgressBar />
        </Box>

        <BoxModal
          open={openArticleModal}
          onClose={this.handleCloseModal('article')}
        >
          {readingArticleId ? (
            <Article
              postId={readingArticleId}
              onClickEdit={this.handleClickPostEdit}
              onClickDelete={this.handleClickPostDelete}
            />
          ) : null}
        </BoxModal>

        <DeletingConfirmModal
          open={openDialogToConfirmDeleting}
          onClickCancel={this.handleCancelToDeleteMarker}
          onClickConfirm={this.handleConfirmToDelete}
        />

        {this.renderEditForm()}

        <GlobalMessage
          closeArticleModal={this.handleCloseModal('article')}
          closeFormModal={this.handleCloseModal('form')}
        />

        {this.renderDoubleEditAlartDialog()}
      </>
    );
  }

  protected handleClickAddButton = () =>
    this.setState({
      openFormModal: true,
      edittingArticleId: undefined,
    });

  protected handleClickPostTitle = (postId: string) => {
    return () => {
      this.setState({
        openArticleModal: true,
        readingArticleId: postId,
      });
    };
  };

  protected handleClickPostEdit = () => {
    if (this.state.openFormModal) {
      return this.setState({
        openDoubleEditAlartDialog: true,
      });
    }
    return this.setState({
      openFormModal: true,
      openArticleModal: false,
      edittingArticleId: this.state.readingArticleId,
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

  protected handleConfirmToDelete = () => {
    const { readingArticleId } = this.state;
    readingArticleId && this.props.deleteArticle(readingArticleId);

    this.setState({
      openDialogToConfirmDeleting: false,
    });
  };

  protected handleOpenEditForm = () =>
    this.setState({
      openFormModal: true,
    });

  protected handleCloseModal(target: 'article' | 'form') {
    switch (target) {
      case 'article':
        return () => {
          this.setState({
            openArticleModal: false,
            readingArticleId: undefined,
          });
        };
      case 'form':
        return () => {
          this.setState({
            openFormModal: false,
            edittingArticleId: undefined,
          });
        };
    }
  }

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
    const { edittingArticleId, openFormModal } = this.state;
    const { isFormEditting, isMobile } = this.props;

    return isMobile ? (
      <SwipeableEdgeDrawer
        show={isFormEditting || openFormModal}
        open={openFormModal}
        onOpen={this.handleOpenEditForm}
        onClose={this.handleCloseModal('form')}
        labelText="編集中"
        heightRatio={80}
      >
        <ArticleForm
          postId={edittingArticleId}
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
            postId={edittingArticleId}
            onClickSelectPosition={this.startToSelectPosition}
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
        <DialogTitle>既に他の投稿が編集中です。</DialogTitle>
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
  deleteArticle: (postId: string) => void;
  isFormChangedFromLastSaved: boolean;
};

export type State = {
  openArticleModal: boolean;
  openFormModal: boolean;
  readingArticleId?: string;
  edittingArticleId?: string;
  newMarkerMode: boolean;
  openDialogToConfirmDeleting: boolean;
  openDoubleEditAlartDialog: boolean;
};
