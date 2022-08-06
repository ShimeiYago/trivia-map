import React from 'react';
import { Box, Grid } from '@mui/material';
import { GlobalMenu } from 'views/components/organisms/global-menu';
import { ArticlePaper } from 'views/components/atoms/article-paper';
import { wrapper, contentWrapper } from '../styles';
import { Link } from 'react-router-dom';
import { MAP_PAGE_LINK } from 'constant/links';

export class Renderer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { isMobile, children } = this.props;

    return (
      <Box sx={wrapper}>
        <GlobalMenu topBarPosition="static" permanentLeftNavi={!isMobile}>
          <Box sx={contentWrapper(isMobile)}>
            <Grid container spacing={isMobile ? 2 : 4}>
              <Grid item xs={12}>
                <ArticlePaper variant="navi">
                  {this.renderLocalNavi()}
                </ArticlePaper>
              </Grid>
              <Grid item xs={isMobile ? 12 : 8}>
                <ArticlePaper variant="main">{children}</ArticlePaper>
              </Grid>
              <Grid item xs={isMobile ? 12 : 4}>
                <ArticlePaper variant="side">
                  {this.renderSideBar()}
                </ArticlePaper>
              </Grid>
            </Grid>
          </Box>
        </GlobalMenu>
      </Box>
    );
  }

  protected renderSideBar = () => {
    return <>TODO: サイドバー</>;
  };

  protected renderLocalNavi = () => {
    return <Link to={MAP_PAGE_LINK}>マップへ戻る</Link>;
  };
}

export type Props = {
  isMobile: boolean;
  children: React.ReactNode;
};
