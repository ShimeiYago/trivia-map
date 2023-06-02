import { Box, Stack, Typography } from '@mui/material';
import { ARTICLE_PAGE_LINK } from 'constant/links';
import React from 'react';
import { Link } from 'react-router-dom';
import { SubmitSuccessInfo } from 'store/article-form/model';
import { LoadingState } from 'types/loading-state';
import { getDomain } from 'utils/get-domain.ts';
import { ShareButtons } from 'views/components/atoms/share-buttons';
import { BoxModal } from 'views/components/moleculars/box-modal';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { articleFormSubmittingState } = this.props;

    if (
      prevProps.articleFormSubmittingState !== articleFormSubmittingState &&
      articleFormSubmittingState === 'success'
    ) {
      this.setState({
        show: true,
      });
    }
  }

  render() {
    if (!this.props.submitSuccessInfo) {
      return null;
    }

    const { postId, title, description } = this.props.submitSuccessInfo;

    const domain = getDomain(window);
    const path = ARTICLE_PAGE_LINK(String(postId));

    return (
      <BoxModal open={this.state.show} onClose={this.handleCloseMessage} showCloseButton>
        <Stack spacing={2} px={2} pb={3}>
          <Typography variant="h5" align="center">
            投稿が完了しました！
          </Typography>

          <Typography align="center">
            <Link to={path}>{title}</Link>
          </Typography>

          <Box>
            <Typography variant="h6" align="center">
              SNSでシェアしませんか？
            </Typography>

            <ShareButtons title={title} description={description} url={`${domain}${path}`} />
          </Box>
        </Stack>
      </BoxModal>
    );
  }

  protected handleCloseMessage = () =>
    this.setState({
      show: false,
    });
}

export type Props = {
  articleFormSubmittingState: LoadingState;
  submitSuccessInfo?: SubmitSuccessInfo;
};

export type State = {
  show: boolean;
};
