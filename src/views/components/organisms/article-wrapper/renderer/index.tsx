import React from 'react';
import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';
import { GlobalMenu } from 'views/components/organisms/global-menu';
import { ArticlePaper } from 'views/components/atoms/article-paper';
import { wrapper, contentWrapper } from '../styles';
import { CATEGORY_PAGE_LINK, MAP_PAGE_LINK } from 'constant/links';
import { ArticlePreviewList } from '../../article-preview-list';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { DesignedHead } from 'views/components/atoms/designed-head';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FolderIcon from '@mui/icons-material/Folder';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { CATEGORIES } from 'constant';
import { NonStyleLink } from 'views/components/atoms/non-style-link';

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
    return (
      <Stack spacing={3}>
        <Box>
          <DesignedHead component="h2">
            <IconAndText
              iconComponent={<FolderIcon />}
              text="カテゴリー"
              iconPosition="left"
              align="left"
              component="div"
              variant="h6"
              columnGap={1}
            />
          </DesignedHead>

          {this.renderCategoryList()}
        </Box>

        <Box>
          <DesignedHead component="h2">
            <IconAndText
              iconComponent={<CalendarTodayIcon />}
              text="新着記事"
              iconPosition="left"
              align="left"
              component="div"
              variant="h6"
              columnGap={1}
            />
          </DesignedHead>
          <ArticlePreviewList
            variant="sidebar"
            searchConditions={{ order: 'latest', limit: 5 }}
          />
        </Box>

        <Box>
          <DesignedHead component="h2">
            <IconAndText
              iconComponent={<StarBorderIcon />}
              text="人気記事"
              iconPosition="left"
              align="left"
              component="div"
              variant="h6"
            />
          </DesignedHead>
          <ArticlePreviewList
            variant="sidebar"
            searchConditions={{ order: 'popular', limit: 5 }}
          />
        </Box>
      </Stack>
    );
  };

  protected renderCategoryList() {
    const listItems = CATEGORIES.map((category) => {
      return (
        <>
          <NonStyleLink to={CATEGORY_PAGE_LINK(category.categoryId.toString())}>
            <ListItem disablePadding>
              <ListItemButton sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: '40px' }}>
                  <KeyboardArrowRightIcon />
                </ListItemIcon>
                <ListItemText primary={category.categoryName} />
              </ListItemButton>
            </ListItem>
          </NonStyleLink>
          <Divider component="li" />
        </>
      );
    });

    return <List sx={{ m: 0, p: 0 }}>{listItems}</List>;
  }
}

export type Props = {
  isMobile: boolean;
  children: React.ReactNode;
  showSidebar: boolean;
};
