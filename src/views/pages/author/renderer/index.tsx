import React from 'react';
import { ArticleWrapper } from 'views/components/organisms/article-wrapper';
import { ArticlePreviewList } from 'views/components/organisms/article-preview-list';
import { Author } from 'types/author';
import { getAuthorInfo } from 'api/users-api';
import { Avatar, Divider, Stack, Typography } from '@mui/material';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import noIcon from 'images/no-icon.jpg';
import { ApiError } from 'api/utils/handle-axios-error';
import { CommonHelmet } from 'helper-components/common-helmet';
import { MapLinkButton } from 'views/components/moleculars/map-link-button';
import LinkIcon from '@mui/icons-material/Link';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import TwitterIcon from '@mui/icons-material/Twitter';

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
    const description = `${author.nickname}さんのプロフィールと、全投稿を確認することができます。`;

    return (
      <>
        <CommonHelmet title={pageName} description={description} />

        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{ mb: 3 }}
        >
          <Avatar sx={{ width: 50, height: 50 }} src={author.icon ?? noIcon} />
          <Typography component="h2" variant="h4">
            {`${author.nickname}さん`}
          </Typography>
        </Stack>

        {author.url && (
          <IconAndText
            iconComponent={author.url.includes('twitter.com') ? <TwitterIcon /> : <LinkIcon />}
            text={author.url}
            iconPosition="left"
            align="center"
            href={author.url}
          />
        )}

        <Divider sx={{ my: 3 }} />

        <Typography component="h3" variant="h4" align="center">
          投稿一覧
        </Typography>

        <MapLinkButton userId={this.props.userId} />

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
