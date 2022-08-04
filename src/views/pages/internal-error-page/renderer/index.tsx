import React from 'react';
import { Typography } from '@mui/material';
import { MAP_PAGE_LINK } from 'constant/links';
import { Link } from 'react-router-dom';

export const Renderer: React.FC = () => {
  return (
    <Typography align="center" component="div" sx={{ mt: 3 }}>
      <Typography component="h1">エラーが発生しました。</Typography>
      <Typography>しばらく時間を空けてからもう一度お試しください。</Typography>
      <Link to={MAP_PAGE_LINK}>トップへ戻る</Link>
    </Typography>
  );
};
