import { Renderer, Props } from './renderer';
import { isMobile } from 'react-device-detect';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { NOT_FOUND_LINK } from 'constant/links';
import { RootState, useAppDispatch, useAppSelector } from 'store';
import { useWindowSize } from 'helper-components/user-window-size';
import { throwError } from 'store/global-error/slice';
import { updateUser } from 'store/auths/actions';
import { GetSpecialMapResponse } from 'api/special-map-api/get-special-map';
import { setSpecialMap } from 'store/special-map-setting/actions';
import { selectSpecialMapSetting } from 'store/special-map-setting/selector';
import {
  updatePosition,
  initialize,
  setSpecialMapMarkerForm,
} from 'store/special-map-marker-form/actions';
import { Position } from 'types/position';
import { GetSpecialMapMarkersResponse } from 'api/special-map-api/get-special-map-markers';
import { selectAutoLoggingInState, selectUser } from 'store/auths/selector';

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
    specialMapSettingForm: useAppSelector(selectSpecialMapSetting),
    specialMapMarkerForm: useAppSelector((state: RootState) => state.specialMapMarkerForm),
    user: useAppSelector(selectUser),
    autoLoggingInState: useAppSelector(selectAutoLoggingInState),

    refreshUser,
    setSpecialMap: (specialMap: GetSpecialMapResponse) => dispatch(setSpecialMap(specialMap)),
    throwError: (errorStatus: number) => dispatch(throwError(errorStatus)),
    updatePosition: (position: Position) => dispatch(updatePosition(position)),
    initializeSpecialMapForm: () => dispatch(initialize()),
    setSpecialMapMarkerForm: (marker: GetSpecialMapMarkersResponse) =>
      dispatch(setSpecialMapMarkerForm(marker)),
  };

  return <Renderer {...props} />;
}
