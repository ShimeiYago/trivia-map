import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import { selectMarkerList, selectMarkersLoading } from 'store/markers/selector';
import { fetchMarkers } from 'store/markers/actions';
import { updatePosition } from 'store/article-form/actions';
import { Position } from 'types/position';
import { selectArticleFormPosition } from 'store/article-form/selector';

export function TriviaMap(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const props: Props = {
    markerList: !ownProps.doNotShowPosts
      ? useAppSelector(selectMarkerList)
      : [],
    loadingMarkers: useAppSelector(selectMarkersLoading),
    newMarkerMode: !!ownProps.newMarkerMode,
    articleFormPosition: useAppSelector(selectArticleFormPosition),
    width: ownProps.width,
    height: ownProps.height,
    initZoom: ownProps.initZoom,
    initCenter: ownProps.initCenter,
    disabled: ownProps.disabled,

    fetchMarkers: () => dispatch(fetchMarkers()),
    onClickPostTitle: ownProps.onClickPostTitle,
    updatePosition: (position: Position) => dispatch(updatePosition(position)),
    endToSelectPosition: ownProps.endToSelectPosition,
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  onClickPostTitle?: (postId: string) => () => void;
  newMarkerMode?: boolean;
  endToSelectPosition?: () => void;
  width?: number;
  height?: number;
  initZoom?: number;
  initCenter?: Position;
  disabled?: boolean;
  doNotShowPosts?: boolean;
};
