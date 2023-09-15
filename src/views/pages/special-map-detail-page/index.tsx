import { Renderer, Props } from './renderer';
import { Navigate, useParams } from 'react-router-dom';
import { NOT_FOUND_LINK } from 'constant/links';
import { useAppDispatch, useAppSelector } from 'store';
import { throwError } from 'store/global-error/slice';
import { selectUser } from 'store/auths/selector';
import { isMobile } from 'react-device-detect';

export function SpecialMapDetailPage() {
  const { mapId } = useParams();
  const mapIdNumber = Number(mapId);

  const dispatch = useAppDispatch();

  if (mapId && !mapIdNumber) {
    return <Navigate to={NOT_FOUND_LINK} />;
  }

  const props: Props = {
    mapId: mapIdNumber,
    user: useAppSelector(selectUser),
    isMobile: isMobile,

    throwError: (errorStatus: number) => dispatch(throwError(errorStatus)),
  };

  return <Renderer {...props} />;
}
