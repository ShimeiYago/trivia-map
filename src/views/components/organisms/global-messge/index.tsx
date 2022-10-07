import { useAppSelector } from 'store';
import { Renderer, Props } from './renderer';
import {
  selectArticleFormSubmitSuccessId,
  selectArticleFormSubmittingState,
} from 'store/article-form/selector';
import { selectLoggedOutSuccessfully } from 'store/auths/selector';

export function GlobalMessage(ownProps: OwnProps) {
  const props: Props = {
    articleFormSubmittingState: useAppSelector(selectArticleFormSubmittingState),
    loggedOutSuccessfully: useAppSelector(selectLoggedOutSuccessfully),
    submitSuccessId: useAppSelector(selectArticleFormSubmitSuccessId),

    closeFormModal: ownProps.closeFormModal,
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  closeFormModal: () => void;
};
