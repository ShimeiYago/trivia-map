import React from 'react';
import { MapContainer, MapContainerProps, TileLayer, ZoomControl } from 'react-leaflet';
import { LatLng, Map as LeafletMap } from 'leaflet';
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

export class ParkMap extends React.Component<Props> {
  static readonly defaultProps: Pick<Props, 'initZoom'> = {
    initZoom: ZOOMS.default,
  };

  constructor(props: Props) {
    super(props);
    this.handleMapCreated = this.handleMapCreated.bind(this);
  }

  render() {
    const { width, height, initZoom, initCenter, disabled, park, children } = this.props;

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
      <>
        {this.renderGuideDialog()}

        <Box sx={mapWrapper}>
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
            {children}
            {!disabled && <ZoomControl position="bottomleft" />}
          </MapContainer>
        </Box>
      </>
    );
  }

  protected handleMapCreated(map: LeafletMap) {
    this.props.setMap?.(map);

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
}

export type Props = {
  width?: number;
  height?: number;
  initZoom?: number;
  initCenter?: Omit<Position, 'park'>;
  disabled?: boolean;
  park: Park;
  positionSelectProps?: {
    active: boolean;
    onCancel: () => void;
    onConfirm: () => void;
  };
  setMap?: (map: LeafletMap) => void;

  // markers
  children?: React.ReactNode;
};
