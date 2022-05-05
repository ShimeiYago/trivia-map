import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectReadingArticleContent,
  selectReadingArticleCreatedAt,
  selectReadingArticleImageUrl,
  selectReadingArticleLoadingState,
  selectReadingArticlePosition,
  selectReadingArticleTitle,
  selectReadingArticleUpdatedAt,
  selectReadingArticleUserId,
  selectReadingArticleUserName,
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
    content: useAppSelector(selectReadingArticleContent),
    position: useAppSelector(selectReadingArticlePosition),
    imageUrl: useAppSelector(selectReadingArticleImageUrl),
    userId: useAppSelector(selectReadingArticleUserId),
    userName: useAppSelector(selectReadingArticleUserName),
    createdAt: useAppSelector(selectReadingArticleCreatedAt),
    updatedAt: useAppSelector(selectReadingArticleUpdatedAt),

    articleLoadingState: useAppSelector(selectReadingArticleLoadingState),
    isMobile: isMobile,

    fetchArticle: () => dispatch(fetchReadingArticle(postId)),
  };

  return <Renderer {...props} />;
}
