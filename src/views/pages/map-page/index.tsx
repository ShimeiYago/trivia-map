import { useAppDispatch, useAppSelector } from 'store';
import {
  selectArticleFormIsEditting,
  selectArticleFormIsFormChangedFromLastSaved,
} from 'store/article-form/selector';
import { Renderer, Props } from './renderer';
import { isMobile } from 'react-device-detect';
import { deleteArticle } from 'store/markers/actions';
import { useParams } from 'react-router-dom';

export function MapPage() {
  const dispatch = useAppDispatch();
  const { postId } = useParams();

  const props: Props = {
    isFormEditting: useAppSelector(selectArticleFormIsEditting),
    isMobile: isMobile,
    isFormChangedFromLastSaved: useAppSelector(
      selectArticleFormIsFormChangedFromLastSaved,
    ),
    deleteArticle: (postId: string) => dispatch(deleteArticle(postId)),
  };

  if (!postId) {
    return <Renderer {...props} />;
  }

  return <Renderer {...props} postIdToEdit={postId} />;
}
