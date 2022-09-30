import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { ArticleManageTable } from 'views/components/organisms/article-manage-table';
import { AdminWrapper } from 'views/components/organisms/admin-wrapper';
import { BackToNavi } from 'views/components/moleculars/back-to-navi';
import { ADMIN_LINK } from 'constant/links';
import { PAGE_NAMES } from 'constant/page-names';
import { HeadAppender } from 'helper-components/head-appender';
import { pageTitleGenerator } from 'utils/page-title-generator';

export class Renderer extends React.Component {
  render() {
    return (
      <HeadAppender title={pageTitleGenerator(PAGE_NAMES.myArticles)}>
        <AdminWrapper>{this.renderContents()}</AdminWrapper>
      </HeadAppender>
    );
  }

  protected renderContents = () => {
    return (
      <Stack spacing={3}>
        <BackToNavi text="マイページ" link={ADMIN_LINK} />
        <Box>
          <Typography align="center" component="h2" variant="h4" sx={{ mb: 3 }}>
            {PAGE_NAMES.myArticles}
          </Typography>
          <ArticleManageTable />
        </Box>
      </Stack>
    );
  };
}
