import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectReadingArticleContent,
  selectReadingArticleLoadingState,
  selectReadingArticleTitle,
} from 'store/reading-article/selector';
import { fetchReadingArticle } from 'store/reading-article/actions';
import { useParams } from 'react-router-dom';

export function Article() {
  const dispatch = useAppDispatch();

  const { postId } = useParams();
  // TODO
  if (!postId) {
    throw Error;
  }

  const props: Props = {
    title: useAppSelector(selectReadingArticleTitle),
    content: useAppSelector(selectReadingArticleContent),
    articleLoadingState: useAppSelector(selectReadingArticleLoadingState),

    fetchArticle: () => dispatch(fetchReadingArticle(postId)),
  };

  return <Renderer {...props} />;
}
