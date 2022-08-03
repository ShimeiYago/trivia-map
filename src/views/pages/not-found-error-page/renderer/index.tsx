import React from 'react';
import notFoundImage from 'images/404.png';
import { Box, Typography } from '@mui/material';
import { GlobalMenu } from 'views/components/organisms/global-menu';

export const Renderer: React.FC = () => {
  return (
    <GlobalMenu topBarPosition="static">
      <Box sx={{ p: 1 }}>
        <Box sx={{ textAlign: 'center', maxWidth: 600, mx: 'auto', my: 3 }}>
          <img src={notFoundImage} alt="404" width="100%" />
        </Box>
        <Typography align="center" fontSize={18} sx={{ my: 1 }}>
          お探しのページは見つかりませんでした。
        </Typography>
        <Typography align="center" fontSize={18}>
          URLが間違っているか、既に削除された可能性があります。
        </Typography>
      </Box>
    </GlobalMenu>
  );
};
