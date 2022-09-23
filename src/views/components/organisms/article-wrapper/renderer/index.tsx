import React from 'react';
import { Box, Grid } from '@mui/material';
import { GlobalMenu } from 'views/components/organisms/global-menu';
import { ArticlePaper } from 'views/components/atoms/article-paper';
import { wrapper, contentWrapper } from '../styles';
import { MAP_PAGE_LINK } from 'constant/links';

export class Renderer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { isMobile, children, showSidebar } = this.props;

    const localNavi = {
      text: 'マップへ',
      link: MAP_PAGE_LINK,
    };

    return (
      <Box sx={wrapper}>
        <GlobalMenu
          topBarPosition="fixed"
          permanentLeftNavi={!isMobile}
          localBackNavi={localNavi}
        >
          <Box sx={contentWrapper(isMobile)}>
            <Grid container spacing={isMobile || !showSidebar ? 2 : 4}>
              <Grid item xs={isMobile || !showSidebar ? 12 : 8}>
                <ArticlePaper variant="main">{children}</ArticlePaper>
              </Grid>
              {showSidebar && (
                <Grid item xs={isMobile ? 12 : 4}>
                  <ArticlePaper variant="side">
                    {this.renderSideBar()}
                  </ArticlePaper>
                </Grid>
              )}
            </Grid>
          </Box>
        </GlobalMenu>
      </Box>
    );
  }

  protected renderSideBar = () => {
    return <>TODO: サイドバー</>;
  };
}

export type Props = {
  isMobile: boolean;
  children: React.ReactNode;
  showSidebar: boolean;
};
