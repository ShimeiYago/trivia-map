import { useAppDispatch, useAppSelector } from 'store';
import { throwError } from 'store/global-error/slice';
import { Renderer, Props } from './renderer';
import { isMobile } from 'react-device-detect';
import { fetchMarkers } from 'store/markers/actions';
import { initialize } from 'store/article-form/actions';
import { Park } from 'types/park';
import { selectFocusingPark } from 'store/markers/selector';

export function ArticleManageTable() {
  const dispatch = useAppDispatch();

  const props: Props = {
    park: useAppSelector(selectFocusingPark),
    throwError: (status: number) => dispatch(throwError(status)),
    isMobile: isMobile,
    fetchMarkers: (park: Park) => dispatch(fetchMarkers(park)),
    initialize: () => dispatch(initialize()),
  };

  return <Renderer {...props} />;
}
