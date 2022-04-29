import { useAppDispatch, useAppSelector } from 'store';
import {
  selectArticleFormIsEditting,
  selectArticleFormIsFormChangedFromLastSaved,
} from 'store/article-form/selector';
import { Renderer, Props } from './renderer';
import { isMobile } from 'react-device-detect';
import { deleteArticle } from 'store/markers/actions';

export function MapPage() {
  const dispatch = useAppDispatch();

  const props: Props = {
    isFormEditting: useAppSelector(selectArticleFormIsEditting),
    isMobile: isMobile,
    isFormChangedFromLastSaved: useAppSelector(
      selectArticleFormIsFormChangedFromLastSaved,
    ),
    deleteArticle: (postId: string) => dispatch(deleteArticle(postId)),
  };

  return <Renderer {...props} />;
}
