import { useAppSelector } from 'store';
import {
  selectArticleFormId,
  selectArticleFormIsEditting,
  selectArticleFormIsFormChangedFromLastSaved,
} from 'store/article-form/selector';
import { Renderer, Props } from './renderer';
import { isMobile } from 'react-device-detect';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { NOT_FOUND_LINK } from 'constant/links';
import {
  selectFilteringCategoryId,
  selectFocusingPark,
  selectInitMapFocus,
} from 'store/markers/selector';
import { updateFilteringCategoryId, updateFocusingPark } from 'store/markers/actions';
import { Park } from 'types/park';
import { useAppDispatch } from 'store';
import { useWindowSize } from 'helper-components/user-window-size';
import { throwError } from 'store/global-error/slice';
import { useNavigate } from 'react-router-dom';

export function MapPage(ownProps: { new?: boolean }) {
  const { postId, userId } = useParams();
  const postIdNumber = Number(postId);
  const userIdNumber = Number(userId);

  const search = useLocation().search;
  const query = new URLSearchParams(search);
  const queryCategoryId = query.get('category') ? Number(query.get('category')) : undefined;

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [width, height] = useWindowSize();

  if ((postId && !postIdNumber) || (userId && !userIdNumber)) {
    return <Navigate to={NOT_FOUND_LINK} />;
  }

  const articleFormId = useAppSelector(selectArticleFormId);

  const postIdToEdit = !!postIdNumber ? postIdNumber : articleFormId;

  let props: Props = {
    park: useAppSelector(selectFocusingPark),
    filteringCategoryId: useAppSelector(selectFilteringCategoryId),
    queryCategoryId: queryCategoryId,
    isFormEditting: useAppSelector(selectArticleFormIsEditting),
    isMobile: isMobile,
    isFormChangedFromLastSaved: useAppSelector(selectArticleFormIsFormChangedFromLastSaved),
    windowWidth: width,
    windowHeight: height,
    new: !!ownProps.new,
    userId: !!userIdNumber ? userIdNumber : undefined,
    initMapFocus: useAppSelector(selectInitMapFocus),

    updateFoocusingPark: (park: Park) => dispatch(updateFocusingPark(park)),
    updateFilteringCategoryId: (categoryId?: number) =>
      dispatch(updateFilteringCategoryId(categoryId)),
    navigate: (to: string) => navigate(to),
    throwError: (errorStatus: number) => dispatch(throwError(errorStatus)),
  };

  if (postIdToEdit) {
    props = {
      ...props,
      postIdToEdit: postIdToEdit,
    };
  }

  return <Renderer {...props} />;
}
