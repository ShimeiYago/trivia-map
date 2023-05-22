import { Renderer, Props } from './renderer';
import { isMobile } from 'react-device-detect';
import usePageTracking from 'helper-components/tracker';
import { useAppDispatch } from 'store';
import { throwError } from 'store/global-error/slice';
import { useNavigate } from 'react-router-dom';

export function SpecialMapListPage() {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  usePageTracking();

  const props: Props = {
    isMobile: isMobile,

    navigate: (to: string) => navigate(to),
    throwError: (errorStatus: number) => dispatch(throwError(errorStatus)),
  };

  return <Renderer {...props} />;
}
