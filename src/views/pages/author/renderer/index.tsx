import React from 'react';
import { ArticleWrapper } from 'views/components/organisms/article-wrapper';
import { ArticlePreviewList } from 'views/components/organisms/article-preview-list';

// TODO: Redirect to 404 if target user does not exist.

export class Renderer extends React.Component<Props> {
  render() {
    return <ArticleWrapper>{this.renderMainContent()}</ArticleWrapper>;
  }

  protected renderMainContent = () => {
    return <ArticlePreviewList user={this.props.userId} />;
  };
}

export type Props = {
  userId: number;

  throwError: (errorStatus: number) => void;
};
