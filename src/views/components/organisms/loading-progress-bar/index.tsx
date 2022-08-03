import { useAppSelector } from 'store';
import { Renderer, Props } from './renderer';
import {
  selectMarkersLoadedPages,
  selectMarkersFetchingState,
  selectMarkersTotalPages,
} from 'store/markers/selector';
import { isMobile } from 'react-device-detect';

export function LoadingProgressBar() {
  const props: Props = {
    markersFetchingState: useAppSelector(selectMarkersFetchingState),
    markersLoadedPages: useAppSelector(selectMarkersLoadedPages),
    markersTotalPages: useAppSelector(selectMarkersTotalPages),
    isMobile: isMobile,
  };

  return <Renderer {...props} />;
}
