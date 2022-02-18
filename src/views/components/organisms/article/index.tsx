import { Props, Renderer } from './renderer';
import { useAppSelector } from 'store';
import {
  selectReadingArticleContent,
  selectReadingArticleLoadingState,
  selectReadingArticleTitle,
} from 'store/reading-article/selector';

export function Article() {
  const props: Props = {
    title: useAppSelector(selectReadingArticleTitle),
    content: useAppSelector(selectReadingArticleContent),
    loadingState: useAppSelector(selectReadingArticleLoadingState),
  };

  return <Renderer {...props} />;
}
