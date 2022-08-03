import { useAppSelector } from 'store';
import { Renderer, Props } from './renderer';
import { selectArticleFormSubmittingState } from 'store/article-form/selector';
import { selectMarkersErrorMsg } from 'store/markers/selector';

export function GlobalMessage(ownProps: OwnProps) {
  const props: Props = {
    articleFormSubmittingState: useAppSelector(
      selectArticleFormSubmittingState,
    ),
    markersDeletingState: 'waiting', // TODO
    markersErrorMsg: useAppSelector(selectMarkersErrorMsg),
    closeFormModal: ownProps.closeFormModal,
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  closeFormModal: () => void;
};
