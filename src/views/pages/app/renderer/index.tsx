import { Box, Drawer } from '@mui/material';
import React from 'react';
import { FloatingButton } from 'views/components/atoms/floating-button';
import { BoxModal } from 'views/components/moleculars/box-modal';
import { SwipeableEdgeDrawer } from 'views/components/moleculars/swipeable-edge-drawer';
import { Article } from 'views/components/organisms/article';
import { ArticleForm } from 'views/components/organisms/article-form';
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
    };
  }

  render() {
    const { readingArticleId, openArticleModal, openFormModal } = this.state;
    const { isFormEditting, isMobile } = this.props;
    return (
      <>
        <Box sx={mapWrapper(openFormModal && !isMobile)}>
          <TriviaMap
            onClickPostTitle={this.handleClickPostTitle}
            newMarkerMode={this.state.newMarkerMode}
            endToSelectPosition={this.endToSelectPosition}
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
            />
          ) : null}
        </BoxModal>

        {this.renderEditForm()}

        <GlobalMessage
          closeArticleModal={this.handleCloseModal('article')}
          closeFormModal={this.handleCloseModal('form')}
        />
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

  protected handleClickPostEdit = () =>
    this.setState({
      openFormModal: true,
      openArticleModal: false,
      edittingArticleId: this.state.readingArticleId,
    });

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
          });
        };
      case 'form':
        return () => {
          this.setState({
            openFormModal: false,
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
}

export type Props = {
  isFormEditting: boolean;
  isMobile: boolean;
};

export type State = {
  openArticleModal: boolean;
  openFormModal: boolean;
  readingArticleId?: string;
  edittingArticleId?: string;
  newMarkerMode: boolean;
};
