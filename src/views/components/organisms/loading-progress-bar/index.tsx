import { useAppSelector } from 'store';
import { Renderer, Props } from './renderer';
import {
  selectMarkersCurrentPageToLoad,
  selectMarkersLoading,
  selectMarkersTotalPages,
} from 'store/markers/selector';

export function LoadingProgressBar() {
  const props: Props = {
    markersLoading: useAppSelector(selectMarkersLoading),
    markersCurrentPageToLoad: useAppSelector(selectMarkersCurrentPageToLoad),
    markersTotalPages: useAppSelector(selectMarkersTotalPages),
  };

  return <Renderer {...props} />;
}
