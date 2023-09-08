import { useAppDispatch } from 'store';
import { throwError } from 'store/global-error/slice';
import { Renderer, Props } from './renderer';
import { isMobile } from 'react-device-detect';
import { updateUser } from 'store/auths/actions';
import { useLocation } from 'react-router-dom';

export function SpecialMapManageTable() {
  const dispatch = useAppDispatch();

  const search = useLocation().search;
  const query = new URLSearchParams(search);

  const props: Props = {
    throwError: (status: number) => dispatch(throwError(status)),
    isMobile: isMobile,
    refreshUser: () => dispatch(updateUser(undefined)),
    initSearchParam: { page: query.get('page') ? Number(query.get('page')) : 1 },
  };

  return <Renderer {...props} />;
}
