import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { MapMarker } from 'views/components/moleculars/map-marker';
import { LatLng, LeafletMouseEvent, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './index.css';
import { Marker } from 'store/markers/model';
import { Box, Button, Grid, Typography } from '@mui/material';
import { Position } from 'types/position';

export class Renderer extends React.Component<Props, State> {
  static readonly defaultProps = {
    newMarkerMode: false,
  };

  constructor(props: Props) {
    super(props);
    this.handleMapCreated = this.handleMapCreated.bind(this);
    this.state = {
      currentPosition: undefined,
      openNewMarkerPopup: true,
    };
  }

  componentDidMount() {
    this.props.fetchMarkers();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.newMarkerMode !== this.props.newMarkerMode) {
      this.setState({
        currentPosition: this.props.newMarkerMode
          ? this.props.articleFormPosition
          : undefined,
      });
    }
  }

  render() {
    return (
      <MapContainer
        center={new LatLng(0, 0)}
        zoom={1}
        minZoom={1}
        maxZoom={4}
        maxBounds={[
          [300, -300],
          [-300, 300],
        ]}
        whenCreated={this.handleMapCreated}
      >
        <TileLayer
          attribution="<a href='https://www.tokyodisneyresort.jp/tds/map.html' target='_blank'>【公式】マップ | 東京ディズニーシー</a>"
          url="/tds-map-tiles/{z}/{x}/{y}.png"
          noWrap
        />
        {this.renderPostMarkers()}
        {this.renderCurrentPositionMarker()}
      </MapContainer>
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
      currentPosition: { lat: e.latlng.lat, lng: e.latlng.lng },
    });
  };

  protected renderPostMarkers() {
    return this.props.markerList.map((marker) => {
      const popup = this.props.onClickPostTitle ? (
        <Button
          variant="text"
          onClick={this.props.onClickPostTitle(marker.postId)}
        >
          {marker.title}
        </Button>
      ) : (
        <Typography>{marker.title}</Typography>
      );

      return (
        this.state.map && (
          <MapMarker
            map={this.state.map}
            position={new LatLng(marker.position.lat, marker.position.lng)}
            popup={!this.props.newMarkerMode && popup}
            key={marker.postId}
          />
        )
      );
    });
  }

  protected renderCurrentPositionMarker() {
    const { currentPosition, openNewMarkerPopup } = this.state;

    if (currentPosition === undefined) {
      return null;
    }

    const popup = (
      <Box sx={{ p: 1 }}>
        <Typography
          align="center"
          variant="h6"
          component="p"
          sx={{ fontWeight: 'bold' }}
        >
          この位置でよろしいですか？
        </Typography>
        <Typography variant="subtitle2" component="p">
          ※このマーカーは掴んで移動することができます。
        </Typography>
        <Typography variant="subtitle2" component="p">
          ※あとで変更することができます。
        </Typography>

        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{ textAlign: 'center' }}
        >
          <Grid item xs={6}>
            <Button onClick={this.handleClickCancelNewMarker}>
              キャンセル
            </Button>
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
          popup={popup}
          autoOpen={openNewMarkerPopup}
          variant="red"
          draggable
          onDragStart={this.handleDragStartNewMarker}
          onDragEnd={this.handleDragEndNewMarker}
        />
      )
    );
  }

  protected handleClickCancelNewMarker = async () => {
    this.setState({
      currentPosition: undefined,
    });
  };

  protected handleClickConfirmNewMarker = () => {
    if (!this.state.currentPosition) {
      return;
    }
    this.props.updatePosition(this.state.currentPosition);

    this.setState({
      currentPosition: undefined,
    });

    if (this.props.onConfirmNewPosition) {
      this.props.onConfirmNewPosition();
    }
  };

  protected handleDragStartNewMarker = () => {
    this.setState({
      openNewMarkerPopup: false,
    });
  };

  protected handleDragEndNewMarker = (position: LatLng) => {
    this.setState({
      currentPosition: { lat: position.lat, lng: position.lng },
      openNewMarkerPopup: true,
    });
  };
}

export type Props = {
  markerList: Marker[];
  loadingMarkers: boolean;
  newMarkerMode: boolean;
  articleFormPosition?: Position;

  fetchMarkers: () => void;
  onClickPostTitle?: (postId: string) => () => void;
  updatePosition: (position: Position) => void;
  onConfirmNewPosition?: () => void;
};

export type State = {
  currentPosition?: Position;
  openNewMarkerPopup: boolean;
  map?: LeafletMap;
};
