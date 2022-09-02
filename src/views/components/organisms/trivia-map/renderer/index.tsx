import React from 'react';
import {
  MapContainer,
  MapContainerProps,
  TileLayer,
  ZoomControl,
  Polygon,
} from 'react-leaflet';
import { MapMarker } from 'views/components/moleculars/map-marker';
import { LatLng, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './index.css';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  SxProps,
} from '@mui/material';
import { Position } from 'types/position';
import { LoadingState } from 'types/loading-state';
import { Marker } from 'store/markers/model';
import { Park } from 'types/park';
import { TDL_TILE_URL, TDS_TILE_URL } from 'constant';
import { FloatingButton } from 'views/components/atoms/floating-button';
import coordsData from 'coords-data/coords-data.json';

export class Renderer extends React.Component<Props, State> {
  static readonly defaultProps: Pick<Props, 'newMarkerMode' | 'initZoom'> = {
    newMarkerMode: false,
    initZoom: 1,
  };

  constructor(props: Props) {
    super(props);
    this.handleMapCreated = this.handleMapCreated.bind(this);

    const positions: Position[] = [];
    const areas: Area[] = [];
    let currentIndex = 0;
    for (const [areaId, coords] of Object.entries(coordsData['L'])) {
      const indeces: number[] = [];
      coords.map((coord) => {
        const position: Position = {
          lat: coord[0],
          lng: coord[1],
          park: 'L',
        };
        const duplicatedIndex = myIndexOf(positions, position);
        if (duplicatedIndex) {
          indeces.push(duplicatedIndex);
        } else {
          positions.push({
            lat: coord[0],
            lng: coord[1],
            park: 'L',
          });
          indeces.push(currentIndex);
          currentIndex += 1;
        }
      });
      areas.push({
        park: 'L',
        areaId: areaId,
        positionIndeces: indeces,
      });
    }

    for (const [areaId, coords] of Object.entries(coordsData['S'])) {
      const indeces: number[] = [];
      coords.map((coord) => {
        const position: Position = {
          lat: coord[0],
          lng: coord[1],
          park: 'S',
        };
        const duplicatedIndex = myIndexOf(positions, position);
        if (duplicatedIndex) {
          indeces.push(duplicatedIndex);
        } else {
          positions.push({
            lat: coord[0],
            lng: coord[1],
            park: 'S',
          });
          indeces.push(currentIndex);
          currentIndex += 1;
        }
      });
      areas.push({
        park: 'S',
        areaId: areaId,
        positionIndeces: indeces,
      });
    }

    this.state = {
      areas: areas,
      openableNewMarkerPopup: true,
      positions: positions,
    };
  }

