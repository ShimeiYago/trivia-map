import { useAppSelector } from 'store';
import { selectMarkersDeletingState } from 'store/markers/selector';
import { Renderer, Props } from './renderer';

export function DeletingConfirmModal(ownProps: OwnProps) {
  const props: Props = {
    markerDeletingState: useAppSelector(selectMarkersDeletingState),
    open: ownProps.open,
    onClickCancel: ownProps.onClickCancel,
    onClickConfirm: ownProps.onClickConfirm,
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  open: boolean;
  onClickCancel: () => void;
  onClickConfirm: () => void;
};
