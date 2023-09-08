/* istanbul ignore file */

import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { AdminWrapper } from 'views/components/organisms/admin-wrapper';
import { BackToNavi } from 'views/components/moleculars/back-to-navi';
import { ADMIN_LINK } from 'constant/links';
import { PAGE_NAMES } from 'constant/page-names';
import { SpecialMapManageTable } from 'views/components/organisms/special-map-manage-table';

export class Renderer extends React.Component {
  render() {
    return <AdminWrapper>{this.renderContents()}</AdminWrapper>;
  }

  protected renderContents = () => {
    return (
      <Stack spacing={3}>
        <BackToNavi text={PAGE_NAMES.admin} link={ADMIN_LINK} />
        <Box>
          <Typography align="center" component="h2" variant="h4" sx={{ mb: 3 }}>
            {PAGE_NAMES.specialMapManage}
          </Typography>

          <SpecialMapManageTable />
        </Box>
      </Stack>
    );
  };
}
