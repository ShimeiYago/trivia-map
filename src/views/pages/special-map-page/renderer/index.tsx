import React from 'react';
import { Park } from 'types/park';
import { CommonHelmet } from 'helper-components/common-helmet';
import { GetSpecialMapResponse, getSpecialMap } from 'api/special-map-api/get-special-map';
import {
  GetSpecialMapMarkersResponse,
  GetSpecialMapMarkersResponseWithPagination,
  getSpecialMapMarkers,
} from 'api/special-map-api/get-special-map-markers';
import { LoadingProgressBar } from 'views/components/moleculars/loading-progress-bar';
import { ParkMap } from 'views/components/moleculars/park-map';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { GlobalMenu } from 'views/components/organisms/global-menu';
import { mapWrapper, metaInfoBox, mapTopArea } from './styles';
import { ParkSelectBox } from 'views/components/moleculars/park-select-box';
import { MapMarker } from 'views/components/moleculars/map-marker';
import { LatLng, Map as LeafletMap } from 'leaflet';
import { Image } from 'views/components/moleculars/image';
import { DynamicAlignedText } from 'views/components/atoms/dynamic-aligned-text';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { NonStyleLink } from 'views/components/atoms/non-style-link';
import { SPECIAL_MAP_DETAIL_PAGE_LINK } from 'constant/links';
import { ApiError } from 'api/utils/handle-axios-error';
import { PARKS, ZOOMS } from 'constant';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loadingSpecialMap: true,
      loadingMarkers: true,
      park: props.park === PARKS.land || props.park === PARKS.sea ? props.park : PARKS.land,
      markers: [],
      loadedMarkerPages: 0,
    };
  }

  componentDidMount(): void {
    this.fetchSpecialMap();
    this.fetchSpecialMapMarkers();
  }

  render() {
    return (
      <>
        <GlobalMenu topBarPosition="static" mapPage>
          {this.renderSpecialMap()}
        </GlobalMenu>
      </>
    );
  }

  protected renderSpecialMap = () => {
    const { windowWidth, windowHeight, isMobile } = this.props;
    const { specialMap } = this.state;

    if (!windowWidth || !windowHeight || !specialMap) {
      return (
        <Box my={1}>
          <CenterSpinner />
        </Box>
      );
    }

    return (
      <>
        <CommonHelmet
          title={specialMap.title}
          description={specialMap.description}
          canonicalUrlPath={SPECIAL_MAP_DETAIL_PAGE_LINK(String(specialMap.specialMapId))}
        />

        <Box sx={mapWrapper(isMobile, windowWidth, windowHeight)}>
          <ParkMap park={this.state.park} setMap={this.setMap}>
            {this.renderMarkers()}
          </ParkMap>

          <Box sx={mapTopArea(isMobile)}>
            {this.renderMetaInfo(specialMap)}

            {this.state.specialMap?.selectablePark === 'both' && (
              <Box textAlign="right">
                <Box display="inline-block">
                  <ParkSelectBox park={this.state.park} onChangePark={this.handleChangePark} />
                </Box>
              </Box>
            )}
          </Box>

          <LoadingProgressBar
            loadedPages={this.state.loadedMarkerPages}
            totalPages={this.state.totalMarkerPages}
            fetchingState={this.state.loadingMarkers ? 'loading' : 'success'}
            isMobile={this.props.isMobile}
          />
        </Box>
      </>
    );
  };

  protected renderMarkers = () => {
    const { markers, map, park } = this.state;

    if (!map) {
      return null;
    }

    return markers.map((marker) => {
      if (marker.park !== park) {
        return null;
      }

      if (marker.specialMapMarkerId === this.props.markerId) {
        map.flyTo(new LatLng(marker.lat, marker.lng), ZOOMS.popupOpen, { animate: false });
      }

      const popup = (
        <Box width={300}>
          {marker.image && (
            <Typography align="center" component="div" mb={2}>
              <Image src={marker.image} maxWidth="full" maxHeight="200px" />
            </Typography>
          )}
          <DynamicAlignedText component="div">{marker.description}</DynamicAlignedText>
        </Box>
      );

      return (
        <MapMarker
          position={new LatLng(marker.lat, marker.lng)}
          mapController={{ map, popup }}
          variant={marker.variant}
          key={`special-map-${marker.lat}-${marker.lng}`}
        />
      );
    });
  };

  protected renderMetaInfo = (specialMap: GetSpecialMapResponse) => {
    return (
      <Box sx={metaInfoBox}>
        <Grid container spacing={0}>
          <Grid item xs={1} pt={0.4}>
            <NonStyleLink to={SPECIAL_MAP_DETAIL_PAGE_LINK(String(this.props.mapId))}>
              <IconButton color="primary">
                <HelpOutlineIcon />
              </IconButton>
            </NonStyleLink>
          </Grid>
          <Grid item xs={10}>
            <Typography component="h2" variant="h6" py={1} align="center">
              {specialMap.title}
            </Typography>
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
      </Box>
    );
  };

  protected fetchSpecialMap = async () => {
    try {
      // use autoRefreshApiWrapper
      const res = await getSpecialMap(this.props.mapId);

      this.setState({
        loadingSpecialMap: false,
        specialMap: res,
        park: res.selectablePark !== 'both' ? res.selectablePark : this.state.park,
      });
    } catch (error) {
      const apiError = error as ApiError<unknown>;

      if (apiError.status === 404 || apiError.status === 401 || apiError.status === 403) {
        this.props.throwError(404);
      } else {
        this.props.throwError(apiError.status);
      }
    }
  };

  protected setMap = (map: LeafletMap) => {
    this.setState({
      map,
    });
  };

  protected fetchSpecialMapMarkers = async () => {
    try {
      let totalPages = 1;
      let loadedPages = 0;
      while (loadedPages < totalPages) {
        let res: GetSpecialMapMarkersResponseWithPagination;
        if (loadedPages === 0) {
          res = await getSpecialMapMarkers({ mapId: this.props.mapId });
          totalPages = res.totalPages;
          this.setState({
            totalMarkerPages: totalPages,
          });
        } else {
          res = await getSpecialMapMarkers({ mapId: this.props.mapId, page: loadedPages + 1 });
        }

        loadedPages += 1;

        this.setState({
          markers: [...this.state.markers, ...res.results],
          loadedMarkerPages: loadedPages,
        });
      }
      this.setState({
        loadingMarkers: false,
      });
    } catch (error) {
      const apiError = error as ApiError<unknown>;
      this.props.throwError(apiError.status);
    }
  };

  protected handleChangePark = (park: Park) => {
    this.setState({
      park,
    });

    // update url param
    const pathname = window.location.pathname;
    const params = `?park=${park}`;

    history.replaceState('', '', pathname + params);
  };
}

export type Props = {
  mapId: number;
  isMobile: boolean;
  windowWidth: number;
  windowHeight: number;
  markerId?: number;
  park?: string;
  editMode: boolean;

  throwError: (errorStatus: number) => void;
};

export type State = {
  specialMap?: GetSpecialMapResponse;
  loadingSpecialMap: boolean;
  markers: GetSpecialMapMarkersResponse[];
  loadingMarkers: boolean;
  park: Park;
  loadedMarkerPages: number;
  totalMarkerPages?: number;
  map?: LeafletMap;
};
