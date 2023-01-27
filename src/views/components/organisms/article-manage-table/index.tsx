import { useAppDispatch } from 'store';
import { throwError } from 'store/global-error/slice';
import { Renderer, Props } from './renderer';
import { isMobile } from 'react-device-detect';
import { initializeFetchingState } from 'store/markers/actions';
import { initialize } from 'store/article-form/actions';
import { updateUser } from 'store/auths/actions';

export function ArticleManageTable() {
  const dispatch = useAppDispatch();

  const props: Props = {
    throwError: (status: number) => dispatch(throwError(status)),
    isMobile: isMobile,
    initializeFetchingState: () => dispatch(initializeFetchingState()),
    initialize: () => dispatch(initialize()),
    refreshUser: () => dispatch(updateUser(undefined)),
  };

  return <Renderer {...props} />;
}
