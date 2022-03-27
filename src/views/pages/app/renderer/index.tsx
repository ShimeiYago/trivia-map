import React from 'react';
import { FloatingButton } from 'views/components/atoms/floating-button';
import { BoxModal } from 'views/components/moleculars/box-modal';
import { SwipeableEdgeDrawer } from 'views/components/moleculars/swipeable-edge-drawer';
import { Article } from 'views/components/organisms/article';
import { ArticleForm } from 'views/components/organisms/article-form';
import { TriviaMap } from 'views/components/organisms/trivia-map';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openingModal: 'none',
      newMarkerMode: false,
    };
  }

  render() {
    const { readingArticleId, edittingArticleId, openingModal } = this.state;
    const { isFormEditting } = this.props;
    return (
      <>
        <TriviaMap
          onClickPostTitle={this.handleClickPostTitle}
          newMarkerMode={this.state.newMarkerMode}
          endToSelectPosition={this.endToSelectPosition}
        />

        <BoxModal
          open={openingModal === 'article'}
          onClose={this.handleCloseModal}
        >
          {readingArticleId ? (
            <Article
              postId={readingArticleId}
              onClickEdit={this.handleClickPostEdit}
            />
          ) : null}
        </BoxModal>

        <SwipeableEdgeDrawer
          show={isFormEditting || openingModal === 'form'}
          open={openingModal === 'form'}
          onOpen={this.handleOpenEditForm}
          onClose={this.handleCloseModal}
          labelText="編集中"
          heightRatio={80}
        >
          <ArticleForm
            postId={edittingArticleId}
            onClickSelectPosition={this.startToSelectPosition}
          />
        </SwipeableEdgeDrawer>

        {!isFormEditting && (
          <FloatingButton onClick={this.handleClickAddButton} />
        )}
      </>
    );
  }

  protected handleClickAddButton = () =>
    this.setState({
      openingModal: 'form',
      edittingArticleId: undefined,
    });

  protected handleClickPostTitle = (postId: string) => {
    return () => {
      this.setState({
        openingModal: 'article',
        readingArticleId: postId,
      });
    };
  };

  protected handleClickPostEdit = () =>
    this.setState({
      openingModal: 'form',
      edittingArticleId: this.state.readingArticleId,
    });

  protected handleOpenEditForm = () =>
    this.setState({
      openingModal: 'form',
    });

  protected handleCloseModal = () => {
    this.setState({
      openingModal: 'none',
    });
  };

  protected startToSelectPosition = () => {
    this.setState({
      openingModal: 'none',
      newMarkerMode: true,
    });
  };

  protected endToSelectPosition = () => {
    this.setState({
      openingModal: 'form',
      newMarkerMode: false,
    });
  };
}

export type Props = {
  isFormEditting: boolean;
};

export type State = {
  openingModal: 'none' | 'article' | 'form';
  readingArticleId?: string;
  edittingArticleId?: string;
  newMarkerMode: boolean;
};
