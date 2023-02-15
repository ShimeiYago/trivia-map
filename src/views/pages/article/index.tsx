import { Props, Renderer } from './renderer';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';
import { throwError } from 'store/global-error/slice';
import usePageTracking from 'helper-components/tracker';
import { selectUser } from 'store/auths/selector';
import { initialize } from 'store/article-form/actions';
import { toggleFormModal, updateUser } from 'store/auths/actions';
import { MapFocus } from 'types/map-focus';
import {
  initializeFetchingState,
  updateFocusingPark,
  updateInitMapFocus,
} from 'store/markers/actions';
import { Park } from 'types/park';
import { selectFocusingPark } from 'store/markers/selector';

export function Article() {
  const dispatch = useAppDispatch();

  usePageTracking();

  const { postId } = useParams();
  const postIdNumber = Number(postId);

  if (postIdNumber !== 0 && !postIdNumber) {
    dispatch(throwError(404));
  }

  const props: Props = {
    postId: postIdNumber,
    user: useAppSelector(selectUser),
    focusingPark: useAppSelector(selectFocusingPark),

    initialize: () => dispatch(initialize()),
    throwError: (errorStatus: number) => dispatch(throwError(errorStatus)),
    refreshUser: () => dispatch(updateUser(undefined)),
    toggleAuthFormModal: (open: boolean) => dispatch(toggleFormModal(open)),
    updateInitMapFocus: (mapFocus: MapFocus) => dispatch(updateInitMapFocus(mapFocus)),
    updateFocusingPark: (park: Park) => dispatch(updateFocusingPark(park)),
    initializeFetchingState: () => dispatch(initializeFetchingState()),
  };

  return <Renderer {...props} />;
}
