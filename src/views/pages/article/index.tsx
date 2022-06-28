import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectReadingArticleDescription,
  selectReadingArticleCreatedAt,
  selectReadingArticleImageUrl,
  selectReadingArticleLoadingState,
  selectReadingArticlePosition,
  selectReadingArticleTitle,
  selectReadingArticleUpdatedAt,
  selectReadingArticleAuthor,
} from 'store/reading-article/selector';
import { fetchReadingArticle } from 'store/reading-article/actions';
import { useParams } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

export function Article() {
  const dispatch = useAppDispatch();

  const { postId } = useParams();
  // TODO
  if (!postId) {
    throw Error;
  }

  const props: Props = {
    title: useAppSelector(selectReadingArticleTitle),
    description: useAppSelector(selectReadingArticleDescription),
    position: useAppSelector(selectReadingArticlePosition),
    imageUrl: useAppSelector(selectReadingArticleImageUrl),
    author: useAppSelector(selectReadingArticleAuthor),
    createdAt: useAppSelector(selectReadingArticleCreatedAt),
    updatedAt: useAppSelector(selectReadingArticleUpdatedAt),

    articleLoadingState: useAppSelector(selectReadingArticleLoadingState),
    isMobile: isMobile,

    fetchArticle: () => dispatch(fetchReadingArticle(Number(postId))),
  };

  return <Renderer {...props} />;
}
