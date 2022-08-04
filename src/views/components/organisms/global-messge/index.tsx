import { useAppSelector } from 'store';
import { Renderer, Props } from './renderer';
import { selectArticleFormSubmittingState } from 'store/article-form/selector';

export function GlobalMessage(ownProps: OwnProps) {
  const props: Props = {
    articleFormSubmittingState: useAppSelector(
      selectArticleFormSubmittingState,
    ),
    markersDeletingState: 'waiting', // TODO
    closeFormModal: ownProps.closeFormModal,
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  closeFormModal: () => void;
};
