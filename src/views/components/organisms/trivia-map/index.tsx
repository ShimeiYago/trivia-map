import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import { selectMarkerList, selectMarkersLoading } from 'store/markers/selector';
import { fetchMarkers } from 'store/markers/actions';
import { fetchReadingArticle } from 'store/reading-article/actions';

export function TriviaMap() {
  const dispatch = useAppDispatch();

  const props: Props = {
    markerList: useAppSelector(selectMarkerList),
    loadingMarkers: useAppSelector(selectMarkersLoading),

    fetchMarkers: () => dispatch(fetchMarkers()),
    fetchArticle: (postId: string) => dispatch(fetchReadingArticle(postId)),
  };

  return <Renderer {...props} />;
}
