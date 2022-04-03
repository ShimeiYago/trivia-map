import { useAppSelector } from 'store';
import {
  selectArticleFormIsEditting,
  selectArticleFormSubmittingState,
} from 'store/article-form/selector';
import { Renderer, Props } from './renderer';
import { isMobile } from 'react-device-detect';

export function App() {
  const props: Props = {
    isFormEditting: useAppSelector(selectArticleFormIsEditting),
    isMobile: isMobile,
    articleFormSubmittingState: useAppSelector(
      selectArticleFormSubmittingState,
    ),
  };

  return <Renderer {...props} />;
}
