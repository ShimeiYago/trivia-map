/* istanbul ignore file */

import { isMobile } from 'react-device-detect';
import { wrapper, contentWrapper } from './styles';
import { Box } from '@mui/material';
import { GlobalMenu } from 'views/components/organisms/global-menu';
import { ArticlePaper } from 'views/components/atoms/article-paper';

export const SingleRowPageWrapper = (props: Props) => {
  return (
    <Box sx={wrapper}>
      <GlobalMenu topBarPosition="static" permanentLeftNavi={!isMobile}>
        <Box sx={contentWrapper(isMobile)}>
          <ArticlePaper variant="main">{props.children}</ArticlePaper>
        </Box>
      </GlobalMenu>
    </Box>
  );
};

export type Props = {
  children: React.ReactNode;
};
