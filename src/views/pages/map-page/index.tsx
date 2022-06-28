import { useAppSelector } from 'store';
import {
  selectArticleFormId,
  selectArticleFormIsEditting,
  selectArticleFormIsFormChangedFromLastSaved,
} from 'store/article-form/selector';
import { Renderer, Props } from './renderer';
import { isMobile } from 'react-device-detect';
import { useParams } from 'react-router-dom';

export function MapPage() {
  const { postId } = useParams();
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
