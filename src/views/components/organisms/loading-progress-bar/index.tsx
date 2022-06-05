import { useAppSelector } from 'store';
import { Renderer, Props } from './renderer';
import {
  selectMarkersLoadedRecords,
  selectMarkersErrorMsg,
  selectMarkersFetchingState,
  selectMarkersTotalRecords,
} from 'store/markers/selector';
import { isMobile } from 'react-device-detect';

export function LoadingProgressBar() {
  const props: Props = {
    markersFetchingState: useAppSelector(selectMarkersFetchingState),
    markersErrorMsg: useAppSelector(selectMarkersErrorMsg),
    markersLoadedRecords: useAppSelector(selectMarkersLoadedRecords),
    markersTotalRecords: useAppSelector(selectMarkersTotalRecords),
    isMobile: isMobile,
  };

  return <Renderer {...props} />;
}
