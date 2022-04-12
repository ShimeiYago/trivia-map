import { useAppDispatch, useAppSelector } from 'store';
import { selectArticleFormIsEditting } from 'store/article-form/selector';
import { Renderer, Props } from './renderer';
import { isMobile } from 'react-device-detect';
import { deleteArticle } from 'store/markers/actions';

export function App() {
  const dispatch = useAppDispatch();

  const props: Props = {
    isFormEditting: useAppSelector(selectArticleFormIsEditting),
    isMobile: isMobile,
    deleteArticle: (postId: string) => dispatch(deleteArticle(postId)),
  };

  return <Renderer {...props} />;
}
