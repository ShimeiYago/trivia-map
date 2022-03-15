import { useAppSelector } from 'store';
import { selectArticleFormIsEditting } from 'store/article-form/selector';
import { Renderer, Props } from './renderer';

export function App() {
  const props: Props = {
    isFormEditting: useAppSelector(selectArticleFormIsEditting),
  };

  return <Renderer {...props} />;
}
