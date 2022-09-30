import { useAppDispatch } from 'store';
import { throwError } from 'store/global-error/slice';
import { Renderer, Props } from './renderer';
import { isMobile } from 'react-device-detect';
import { fetchMarkers } from 'store/markers/actions';

export function ArticleManageTable() {
  const dispatch = useAppDispatch();

  const props: Props = {
    throwError: (status: number) => dispatch(throwError(status)),
    isMobile: isMobile,
    fetchMarkers: () => dispatch(fetchMarkers()),
  };

  return <Renderer {...props} />;
}
