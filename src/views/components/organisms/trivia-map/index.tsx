import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import { selectMarkerList, selectMarkersLoading } from 'store/markers/selector';
import { fetchMarkers } from 'store/markers/actions';

export function TriviaMap(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const props: Props = {
    markerList: useAppSelector(selectMarkerList),
    loadingMarkers: useAppSelector(selectMarkersLoading),

    fetchMarkers: () => dispatch(fetchMarkers()),
    onClickPostTitle: ownProps.onClickPostTitle,
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  onClickPostTitle?: (postId: string) => () => void;
};
