import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import { selectMarkerList, selectMarkersLoading } from 'store/markers/selector';
import { fetchMarkers } from 'store/markers/actions';
import { updatePosition } from 'store/article-form/actions';
import { Position } from 'types/position';

export function TriviaMap(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const props: Props = {
    markerList: useAppSelector(selectMarkerList),
    loadingMarkers: useAppSelector(selectMarkersLoading),
    newMarkerMode: !!ownProps.newMarkerMode,

    fetchMarkers: () => dispatch(fetchMarkers()),
    onClickPostTitle: ownProps.onClickPostTitle,
    onConfirmNewPosition: (position: Position) =>
      dispatch(updatePosition(position)),
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  onClickPostTitle?: (postId: string) => () => void;
  newMarkerMode?: boolean;
};
