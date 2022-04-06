import { useAppSelector } from 'store';
import { Renderer, Props } from './renderer';
import {
  selectMarkersCurrentPageToLoad,
  selectMarkersFetchingState,
  selectMarkersTotalPages,
} from 'store/markers/selector';

export function LoadingProgressBar() {
  const props: Props = {
    markersFetchingState: useAppSelector(selectMarkersFetchingState),
    markersCurrentPageToLoad: useAppSelector(selectMarkersCurrentPageToLoad),
    markersTotalPages: useAppSelector(selectMarkersTotalPages),
  };

  return <Renderer {...props} />;
}