  render() {
    const { width, height, initZoom, initCenter, disabled, park } = this.props;

    const mapWrapper: SxProps = {
      width: width ?? '100%',
      height: height ?? '100%',
    };

    const center = initCenter
      ? new LatLng(initCenter.lat, initCenter.lng)
      : new LatLng(0, 0);

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
        <MapContainer
          center={center}
          zoom={initZoom}
          zoomControl={false}
          minZoom={1}
          maxZoom={4}
          maxBounds={[
            [300, -300],
            [-300, 300],
          ]}
          whenCreated={this.handleMapCreated}
          tap={false}
          {...(disabled ? disabledProps : {})}
        >
          {park === 'L' && <TileLayer url={TDL_TILE_URL} noWrap />}
          {park === 'S' && <TileLayer url={TDS_TILE_URL} noWrap />}
          {this.renderMarkers()}
          {!disabled && <ZoomControl position="bottomleft" />}

          {this.renderPolygons()}
        </MapContainer>

        <FloatingButton icon="add-marker" onClick={this.handleClickAddButton} />

        <Box
          sx={{
            margin: 0,
            top: 'auto',
            right: 20,
            bottom: 100,
            left: 'auto',
            position: 'fixed',
            zIndex: 1000,
            backgroundColor: 'white',
          }}
        >
          <Button onClick={this.download}>ダウンロード</Button>
        </Box>
      </Box>
    );
  }

  protected handleMapCreated(map: LeafletMap) {
    this.setState({
      map: map,
    });
  }

  protected handleClickAddButton = () => {
    const newPositions = [...this.state.positions];
    newPositions.push({
      lat: 0,
      lng: 0,
      park: this.props.park,
    });

    this.setState({
      positions: newPositions,
    });
  };

  protected download = () => {
    const landData = this.state.areas
      .map((area) => {
        if (area.park !== 'L') {
          return null;
        }

        const coords = area.positionIndeces.map((positionIndex) => {
          const position = this.state.positions[positionIndex];
          return [position.lat, position.lng];
        });

        return {
          areaId: area.areaId,
          coords: coords,
        };
      })
      .filter((e) => e);

    const seaData = this.state.areas
      .map((area) => {
        if (area.park !== 'S') {
          return null;
        }

        const coords = area.positionIndeces.map((positionIndex) => {
          const position = this.state.positions[positionIndex];
          return [position.lat, position.lng];
        });

        return {
          areaId: area.areaId,
          coords: coords,
        };
      })
      .filter((e) => e);

    const downloadData = {
      L: Object.fromEntries(
        landData.map((area) => [area?.areaId, area?.coords]),
      ),
      S: Object.fromEntries(
        seaData.map((area) => [area?.areaId, area?.coords]),
      ),
    };

    const blob = new Blob([JSON.stringify(downloadData, null, '  ')], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = url;
    link.setAttribute('download', 'coords-data.json');
    link.click();
    document.body.removeChild(link);
  };

  protected handleChangeArea = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      selectedAreaIndex: Number(event.target.value),
    });
  };

  protected renderMarkers() {
    const { positions } = this.state;
    return positions.map((position, index) => {
      if (position.park !== this.props.park) {
        return null;
      }
      return this.renderMarker(position, index);
    });
  }

  protected renderMarker(position: Position, positionIndex: number) {
    const areaIds: string[] = [];
    this.state.areas.map((area) => {
      if (area.positionIndeces.includes(positionIndex)) {
        areaIds.push(area.areaId);
      }
    });

    const checkBoxes = this.state.areas.map((area, index) => {
      if (area.park !== this.props.park) {
        return null;
      }
      return (
        <FormControlLabel
          key={`checkbox-${index}`}
          control={
            <Checkbox
              checked={areaIds.includes(area.areaId)}
              onChange={this.handleClickCheckBox(index, positionIndex)}
            />
          }
          label={area.areaId}
        />
      );
    });

    const popup = (
      <Box sx={{ p: 1 }}>
        <div>lat: {position.lat}</div>
        <div>lng: {position.lng}</div>
        <FormGroup>{checkBoxes}</FormGroup>
      </Box>
    );

    return (
      this.state.map && (
        <MapMarker
          key={`marker-${positionIndex}`}
          map={this.state.map}
          position={new LatLng(position.lat, position.lng)}
          popup={popup}
          variant="red"
          draggable
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onDragStart={() => {}}
          onDragEnd={this.handleDragEndNewMarker(positionIndex)}
        />
      )
    );
  }

  protected handleClickCheckBox =
    (areaIndex: number, positionIndex: number) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newAreas = [...this.state.areas];
      if (event.target.checked) {
        newAreas[areaIndex].positionIndeces.push(positionIndex);
      } else {
        newAreas[areaIndex].positionIndeces = newAreas[
          areaIndex
        ].positionIndeces.filter((i) => i !== positionIndex);
      }

      this.setState({
        areas: newAreas,
      });
    };

  protected renderPolygons = () => {
    return this.state.areas.map((area) => {
      if (area.park !== this.props.park) {
        return null;
      }

      const positions = area.positionIndeces.map((i) => {
        const position = this.state.positions[i];
        return new LatLng(position.lat, position.lng);
      });
      return (
        <Polygon
          pathOptions={{ color: 'purple' }}
          positions={positions}
          key={`area-${area.areaId}`}
        />
      );
    });
  };

  protected handleDragEndNewMarker =
    (positionIndex: number) => (position: LatLng) => {
      const newPositions = [...this.state.positions];
      newPositions[positionIndex] = {
        lat: position.lat,
        lng: position.lng,
        park: this.props.park,
      };

      this.setState({
        positions: newPositions,
      });
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

  fetchMarkers: (park: Park, category?: number) => void;
  updatePosition: (position: Position) => void;
  endToSelectPosition?: () => void;
  updateIsEditting: (isEditting: boolean) => void;
};

export type State = {
  positions: Position[];
  areas: Area[];
  selectedAreaIndex?: number;
  openableNewMarkerPopup: boolean;
  map?: LeafletMap;
  movingMarkerIndex?: number;
};

type Area = {
  park: Park;
  areaId: string;
  positionIndeces: number[];
};

function myIndexOf(positions: Position[], position: Position) {
  const indeces = positions
    .map((p, index) => {
      if (
        p.lat === position.lat &&
        p.lng === position.lng &&
        p.park === position.park
      ) {
        return index;
      }
    })
    .filter((e) => e);

  if (indeces.length > 0) {
    return indeces[0];
  } else {
    return undefined;
  }
}
