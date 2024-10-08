import React from 'react';
import { ArticleWrapper } from 'views/components/organisms/article-wrapper';
import { ArticlePreviewList } from 'views/components/organisms/article-preview-list';
import { Typography } from '@mui/material';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import FolderIcon from '@mui/icons-material/Folder';
import { categoryMapper } from 'utils/category-mapper';
import { MapLinkButton } from 'views/components/moleculars/map-link-button';

export class Renderer extends React.Component<Props> {
  render() {
    return <ArticleWrapper showSidebar>{this.renderMainContent()}</ArticleWrapper>;
  }

  protected renderMainContent = () => {
    return (
      <>
        <Typography component="h2" variant="h5" align="center" sx={{ mb: 2 }}>
          <IconAndText
            iconComponent={<FolderIcon fontSize="inherit" />}
            text={categoryMapper(this.props.categoryId)}
            iconPosition="left"
            variant="inherit"
          />
        </Typography>

        <MapLinkButton categoryId={this.props.categoryId} />

        <ArticlePreviewList
          variant="large"
          searchConditions={{ category: this.props.categoryId }}
          doesKeepPageParamInUrl
        />
      </>
    );
  };
}

export type Props = {
  categoryId: number;
};
