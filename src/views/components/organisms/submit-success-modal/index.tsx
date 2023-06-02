import { useAppSelector } from 'store';
import { Renderer, Props } from './renderer';
import {
  selectArticleFormSubmitSuccessInfo,
  selectArticleFormSubmittingState,
} from 'store/article-form/selector';

export function SubmitSuccessModal() {
  const props: Props = {
    articleFormSubmittingState: useAppSelector(selectArticleFormSubmittingState),
    submitSuccessInfo: useAppSelector(selectArticleFormSubmitSuccessInfo),
  };

  return <Renderer {...props} />;
}
