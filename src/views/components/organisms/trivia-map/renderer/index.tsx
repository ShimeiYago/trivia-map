import React from 'react';
import { MapMarker } from 'views/components/moleculars/map-marker';
import { LatLng, Map as LeafletMap } from 'leaflet';
import { Position } from 'types/position';
import { LoadingState } from 'types/loading-state';
import { PostMarkers } from './helpers/post-markers';
import { Park } from 'types/park';
import { MAP_MAX_COORINATE, ZOOMS } from 'constant';
import { Marker } from 'types/marker';
import { MapFocus } from 'types/map-focus';
import { ParkMap } from 'views/components/moleculars/park-map';

export class Renderer extends React.Component<Props, State> {
  static readonly defaultProps: Pick<Props, 'newMarkerMode' | 'initZoom'> = {
    newMarkerMode: false,
    initZoom: ZOOMS.default,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      openableNewMarkerPopup: true,
    };
  }

  componentDidMount() {
    if (
      (this.props.markersFetchingState === 'waiting' && !this.props.doNotShowPostMarkers) ||
      this.props.userId
    ) {
      this.props.fetchMarkers(this.props.park, this.props.userId);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.newMarkerMode && this.props.newMarkerMode && this.state.map) {
      const zoom = this.state.map.getZoom() < ZOOMS.popupOpen ? ZOOMS.popupOpen : undefined;

      if (this.props.articleFormPosition) {
        this.state.map.flyTo(
          {
            lat: this.props.articleFormPosition.lat,
            lng: this.props.articleFormPosition.lng,
          },
          zoom,
          { animate: false },
        );
      } else {
        zoom && this.state.map.setZoom(zoom);
      }
    }

    if (
      this.props.initCenter &&
      JSON.stringify(prevProps.initCenter) !== JSON.stringify(this.props.initCenter)
    ) {
      this.state.map?.setView(this.props.initCenter);
    }

    if (
      (!this.props.doNotShowPostMarkers && prevProps.park !== this.props.park) ||
      prevProps.userId !== this.props.userId
    ) {
      this.props.fetchMarkers(this.props.park, this.props.userId);
    }
  }

  componentWillUnmount() {
    if (this.props.userId) {
      this.props.initializeFetchingState();
    }

    if (this.props.keepMapFocus && this.state.map) {
      this.props.updateInitMapFocus({
        zoom: this.state.map.getZoom(),
        lat: this.state.map.getCenter().lat,
        lng: this.state.map.getCenter().lng,
      });
    }
  }

  render() {
    const { width, height, initZoom, initCenter, disabled, park, newMarkerMode } = this.props;

    const centerCoord = MAP_MAX_COORINATE / 2;
    const center = initCenter
      ? new LatLng(initCenter.lat, initCenter.lng)
      : new LatLng(-centerCoord, centerCoord);

    return (
      <>
        <ParkMap
          width={width}
          height={height}
          initZoom={initZoom}
          initCenter={center}
          disabled={disabled}
          park={park}
          setMap={this.handleSetMap}
          positionSelectProps={{
            active: newMarkerMode,
            onCancel: this.handleClickCancelNewMarker,
            onConfirm: this.handleClickConfirmNewMarker,
          }}
        >
          {this.renderPostMarkers()}
          {this.renderAdittionalMarkers()}
          {this.renderCurrentPositionMarker()}
        </ParkMap>
      </>
    );
  }

  protected handleSetMap = (map: LeafletMap) => {
    this.setState({
      map,
    });
  };

  protected renderPostMarkers() {
    const {
      postMarkers,
      doNotShowPostMarkers,
      newMarkerMode,
      hiddenMarkerIds,
      isFormEditting,
      isMobile,
      categoryId,
    } = this.props;
    if (doNotShowPostMarkers || !this.state.map) {
      return null;
    }

    return (
      <PostMarkers
        map={this.state.map}
        markers={postMarkers}
        popupDisabled={newMarkerMode}
        hiddenMarkerIds={hiddenMarkerIds}
        openFormWithTheMarker={this.openFormWithTheMarker}
        editting={isFormEditting}
        isMobile={isMobile}
        categoryId={categoryId}
        showNumberOfArticles={!this.props.userId}
        userId={this.props.userId}
      />
    );
  }

  protected renderAdittionalMarkers() {
    const { additinalMarkers, isMobile } = this.props;
    const { map } = this.state;
    if (!map) {
      return null;
    }

    return additinalMarkers.map((position, index) => {
      return (
        <MapMarker
          mapController={{ map }}
          position={new LatLng(position.lat, position.lng)}
          key={`additional-marker-${index}`}
          isMobile={isMobile}
          variant="red"
        />
      );
    });
  }

  protected renderCurrentPositionMarker() {
    const {
      park,
      isMobile,
      articleFormPosition,
      shouldCurrentPositionAsyncWithForm,
      newMarkerMode,
    } = this.props;

    if (
      !shouldCurrentPositionAsyncWithForm ||
      !articleFormPosition ||
      articleFormPosition.park !== park ||
      newMarkerMode
    ) {
      return null;
    }

    return (
      this.state.map && (
        <MapMarker
          mapController={{ map: this.state.map }}
          position={new LatLng(articleFormPosition.lat, articleFormPosition.lng)}
          isMobile={isMobile}
          zIndexOffset={999}
        />
      )
    );
  }

  protected handleClickCancelNewMarker = async () => {
    if (this.props.endToSelectPosition) {
      this.props.endToSelectPosition();
    }
  };

  protected handleClickConfirmNewMarker = () => {
    if (!this.state.map) {
      return;
    }

    const newPosition: Position = {
      lat: this.state.map.getCenter().lat,
      lng: this.state.map.getCenter().lng,
      park: this.props.park,
    };
    this.props.updatePosition(newPosition);

    if (this.props.endToSelectPosition) {
      this.props.endToSelectPosition();
    }
  };

  protected handleDragStartNewMarker = () => {
    this.setState({
      openableNewMarkerPopup: false,
    });
  };

  protected openFormWithTheMarker = (position: Position) => {
    this.props.updatePosition(position);
    this.props.updateIsEditting(true);

    if (this.props.endToSelectPosition) {
      this.props.endToSelectPosition();
    }
  };
}

export type Props = {
  postMarkers: Marker[];
  newMarkerMode: boolean;
  articleFormPosition?: Position;
  width?: number;
  height?: number;
  initZoom?: number;
  initCenter?: Omit<Position, 'park'>;
  disabled?: boolean;
  markersFetchingState: LoadingState;
  doNotShowPostMarkers?: boolean;
  hiddenMarkerIds: number[];
  shouldCurrentPositionAsyncWithForm?: boolean;
  additinalMarkers: Position[];
  isFormEditting: boolean;
  park: Park;
  categoryId?: number;
  isMobile: boolean;
  userId?: number;
  keepMapFocus?: boolean;

  fetchMarkers: (park: Park, userId?: number) => void;
  initializeFetchingState: () => void;
  updatePosition: (position: Position) => void;
  endToSelectPosition?: () => void;
  updateIsEditting: (isEditting: boolean) => void;
  updateInitMapFocus: (mapFocus: MapFocus) => void;
};

export type State = {
  openableNewMarkerPopup: boolean;
  map?: LeafletMap;
};
