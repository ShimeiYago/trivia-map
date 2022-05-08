import { useAppDispatch, useAppSelector } from 'store';
import {
  selectArticleFormId,
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
  const articleFormId = useAppSelector(selectArticleFormId);
  const postIdToEdit = postId ?? articleFormId;

  const props: Props = {
    isFormEditting: useAppSelector(selectArticleFormIsEditting),
    isMobile: isMobile,
    isFormChangedFromLastSaved: useAppSelector(
      selectArticleFormIsFormChangedFromLastSaved,
    ),
    deleteArticle: (postId: string) => dispatch(deleteArticle(postId)),
  };

  if (!postIdToEdit) {
    return <Renderer {...props} />;
  }

  return <Renderer {...props} postIdToEdit={postIdToEdit} />;
}
