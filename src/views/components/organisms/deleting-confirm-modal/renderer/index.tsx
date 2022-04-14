import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import React from 'react';
import { LoadingState } from 'types/loading-state';
import { LoadingButton } from '@mui/lab';

export class Renderer extends React.Component<Props> {
  render() {
    const { markerDeletingState, onClickCancel, onClickConfirm, open } =
      this.props;

    return (
      <Dialog open={open || markerDeletingState === 'loading'}>
        <DialogTitle>この投稿を削除してもよろしいですか？</DialogTitle>
        <DialogActions>
          <Button onClick={onClickCancel} variant="outlined">
            キャンセル
          </Button>
          <LoadingButton
            onClick={onClickConfirm}
            autoFocus
            variant="contained"
            loading={markerDeletingState === 'loading'}
          >
            OK
          </LoadingButton>
        </DialogActions>
      </Dialog>
    );
  }
}

export type Props = {
  open: boolean;
  markerDeletingState: LoadingState;
  onClickCancel: () => void;
  onClickConfirm: () => void;
};
