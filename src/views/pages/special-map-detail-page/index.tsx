import { Renderer, Props } from './renderer';
import { Navigate, useParams } from 'react-router-dom';
import { NOT_FOUND_LINK } from 'constant/links';
import usePageTracking from 'helper-components/tracker';
import { useAppDispatch } from 'store';
import { throwError } from 'store/global-error/slice';

export function SpecialMapDetailPage() {
  const { mapId } = useParams();
  const mapIdNumber = Number(mapId);

  const dispatch = useAppDispatch();

  usePageTracking();

  if (mapId && !mapIdNumber) {
    return <Navigate to={NOT_FOUND_LINK} />;
  }

  const props: Props = {
    mapId: mapIdNumber,

    throwError: (errorStatus: number) => dispatch(throwError(errorStatus)),
  };

  return <Renderer {...props} />;
}
