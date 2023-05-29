import React from 'react';
import { MapContainer, MapContainerProps, TileLayer, ZoomControl } from 'react-leaflet';
import { LatLng, Map as LeafletMap } from 'leaflet';
import { Box, SxProps } from '@mui/material';
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
    );
  }

  protected handleMapCreated(map: LeafletMap) {
    this.props.setMap?.(map);

    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }
}

export type Props = {
  width?: number;
  height?: number;
  initZoom?: number;
  initCenter?: Omit<Position, 'park'>;
  disabled?: boolean;
  park: Park;
  setMap?: (map: LeafletMap) => void;

  // markers
  children?: React.ReactNode;
};
