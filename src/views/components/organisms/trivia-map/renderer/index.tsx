import React from 'react';
import { MapContainer, MapContainerProps, TileLayer, ZoomControl } from 'react-leaflet';
import { MapMarker } from 'views/components/moleculars/map-marker';
import { LatLng, LeafletMouseEvent, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './index.css';
import { Box, Button, Grid, SxProps, Typography } from '@mui/material';
import { Position } from 'types/position';
import { DialogScreen } from 'views/components/atoms/dialog-screen';
import { LoadingState } from 'types/loading-state';
import { PostMarkers } from './helpers/post-markers';
import { Marker } from 'store/markers/model';
import { Park } from 'types/park';
import { MAP_MARGIN, MAP_MAX_COORINATE, TDL_TILE_URL, TDS_TILE_URL, ZOOMS } from 'constant';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { CRS } from 'leaflet';

export class Renderer extends React.Component<Props, State> {
  static readonly defaultProps: Pick<Props, 'newMarkerMode' | 'initZoom'> = {
    newMarkerMode: false,
    initZoom: ZOOMS.default,
  };

  constructor(props: Props) {
    super(props);
    this.handleMapCreated = this.handleMapCreated.bind(this);
    this.state = {
      currentPosition: props.shouldCurrentPositionAsyncWithForm
        ? props.articleFormPosition
        : undefined,
      openableNewMarkerPopup: true,
    };
  }

  componentDidMount() {
    if (this.props.markersFetchingState === 'waiting' && !this.props.doNotShowPostMarkers) {
      this.props.fetchMarkers();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.articleFormPosition !== this.props.articleFormPosition &&
      this.props.shouldCurrentPositionAsyncWithForm
    ) {
      this.setState({
        currentPosition: this.props.articleFormPosition,
      });
    }

    if (
      prevProps.newMarkerMode &&
      !this.props.newMarkerMode &&
      this.props.shouldCurrentPositionAsyncWithForm
    ) {
      this.setState({
        currentPosition: this.props.articleFormPosition,
      });
    }

    if (this.props.initCenter && prevProps.initCenter !== this.props.initCenter) {
      this.state.map?.setView(this.props.initCenter);
    }

    if (
      !this.props.doNotShowPostMarkers &&
      (prevProps.park !== this.props.park || prevProps.categoryId !== this.props.categoryId)
    ) {
      this.props.fetchMarkers();
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
          {park === 'L' && <TileLayer url={TDL_TILE_URL} noWrap />}
          {park === 'S' && <TileLayer url={TDS_TILE_URL} noWrap />}
          {this.renderPostMarkers()}
          {this.renderAdittionalMarkers()}
          {this.renderCurrentPositionMarker()}
          {!disabled && <ZoomControl position="bottomleft" />}
        </MapContainer>
      </Box>
    );
  }

  protected handleMapCreated(map: LeafletMap) {
    map.on('click', this.handleMapClick);
    this.setState({
      map: map,
    });
  }

  protected handleMapClick = (e: LeafletMouseEvent) => {
    if (!this.props.newMarkerMode) {
      return;
    }

    this.setState({
      currentPosition: {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        park: this.props.park,
      },
      openableNewMarkerPopup: false,
    });
    this.setState({
      openableNewMarkerPopup: true,
    });
  };

  protected renderPostMarkers() {
    const { postMarkers, doNotShowPostMarkers, newMarkerMode, hiddenMarkerIds, isFormEditting } =
      this.props;
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
      />
    );
  }

  protected renderAdittionalMarkers() {
    const { additinalMarkers } = this.props;
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
        />
      );
    });
  }

  protected renderCurrentPositionMarker() {
    const { currentPosition, openableNewMarkerPopup } = this.state;
    const { newMarkerMode, park } = this.props;

    if (currentPosition === undefined || currentPosition.park !== park) {
      return null;
    }

    const popup = (
      <Box sx={{ p: 1 }}>
        <Typography align="center" variant="h6" component="p" sx={{ fontWeight: 'bold' }}>
          この位置でよろしいですか？
        </Typography>
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <Grid item xs={2}>
            <TouchAppIcon />
          </Grid>
          <Grid item xs={10}>
            <Typography>マーカーを掴んで位置を調整しましょう。</Typography>
          </Grid>
          <Grid item xs={2}>
            <ChangeCircleOutlinedIcon />
          </Grid>
          <Grid item xs={10}>
            <Typography>あとから位置を変更することができます。</Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} justifyContent="center" sx={{ textAlign: 'center' }}>
          <Grid item xs={6}>
            <Button onClick={this.handleClickCancelNewMarker}>キャンセル</Button>
          </Grid>
          <Grid item xs={6}>
            <Button onClick={this.handleClickConfirmNewMarker}>確定</Button>
          </Grid>
        </Grid>
      </Box>
    );

    return (
      this.state.map && (
        <MapMarker
          map={this.state.map}
          position={new LatLng(currentPosition.lat, currentPosition.lng)}
          popup={newMarkerMode && popup}
          autoOpen={newMarkerMode && openableNewMarkerPopup}
          variant="red"
          draggable={newMarkerMode}
          onDragStart={this.handleDragStartNewMarker}
          onDragEnd={this.handleDragEndNewMarker}
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
    if (!this.state.currentPosition) {
      return;
    }
    this.props.updatePosition(this.state.currentPosition);

    if (this.props.endToSelectPosition) {
      this.props.endToSelectPosition();
    }
  };

  protected handleDragStartNewMarker = () => {
    this.setState({
      openableNewMarkerPopup: false,
    });
  };

  protected handleDragEndNewMarker = (position: LatLng) => {
    this.setState({
      currentPosition: {
        lat: position.lat,
        lng: position.lng,
        park: this.props.park,
      },
      openableNewMarkerPopup: true,
    });
  };

  protected renderGuideDialog() {
    if (!this.props.newMarkerMode || this.state.currentPosition) {
      return null;
    }

    return (
      <DialogScreen theme="black" position="top">
        <Typography align="center" variant="inherit" sx={{ fontWeight: 'bold' }}>
          マップ上の好きな位置をタップしてください。
        </Typography>
      </DialogScreen>
    );
  }

  protected openFormWithTheMarker = (position: Position) => {
    this.setState({
      currentPosition: position,
    });

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
  initCenter?: Position;
  disabled?: boolean;
  markersFetchingState: LoadingState;
  doNotShowPostMarkers?: boolean;
  hiddenMarkerIds: number[];
  shouldCurrentPositionAsyncWithForm?: boolean;
  additinalMarkers: Position[];
  isFormEditting: boolean;
  park: Park;
  categoryId?: number;

  fetchMarkers: () => void;
  updatePosition: (position: Position) => void;
  endToSelectPosition?: () => void;
  updateIsEditting: (isEditting: boolean) => void;
};

export type State = {
  currentPosition?: Position;
  openableNewMarkerPopup: boolean;
  map?: LeafletMap;
};
