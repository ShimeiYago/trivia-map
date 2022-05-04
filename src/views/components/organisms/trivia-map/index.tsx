import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectMarkersDict,
  selectMarkersFetchingState,
} from 'store/markers/selector';
import { fetchMarkers } from 'store/markers/actions';
import { updateFormField } from 'store/article-form/actions';
import { Position } from 'types/position';
import { selectArticleFormPosition } from 'store/article-form/selector';

export function TriviaMap(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const props: Props = {
    postMarkers: useAppSelector(selectMarkersDict),
    newMarkerMode: !!ownProps.newMarkerMode,
    articleFormPosition: useAppSelector(selectArticleFormPosition),
    width: ownProps.width,
    height: ownProps.height,
    initZoom: ownProps.initZoom,
    initCenter: ownProps.initCenter,
    disabled: ownProps.disabled,
    markersFetchingState: useAppSelector(selectMarkersFetchingState),
    doNotShowPostMarkers: ownProps.doNotShowPostMarkers,
    hiddenMarkerIds: ownProps.hiddenMarkerIds ?? [],
    shouldCurrentPositionAsyncWithForm:
      ownProps.shouldCurrentPositionAsyncWithForm,
    additinalMarkers: ownProps.additinalMarkers ?? [],

    fetchMarkers: () => dispatch(fetchMarkers()),
    updatePosition: (position: Position) =>
      dispatch(updateFormField({ position: position })),
    endToSelectPosition: ownProps.endToSelectPosition,
  };

  return <Renderer {...props} />;
}

type OwnProps = {
  newMarkerMode?: boolean;
  endToSelectPosition?: () => void;
  width?: number;
  height?: number;
  initZoom?: number;
  initCenter?: Position;
  disabled?: boolean;
  doNotShowPostMarkers?: boolean;
  hiddenMarkerIds?: string[];
  shouldCurrentPositionAsyncWithForm?: boolean;
  additinalMarkers?: Position[];
};
