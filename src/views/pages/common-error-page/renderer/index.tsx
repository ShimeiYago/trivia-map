import React from 'react';
import { Box, Typography } from '@mui/material';
import { MAP_PAGE_LINK } from 'constant/links';
import { Link } from 'react-router-dom';
import { GlobalMenu } from 'views/components/organisms/global-menu';
import notFoundImage from 'images/404.png';
import { HeadAppender } from 'helper-components/head-appender';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { PAGE_NAMES } from 'constant/page-names';

export const Renderer: React.FC<Props> = (props) => {
  switch (props.errorStatus) {
    case 404:
      return render404Error();
    default:
      return render500Error();
  }
};

const render404Error = () => {
  return (
    <HeadAppender title={pageTitleGenerator(PAGE_NAMES.notFound)}>
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
    </HeadAppender>
  );
};

const render500Error = () => {
  return (
    <HeadAppender title={pageTitleGenerator(PAGE_NAMES.internalError)}>
      <Typography align="center" component="div" sx={{ mt: 3 }}>
        <Typography component="h1" fontSize={18}>
          エラーが発生しました。
        </Typography>
        <Typography fontSize={18}>しばらく時間を空けてからもう一度お試しください。</Typography>
        <Typography component="h1" fontSize={20} sx={{ mt: 1 }}>
          <Link to={MAP_PAGE_LINK}>トップへ戻る</Link>
        </Typography>
      </Typography>
    </HeadAppender>
  );
};

export type Props = {
  errorStatus: number;
};
