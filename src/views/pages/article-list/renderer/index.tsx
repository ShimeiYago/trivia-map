import React from 'react';
import { ArticleWrapper } from 'views/components/organisms/article-wrapper';
import { ArticlePreviewList } from 'views/components/organisms/article-preview-list';
import { PreviewKeyType } from 'api/articles-api/get-articles-previews';

export class Renderer extends React.Component<Props> {
  render() {
    return <ArticleWrapper>{this.renderMainContent()}</ArticleWrapper>;
  }

  protected renderMainContent = () => {
    return (
      <ArticlePreviewList type={this.props.type} keyId={this.props.keyId} />
    );
  };
}

export type Props = {
  type: PreviewKeyType;
  keyId: number;

  throwError: (errorStatus: number) => void;
};
