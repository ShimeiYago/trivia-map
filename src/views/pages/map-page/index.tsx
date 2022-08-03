import { useAppSelector } from 'store';
import {
  selectArticleFormId,
  selectArticleFormIsEditting,
  selectArticleFormIsFormChangedFromLastSaved,
} from 'store/article-form/selector';
import { Renderer, Props } from './renderer';
import { isMobile } from 'react-device-detect';
import { Navigate, useParams } from 'react-router-dom';
import { NOT_FOUND_LINK } from 'constant/links';

export function MapPage() {
  const { postId } = useParams();
  const postIdNumber = Number(postId);

  if (postId && !postIdNumber) {
    return <Navigate to={NOT_FOUND_LINK} />;
  }

  const articleFormId = useAppSelector(selectArticleFormId);
  const postIdToEdit = Number(postId) ?? articleFormId;

  const props: Props = {
    isFormEditting: useAppSelector(selectArticleFormIsEditting),
    isMobile: isMobile,
    isFormChangedFromLastSaved: useAppSelector(
      selectArticleFormIsFormChangedFromLastSaved,
    ),
  };

  if (!postIdToEdit) {
    return <Renderer {...props} />;
  }

  return <Renderer {...props} postIdToEdit={postIdToEdit} />;
}
