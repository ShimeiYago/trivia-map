import React from 'react';
import { Box, Stack } from '@mui/material';
import { AdminWrapper } from 'views/components/organisms/admin-wrapper';
import { BackToNavi } from 'views/components/moleculars/back-to-navi';
import { ADMIN_LINK } from 'constant/links';
import { PAGE_NAMES } from 'constant/page-names';
import { ArticlePreviewLikedList } from 'views/components/organisms/article-preview-liked-list';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

export class Renderer extends React.Component {
  render() {
    return <AdminWrapper>{this.renderContents()}</AdminWrapper>;
  }

  protected renderContents = () => {
    return (
      <Stack spacing={3}>
        <BackToNavi text="マイページ" link={ADMIN_LINK} />
        <Box sx={{ mb: 3 }}>
          <IconAndText
            align="center"
            component="h2"
            variant="h4"
            text={PAGE_NAMES.likedArticles}
            iconComponent={<ThumbUpIcon fontSize="inherit" />}
            iconPosition="left"
          />
        </Box>
        <ArticlePreviewLikedList variant="large" />
      </Stack>
    );
  };
}
