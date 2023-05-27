import { useAppSelector } from 'store';
import {
  selectMarkersLoadedPages,
  selectMarkersFetchingState,
  selectMarkersTotalPages,
} from 'store/markers/selector';
import { isMobile } from 'react-device-detect';
import { LoadingProgressBar, Props } from 'views/components/moleculars/loading-progress-bar';

export function TriviaMapMarkersLoadingProgressBar() {
  const props: Props = {
    fetchingState: useAppSelector(selectMarkersFetchingState),
    loadedPages: useAppSelector(selectMarkersLoadedPages),
    totalPages: useAppSelector(selectMarkersTotalPages),
    isMobile: isMobile,
  };

  return <LoadingProgressBar {...props} />;
}
