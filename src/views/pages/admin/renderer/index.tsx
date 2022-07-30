import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { User } from 'types/user';
import { ArticleManageTable } from 'views/components/organisms/article-manage-table';
import { AdminWrapper } from 'views/components/organisms/admin-wrapper';

export class Renderer extends React.Component<Props> {
  render() {
    return <AdminWrapper>{this.renderContents()}</AdminWrapper>;
  }

  protected renderContents = () => {
    const { user } = this.props;

    return (
      <Stack spacing={3}>
        <Typography align="center">ようこそ {user?.nickname}さん</Typography>
        <Box>
          <Typography align="center" component="h2" variant="h4" sx={{ mb: 3 }}>
            投稿一覧
          </Typography>
          <ArticleManageTable />
        </Box>
      </Stack>
    );
  };
}

export type Props = {
  user?: User;
};
