import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { AdminWrapper } from 'views/components/organisms/admin-wrapper';
import { BackToNavi } from 'views/components/moleculars/back-to-navi';
import { ADMIN_LINK } from 'constant/links';
import { PAGE_NAMES } from 'constant/page-names';

export class Renderer extends React.Component {
  render() {
    return <AdminWrapper>{this.renderContents()}</AdminWrapper>;
  }

  protected renderContents = () => {
    return (
      <Stack spacing={3}>
        <BackToNavi text="マイページ" link={ADMIN_LINK} />
        <Box>
          <Typography align="center" component="h2" variant="h4" sx={{ mb: 3 }}>
            {PAGE_NAMES.likedArticles}
          </Typography>
        </Box>
      </Stack>
    );
  };
}
