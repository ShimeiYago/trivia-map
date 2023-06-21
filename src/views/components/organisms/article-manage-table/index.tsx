import { useAppDispatch } from 'store';
import { throwError } from 'store/global-error/slice';
import { Renderer, Props } from './renderer';
import { isMobile } from 'react-device-detect';
import { initializeFetchingState } from 'store/markers/actions';
import { initialize } from 'store/article-form/actions';
import { updateUser } from 'store/auths/actions';
import { useLocation } from 'react-router-dom';
import { GetMyArticlesParam } from 'api/articles-api/get-my-articles';
import { PARKS } from 'constant';

export function ArticleManageTable() {
  const dispatch = useAppDispatch();

  const search = useLocation().search;
  const query = new URLSearchParams(search);

  const parkParam = query.get('park');
  const isDraftParam = query.get('isDraft');

  const conditions: GetMyArticlesParam = {
    category: query.get('category') ? Number(query.get('category')) : undefined,
    park: parkParam === PARKS.land || parkParam === PARKS.sea ? parkParam : undefined,
    page: query.get('page') ? Number(query.get('page')) : 1,
    isDraft: isDraftParam === 'true' || isDraftParam === 'false' ? isDraftParam : undefined,
  };

  const props: Props = {
    throwError: (status: number) => dispatch(throwError(status)),
    isMobile: isMobile,
    initializeFetchingState: () => dispatch(initializeFetchingState()),
    initialize: () => dispatch(initialize()),
    refreshUser: () => dispatch(updateUser(undefined)),
    initialSearchParam: conditions,
  };

  return <Renderer {...props} />;
}
