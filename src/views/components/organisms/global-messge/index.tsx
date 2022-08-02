import { useAppSelector } from 'store';
import { Renderer, Props } from './renderer';
import {
  selectArticleFormFetchingErrorMsg,
  selectArticleFormFetchingState,
  selectArticleFormSubmittingState,
} from 'store/article-form/selector';
import { selectMarkersErrorMsg } from 'store/markers/selector';

export function GlobalMessage(ownProps: OwnProps) {
  const props: Props = {
    articleFormFetchingState: useAppSelector(selectArticleFormFetchingState),
    articleFormFetchingErrorMsg: useAppSelector(
      selectArticleFormFetchingErrorMsg,
    ),
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
