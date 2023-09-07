/* istanbul ignore file */

import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

export function DeleteConfirmDialog(props: Props) {
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle sx={{ wordBreak: 'break-all' }}>{props.title}</DialogTitle>
      <DialogActions>
        <Button onClick={props.onClose}>削除しない</Button>
        <LoadingButton onClick={props.onDelete} autoFocus loading={props.deleting}>
          削除する
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export type Props = {
  open: boolean;
  deleting: boolean;
  onClose: () => void;
  title: string;
  onDelete: () => void;
};
