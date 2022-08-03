import { Alert, Snackbar } from '@mui/material';
import React from 'react';
import { LoadingState } from 'types/loading-state';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      message: '',
      type: 'success',
      show: false,
    };
  }

  componentDidUpdate(prevProps: Props) {
    const {
      articleFormSubmittingState,
      markersDeletingState,
      markersErrorMsg,
      closeFormModal,
    } = this.props;

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

    if (
      prevProps.markersDeletingState !== markersDeletingState &&
      markersDeletingState === 'success'
    ) {
      this.setState({
        show: true,
        message: '投稿を削除しました。',
        type: 'success',
      });
    }

    if (
      prevProps.markersDeletingState !== markersDeletingState &&
      markersDeletingState === 'error'
    ) {
      this.setState({
        show: true,
        message: markersErrorMsg ?? '',
        type: 'error',
      });
    }
  }

  render() {
    return (
      <Snackbar
        open={this.state.show}
        autoHideDuration={6000}
        onClose={this.handleCloseMessage}
      >
        <Alert
          onClose={this.handleCloseMessage}
          severity={this.state.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {this.state.message}
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
  markersDeletingState: LoadingState;
  markersErrorMsg?: string;

  closeFormModal: () => void;
};

export type State = {
  message: string;
  type: 'success' | 'error';
  show: boolean;
};
