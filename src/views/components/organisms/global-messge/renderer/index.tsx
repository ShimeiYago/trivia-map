import { Alert, Snackbar, Typography } from '@mui/material';
import { ARTICLE_PAGE_LINK } from 'constant/links';
import React from 'react';
import { LoadingState } from 'types/loading-state';
import { NonStyleLink } from 'views/components/atoms/non-style-link';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      message: '',
      type: 'success',
      show: false,
    };
  }

  componentDidMount() {
    if (this.props.loggedOutSuccessfully) {
      this.setState({
        show: true,
        message: 'ログアウトしました。',
        type: 'success',
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { articleFormSubmittingState, loggedOutSuccessfully, closeFormModal } = this.props;

    if (
      prevProps.articleFormSubmittingState !== articleFormSubmittingState &&
      articleFormSubmittingState === 'success'
    ) {
      this.setState({
        show: true,
        message: '投稿が完了しました！',
        type: 'success',
      });
      closeFormModal();
    }

    if (!prevProps.loggedOutSuccessfully && loggedOutSuccessfully) {
      this.setState({
        show: true,
        message: 'ログアウトしました。',
        type: 'success',
      });
    }
  }

  render() {
    return (
      <Snackbar open={this.state.show} autoHideDuration={6000} onClose={this.handleCloseMessage}>
        <Alert
          onClose={this.handleCloseMessage}
          severity={this.state.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          <Typography fontSize="inherit">{this.state.message}</Typography>
          {this.props.submitSuccessId && (
            <NonStyleLink to={ARTICLE_PAGE_LINK(this.props.submitSuccessId.toString())}>
              <Typography fontSize="inherit" sx={{ textDecoration: 'underline' }}>
                投稿内容を確認する
              </Typography>
            </NonStyleLink>
          )}
        </Alert>
      </Snackbar>
    );
  }

  protected handleCloseMessage = () =>
    this.setState({
      show: false,
    });
}

export type Props = {
  articleFormSubmittingState: LoadingState;
  loggedOutSuccessfully: boolean;
  submitSuccessId?: number;

  closeFormModal: () => void;
};

export type State = {
  message: string;
  type: 'success' | 'error';
  show: boolean;
};
