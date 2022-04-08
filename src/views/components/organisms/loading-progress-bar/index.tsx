import { useAppSelector } from 'store';
import { Renderer, Props } from './renderer';
import {
  selectMarkersCurrentPageToLoad,
  selectMarkersErrorMsg,
  selectMarkersFetchingState,
  selectMarkersTotalPages,
} from 'store/markers/selector';
import { isMobile } from 'react-device-detect';

export function LoadingProgressBar() {
  const props: Props = {
    markersFetchingState: useAppSelector(selectMarkersFetchingState),
    markersErrorMsg: useAppSelector(selectMarkersErrorMsg),
    markersCurrentPageToLoad: useAppSelector(selectMarkersCurrentPageToLoad),
    markersTotalPages: useAppSelector(selectMarkersTotalPages),
    isMobile: isMobile,
  };

  return <Renderer {...props} />;
}
