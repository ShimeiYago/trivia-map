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
import usePageTracking from 'helper-components/tracker';
import { selectFilteringCategoryId, selectFocusingPark } from 'store/markers/selector';
import { updateFilteringCategoryId, updateFocusingPark } from 'store/markers/actions';
import { Park } from 'types/park';
import { useAppDispatch } from 'store';
import { Helmet } from 'react-helmet-async';
import { TOP_TITLE_TAG } from 'constant';

export function MapPage() {
  const { postId } = useParams();
  const postIdNumber = Number(postId);

  const dispatch = useAppDispatch();

  usePageTracking();

  if (postId && !postIdNumber) {
    return <Navigate to={NOT_FOUND_LINK} />;
  }

  const articleFormId = useAppSelector(selectArticleFormId);
  const postIdToEdit = Number(postId) ?? articleFormId;

  let props: Props = {
    park: useAppSelector(selectFocusingPark),
    filteringCategoryId: useAppSelector(selectFilteringCategoryId),
    isFormEditting: useAppSelector(selectArticleFormIsEditting),
    isMobile: isMobile,
    isFormChangedFromLastSaved: useAppSelector(selectArticleFormIsFormChangedFromLastSaved),

    updateFoocusingPark: (park: Park) => dispatch(updateFocusingPark(park)),
    updateFilteringCategoryId: (categoryId?: number) =>
      dispatch(updateFilteringCategoryId(categoryId)),
  };

  if (postIdToEdit) {
    props = {
      ...props,
      postIdToEdit: postIdToEdit,
    };
  }

  return (
    <>
      <Helmet>
        <title>{TOP_TITLE_TAG}</title>
      </Helmet>
      <Renderer {...props} />
    </>
  );
}
