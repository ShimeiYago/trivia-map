import React from 'react';
import { ArticleWrapper } from 'views/components/organisms/article-wrapper';
import { ArticlePreviewList } from 'views/components/organisms/article-preview-list';

// TODO: Add search condition form
// TODO: Change url parameters depending on search conditions

export class Renderer extends React.Component {
  render() {
    return <ArticleWrapper>{this.renderMainContent()}</ArticleWrapper>;
  }

  protected renderMainContent = () => {
    return <ArticlePreviewList variant="large" searchConditions={{}} />;
  };
}

// export type Props = {
// };
