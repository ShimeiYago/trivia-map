import { Props, Renderer } from './renderer';
import { useAppDispatch, useAppSelector } from 'store';
import { selectMarkers, selectMarkersFetchingState } from 'store/markers/selector';
import { fetchMarkers } from 'store/markers/actions';
import { updateFormField, updateIsEditting } from 'store/article-form/actions';
import { Position } from 'types/position';
import {
  selectArticleFormIsEditting,
  selectArticleFormPosition,
} from 'store/article-form/selector';
import { Park } from 'types/park';
import { isMobile } from 'react-device-detect';

export function TriviaMap(ownProps: OwnProps) {
  const dispatch = useAppDispatch();

  const props: Props = {
    postMarkers: useAppSelector(selectMarkers),
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
    shouldCurrentPositionAsyncWithForm: ownProps.shouldCurrentPositionAsyncWithForm,
    additinalMarkers: ownProps.additinalMarkers ?? [],
    isFormEditting: useAppSelector(selectArticleFormIsEditting),
    park: ownProps.park,
    categoryId: ownProps.categoryId,
    isMobile: isMobile,

    fetchMarkers: (park: Park) => dispatch(fetchMarkers(park)),
    updatePosition: (position: Position) => dispatch(updateFormField({ position: position })),
    endToSelectPosition: ownProps.endToSelectPosition,
    updateIsEditting: (isEditting: boolean) => dispatch(updateIsEditting(isEditting)),
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
  hiddenMarkerIds?: number[];
  shouldCurrentPositionAsyncWithForm?: boolean;
  additinalMarkers?: Position[];
  park: Park;
  categoryId?: number;
};
