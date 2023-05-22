import { Renderer, Props } from './renderer';
import { isMobile } from 'react-device-detect';
import { Navigate, useParams } from 'react-router-dom';
import { NOT_FOUND_LINK } from 'constant/links';
import usePageTracking from 'helper-components/tracker';
import { useAppDispatch } from 'store';
import { useWindowSize } from 'helper-components/user-window-size';
import { throwError } from 'store/global-error/slice';
import { useNavigate } from 'react-router-dom';

export function SpecialMapPage() {
  const { mapId } = useParams();
  const mapIdNumber = Number(mapId);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [width, height] = useWindowSize();

  usePageTracking();

  if (mapId && !mapIdNumber) {
    return <Navigate to={NOT_FOUND_LINK} />;
  }

  const props: Props = {
    isMobile: isMobile,
    mapId: mapIdNumber,
    windowWidth: width,
    windowHeight: height,

    navigate: (to: string) => navigate(to),
    throwError: (errorStatus: number) => dispatch(throwError(errorStatus)),
  };

  return <Renderer {...props} />;
}
