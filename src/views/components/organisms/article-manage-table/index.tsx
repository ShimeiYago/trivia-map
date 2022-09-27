import { useAppDispatch } from 'store';
import { throwError } from 'store/global-error/slice';
import { Renderer, Props } from './renderer';
import { isMobile } from 'react-device-detect';

export function ArticleManageTable() {
  const dispatch = useAppDispatch();

  const props: Props = {
    throwError: (status: number) => dispatch(throwError(status)),
    isMobile: isMobile,
  };

  return <Renderer {...props} />;
}
