import React from 'react';
import { ArticleWrapper } from 'views/components/organisms/article-wrapper';
import { ArticlePreviewList } from 'views/components/organisms/article-preview-list';
import { Author } from 'types/author';
import { getAuthorInfo } from 'api/users-api';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import noIcon from 'images/no-icon.jpg';
import { ApiError } from 'api/utils/handle-axios-error';
import { pageTitleGenerator } from 'utils/page-title-generator';
import { CommonHelmet } from 'helper-components/common-helmet';
import { NonStyleLink } from 'views/components/atoms/non-style-link';
import { MAP_USER_LINK } from 'constant/links';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import MapIcon from '@mui/icons-material/Map';
import { grey } from '@mui/material/colors';

export class Renderer extends React.Component<Props, State> {
  state: State = {
    author: undefined,
  };

  componentDidMount() {
    this.fetchAuthor();
  }

  render() {
    return <ArticleWrapper showSidebar>{this.renderMainContent()}</ArticleWrapper>;
  }

  protected renderMainContent = () => {
    const { author } = this.state;

    if (!author) {
      return <CenterSpinner />;
    }

    const pageName = `${author.nickname}さんの投稿一覧`;

    return (
      <>
        <CommonHelmet title={pageTitleGenerator(pageName)} />

        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{ mb: 3 }}
        >
          <Avatar sx={{ width: 50, height: 50 }} src={author.icon ?? noIcon} />
          <Typography component="h2" variant="h4">
            {pageName}
          </Typography>
        </Stack>

        <Box textAlign="center" mt={2} mb={4} color={grey[800]}>
          <NonStyleLink to={MAP_USER_LINK(String(this.props.userId))}>
            <Button color="inherit" variant="outlined" sx={{ py: 2, px: 5 }}>
              <IconAndText
                iconComponent={<MapIcon fontSize="medium" />}
                text="マップ上で確認する"
                iconPosition="left"
                columnGap={1}
              />
            </Button>
          </NonStyleLink>
        </Box>

        <ArticlePreviewList variant="large" searchConditions={{ user: this.props.userId }} />
      </>
    );
  };

  protected async fetchAuthor() {
    try {
      const res = await getAuthorInfo(this.props.userId);

      this.setState({
        author: res,
      });
    } catch (error) {
      const apiError = error as ApiError<unknown>;
      this.props.throwError(apiError.status ?? 500);
    }
  }
}

export type Props = {
  userId: number;

  throwError: (errorStatus: number) => void;
};

export type State = {
  author?: Author;
};
