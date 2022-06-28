import { useAppSelector } from 'store';
import { Renderer, Props } from './renderer';
import {
  selectArticleFormFetchingErrorMsg,
  selectArticleFormFetchingState,
  selectArticleFormSubmittingState,
} from 'store/article-form/selector';
import {
  selectReadingArticleErrorMsg,
  selectReadingArticleLoadingState,
} from 'store/reading-article/selector';
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
    readingArticleLoadingState: useAppSelector(
      selectReadingArticleLoadingState,
    ),
    readingArticleErrorMsg: useAppSelector(selectReadingArticleErrorMsg),
    markersDeletingState: 'waiting', // TODO
    markersErrorMsg: useAppSelector(selectMarkersErrorMsg),
    closeFormModal: ownProps.closeFormModal,
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  closeFormModal: () => void;
};
