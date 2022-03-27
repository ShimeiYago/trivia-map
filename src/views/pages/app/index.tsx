import { useAppSelector } from 'store';
import { selectArticleFormIsEditting } from 'store/article-form/selector';
import { Renderer, Props } from './renderer';
import { isMobile } from 'react-device-detect';

export function App() {
  const props: Props = {
    isFormEditting: useAppSelector(selectArticleFormIsEditting),
    isMobile: isMobile,
  };

  return <Renderer {...props} />;
}
