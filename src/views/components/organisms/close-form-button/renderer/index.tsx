import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { LoadingState } from 'types/loading-state';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openDialog: false,
    };
  }

  render() {
    return (
      <>
        <Box>
          <IconButton aria-label="close" onClick={this.handleClick} sx={{ p: 1 }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {this.renderDialog()}
      </>
    );
  }

  protected handleClick = () => {
    if (!this.props.isFormChangedFromLastSaved) {
      this.handleClose();
    } else {
      this.setState({
        openDialog: true,
      });
    }
  };

  protected handleClose = () => {
    this.props.initialize();
    this.props.onClose();
  };

  protected cancelToClose = () => {
    this.setState({
      openDialog: false,
    });
  };

  protected renderDialog() {
    return (
      <Dialog open={this.state.openDialog} onClose={this.cancelToClose}>
        <DialogTitle>変更を保存しますか？</DialogTitle>
        <DialogContent>未保存のデータがありますが、本当に閉じてもよろしいですか？</DialogContent>
        <DialogActions sx={{ mr: 1, mb: 1 }}>
          <Button onClick={this.handleClose} variant="outlined">
            破棄
          </Button>
          <LoadingButton
            onClick={this.handleSave}
            autoFocus
            variant="contained"
            loading={this.props.submittingState === 'loading'}
          >
            保存
          </LoadingButton>
        </DialogActions>
      </Dialog>
    );
  }

  protected handleSave = () => {
    // TODO: save as draft or public
    if (this.props.postId) {
      return this.props.submitEdittedArticle();
    } else {
      return this.props.submitNewArticle();
    }
  };
}

export type Props = {
  postId?: number;
  isFormChangedFromLastSaved: boolean;
  submittingState: LoadingState;
  isFormEditting: boolean;

  onClose: () => void;
  submitEdittedArticle: () => void;
  submitNewArticle: () => void;
  initialize: () => void;
};

export type State = {
  openDialog: boolean;
};
