import { Renderer, Props } from './renderer';
import { isMobile } from 'react-device-detect';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { NOT_FOUND_LINK } from 'constant/links';
import { useAppDispatch } from 'store';
import { useWindowSize } from 'helper-components/user-window-size';
import { throwError } from 'store/global-error/slice';
import { updateUser } from 'store/auths/actions';
import { GetSpecialMapResponse } from 'api/special-map-api/get-special-map';
import { setSpecialMap } from 'store/special-map-setting/actions';

export function SpecialMapPage({ edit }: { edit?: boolean }) {
  const { mapId } = useParams();
  const mapIdNumber = Number(mapId);

  const search = useLocation().search;
  const query = new URLSearchParams(search);
  const markerId = query.get('marker') ? Number(query.get('marker')) : undefined;
  const park = query.get('park');

  const dispatch = useAppDispatch();

  const [width, height] = useWindowSize();

  if (mapId && !mapIdNumber) {
    return <Navigate to={NOT_FOUND_LINK} />;
  }

  const refreshUser = () => dispatch(updateUser(undefined));

  const props: Props = {
    isMobile: isMobile,
    mapId: mapIdNumber,
    windowWidth: width,
    windowHeight: height,
    markerId: markerId,
    park: park ?? undefined,
    editMode: !!edit,

    refreshUser,
    setSpecialMap: (specialMap: GetSpecialMapResponse) => dispatch(setSpecialMap(specialMap)),
    throwError: (errorStatus: number) => dispatch(throwError(errorStatus)),
  };

  return <Renderer {...props} />;
}
