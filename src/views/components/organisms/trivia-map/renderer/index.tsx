import React from 'react';
import { MapContainer, MapContainerProps, TileLayer, ZoomControl } from 'react-leaflet';
import { MapMarker } from 'views/components/moleculars/map-marker';
import { LatLng, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './index.css';
import { Box, Button, Grid, SxProps, Typography } from '@mui/material';
import { Position } from 'types/position';
import { DialogScreen } from 'views/components/atoms/dialog-screen';
import { LoadingState } from 'types/loading-state';
import { PostMarkers } from './helpers/post-markers';
import { Park } from 'types/park';
import {
  ATTRIBUTION,
  MAP_MARGIN,
  MAP_MAX_COORINATE,
  TDL_TILE_URL,
  TDS_TILE_URL,
  ZOOMS,
} from 'constant';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { CRS } from 'leaflet';
import selectionPosition from 'images/selection-position.png';
import { blue } from '@mui/material/colors';
import { Marker } from 'types/marker';
import { MapFocus } from 'types/map-focus';

export class Renderer extends React.Component<Props, State> {
  static readonly defaultProps: Pick<Props, 'newMarkerMode' | 'initZoom'> = {
    newMarkerMode: false,
    initZoom: ZOOMS.default,
  };

  constructor(props: Props) {
    super(props);
    this.handleMapCreated = this.handleMapCreated.bind(this);
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
    const { width, height, initZoom, initCenter, disabled, park } = this.props;

    const mapWrapper: SxProps = {
      width: width ?? '100%',
      height: height ?? '100%',
    };

    const centerCoord = MAP_MAX_COORINATE / 2;
    const center = initCenter
      ? new LatLng(initCenter.lat, initCenter.lng)
      : new LatLng(-centerCoord, centerCoord);

    const disabledProps: MapContainerProps = {
      dragging: false,
      keyboard: false,
      touchZoom: false,
      doubleClickZoom: false,
      scrollWheelZoom: false,
      boxZoom: false,
    };

    const attribution = `&copy; <a target="_blank" href="${ATTRIBUTION.url}">${ATTRIBUTION.text}</a>`;

    return (
      <Box sx={mapWrapper}>
        {this.renderGuideDialog()}

        <MapContainer
          center={center}
          zoom={initZoom}
          zoomControl={false}
          minZoom={ZOOMS.min}
          maxZoom={ZOOMS.max}
          crs={CRS.Simple}
          maxBounds={[
            [MAP_MARGIN, -MAP_MARGIN],
            [-MAP_MAX_COORINATE - MAP_MARGIN, MAP_MAX_COORINATE + MAP_MARGIN],
          ]}
          whenCreated={this.handleMapCreated}
          tap={false}
          {...(disabled ? disabledProps : {})}
        >
          {park === 'L' && <TileLayer url={TDL_TILE_URL} noWrap attribution={attribution} />}
          {park === 'S' && <TileLayer url={TDS_TILE_URL} noWrap attribution={attribution} />}
          {this.renderPostMarkers()}
          {this.renderAdittionalMarkers()}
          {this.renderCurrentPositionMarker()}
          {!disabled && <ZoomControl position="bottomleft" />}
        </MapContainer>
      </Box>
    );
  }

  protected handleMapCreated(map: LeafletMap) {
    this.setState({
      map: map,
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }

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
          map={map}
          position={new LatLng(position.lat, position.lng)}
          key={`additional-marker-${index}`}
          isMobile={isMobile}
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
          map={this.state.map}
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

  protected renderGuideDialog() {
    if (!this.props.newMarkerMode) {
      return null;
    }

    return (
      <>
        <DialogScreen theme="black" position="top" maxWidth={400}>
          <Typography align="center" variant="inherit" sx={{ fontWeight: 'bold' }}>
            マップを動かして
            <br />
            位置を確定してください。
          </Typography>

          <Typography align="center" variant="inherit" sx={{ mb: 2 }}>
            <TouchAppIcon />
          </Typography>

          <Grid
            container
            spacing={2}
            justifyContent="center"
            sx={{ textAlign: 'center', color: blue[100] }}
          >
            <Grid item xs={6}>
              <Button
                color="inherit"
                variant="outlined"
                fullWidth
                onClick={this.handleClickCancelNewMarker}
              >
                キャンセル
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" fullWidth onClick={this.handleClickConfirmNewMarker}>
                確定
              </Button>
            </Grid>
          </Grid>
        </DialogScreen>

        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            display: 'inline-block',
            transform: 'translate(-50%,-50%)',
            zIndex: 1001,
          }}
        >
          <img src={selectionPosition} />
        </Box>
      </>
    );
  }

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
