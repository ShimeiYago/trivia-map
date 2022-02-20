import React from 'react';
import { FloatingButton } from 'views/components/atoms/floating-button';
import { BoxModal } from 'views/components/moleculars/box-modal';
import { Article } from 'views/components/organisms/article';
import { ArticleForm } from 'views/components/organisms/article-form';
import { TriviaMap } from 'views/components/organisms/trivia-map';

export class Renderer extends React.Component<unknown, State> {
  constructor(props: unknown) {
    super(props);
    this.state = { openingModal: 'none' };
  }

  render() {
    const { readingArticleId, edittingArticleId } = this.state;
    return (
      <>
        <TriviaMap onClickPostTitle={this.handleClickPostTitle} />

        <BoxModal
          open={this.state.openingModal === 'article'}
          onClose={this.handleCloseModal}
        >
          {readingArticleId ? (
            <Article
              postId={readingArticleId}
              onClickEdit={this.handleClickPostEdit}
            />
          ) : null}
        </BoxModal>

        <BoxModal
          open={this.state.openingModal === 'form'}
          onClose={this.handleCloseModal}
        >
          <ArticleForm postId={edittingArticleId} />
        </BoxModal>

        <FloatingButton onClick={this.handleClickAddButton} />
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

  protected handleCloseModal = () => {
    this.setState({
      openingModal: 'none',
    });
  };
}

export type State = {
  openingModal: 'none' | 'article' | 'form';
  readingArticleId?: string;
  edittingArticleId?: string;
};
