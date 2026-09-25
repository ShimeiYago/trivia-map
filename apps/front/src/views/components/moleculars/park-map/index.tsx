import React from 'react';
import { MapContainer, MapContainerProps, TileLayer, ZoomControl } from 'react-leaflet';
import { LatLng, LatLngBoundsExpression, Map as LeafletMap } from 'leaflet';
import { Box, Button, Grid, SxProps, Typography } from '@mui/material';
import { Position } from 'types/position';
import { Park } from 'types/park';
import {
  ATTRIBUTION,
  MAP_MARGIN,
  MAP_MAX_COORINATE,
  TDL_TILE_URL,
  TDS_TILE_URL,
  ZOOMS,
} from 'constant';
import { CRS } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './index.css';
import { DialogScreen } from 'views/components/atoms/dialog-screen';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { blue } from '@mui/material/colors';
import selectionPosition from 'images/selection-position.png';

/* istanbul ignore file */

export class ParkMap extends React.Component<Props, State> {
  static readonly defaultProps: Pick<Props, 'initZoom'> = {
    initZoom: ZOOMS.default,
  };

  state: State = {
    resetting: false,
  };

  constructor(props: Props) {
    super(props);
    this.handleMapCreated = this.handleMapCreated.bind(this);
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (
      this.props.initCenter &&
      JSON.stringify(prevProps.initCenter) !== JSON.stringify(this.props.initCenter)
    ) {
      this.state.map?.setView(this.props.initCenter);
    }

    if (JSON.stringify(prevProps.maxBounds) !== JSON.stringify(this.props.maxBounds)) {
      this.resetView();
    }

    if (prevProps.minZoom !== this.props.minZoom) {
      this.resetView();
    }

    if (
      this.state.map &&
      this.props.positionSelectProps?.active &&
      !prevProps.positionSelectProps?.active
    ) {
      const zoom = this.state.map.getZoom() < ZOOMS.popupOpen ? ZOOMS.popupOpen : undefined;
      zoom && this.state.map.setZoom(zoom);
    }
  }

  render() {
    const { width, height, initZoom, initCenter, disabled, park, children } = this.props;

    if (this.state.resetting) {
      return null;
    }

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

    const maxBounds: LatLngBoundsExpression = this.props.maxBounds ?? [
      [MAP_MARGIN, -MAP_MARGIN],
      [-MAP_MAX_COORINATE - MAP_MARGIN, MAP_MAX_COORINATE + MAP_MARGIN],
    ];

    return (
      <>
        {this.renderGuideDialog()}

        <Box sx={mapWrapper}>
          <MapContainer
            center={center}
            zoom={initZoom}
            zoomControl={false}
            minZoom={this.props.minZoom ?? ZOOMS.min}
            maxZoom={ZOOMS.max}
            crs={CRS.Simple}
            maxBounds={maxBounds}
            whenCreated={this.handleMapCreated}
            tap={false}
            {...(disabled ? disabledProps : {})}
          >
            {park === 'L' && <TileLayer url={TDL_TILE_URL} noWrap attribution={attribution} />}
            {park === 'S' && <TileLayer url={TDS_TILE_URL} noWrap attribution={attribution} />}
            {children}
            {!disabled && <ZoomControl position="bottomleft" />}
          </MapContainer>
        </Box>
      </>
    );
  }

  protected handleMapCreated(map: LeafletMap) {
    this.props.setMap?.(map);
    this.setState({
      map,
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }

  protected renderGuideDialog() {
    if (!this.props.positionSelectProps?.active) {
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
                onClick={this.props.positionSelectProps?.onCancel}
              >
                キャンセル
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                onClick={this.props.positionSelectProps?.onConfirm}
              >
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

  protected resetView = () => {
    this.setState(
      {
        resetting: true,
      },
      () =>
        this.setState({
          resetting: false,
        }),
    );
  };
}

export type Props = {
  width?: number;
  height?: number;
  initZoom?: number;
  initCenter?: Omit<Position, 'park'>;
  disabled?: boolean;
  park: Park;
  maxBounds?: LatLngBoundsExpression;
  minZoom?: number;
  positionSelectProps?: {
    active: boolean;
    onCancel: () => void;
    onConfirm: () => void;
  };
  setMap?: (map: LeafletMap) => void;

  // markers
  children?: React.ReactNode;
};

export type State = {
  map?: LeafletMap;
  resetting: boolean;
};
