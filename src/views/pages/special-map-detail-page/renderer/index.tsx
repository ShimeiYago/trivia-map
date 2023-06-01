import React from 'react';
import { CommonHelmet } from 'helper-components/common-helmet';
import { GetSpecialMapResponse, getSpecialMap } from 'api/special-map-api/get-special-map';
import {
  GetSpecialMapMarkersResponse,
  GetSpecialMapMarkersResponseWithPagination,
  getSpecialMapMarkers,
} from 'api/special-map-api/get-special-map-markers';
import { ParkMap } from 'views/components/moleculars/park-map';
import { CenterSpinner } from 'views/components/atoms/center-spinner';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { MapMarker } from 'views/components/moleculars/map-marker';
import { LatLng } from 'leaflet';
import { Image } from 'views/components/moleculars/image';
import { DynamicAlignedText } from 'views/components/atoms/dynamic-aligned-text';
import { ArticleWrapper } from 'views/components/organisms/article-wrapper';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import { MyIcon } from 'views/components/atoms/my-icon';
import { SPECIAL_MAP_PAGE_LINK } from 'constant/links';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { NonStyleLink } from 'views/components/atoms/non-style-link';
import { ApiError } from 'api/utils/handle-axios-error';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loadingSpecialMap: true,
      loadingMarkers: true,
      markers: [],
    };
  }

  componentDidMount(): void {
    this.fetchSpecialMap();
    this.fetchSpecialMapMarkers();
  }

  render() {
    const { mapId } = this.props;

    const localBackNavi = {
      text: '全体マップへ戻る',
      link: SPECIAL_MAP_PAGE_LINK(String(mapId)),
    };

    return (
      <ArticleWrapper showSidebar localBackNavi={localBackNavi}>
        {this.renderContent()}
      </ArticleWrapper>
    );
  }

  renderContent() {
    const { specialMap } = this.state;

    if (!specialMap) {
      return (
        <Box my={1}>
          <CenterSpinner />
        </Box>
      );
    }

    const { title, thumbnail, description } = specialMap;

    return (
      <>
        <CommonHelmet
          title={title}
          description={description}
          imageUrl={thumbnail ?? undefined}
          ogType="article"
        />
        <Stack spacing={2}>
          <DynamicAlignedText
            component="h2"
            variant="h4"
            sx={{
              wordBreak: 'break-all',
            }}
          >
            {title}
          </DynamicAlignedText>

          {thumbnail && <Image src={thumbnail} width="full" />}

          <Typography whiteSpace="pre-wrap" fontSize={18}>
            {description}
          </Typography>

          <Divider />

          <IconAndText
            align="center"
            variant="h6"
            component="h3"
            text="ピン一覧"
            iconComponent={<MyIcon variant="map-marker" />}
            iconPosition="left"
          />

          {this.renderMarkers()}
        </Stack>
      </>
    );
  }

  protected renderMarkers = () => {
    const { markers, loadingMarkers } = this.state;

    const markerComponents = markers.map((marker) => {
      return (
        <Box
          border="3px solid #424242"
          bgcolor="#f5f8fa"
          key={`special-map-marker-${marker.lat}-${marker.lng}`}
        >
          <NonStyleLink to={SPECIAL_MAP_PAGE_LINK(String(this.props.mapId))}>
            <Box height={200} mx="auto">
              <ParkMap
                park={marker.park}
                initCenter={{ lat: marker.lat, lng: marker.lng }}
                disabled
              >
                <MapMarker position={new LatLng(marker.lat, marker.lng)} variant={marker.variant} />
              </ParkMap>
            </Box>
          </NonStyleLink>

          <Box p={1}>
            <DynamicAlignedText component="div" mb={1}>
              {marker.description}
            </DynamicAlignedText>

            {marker.image && (
              <Typography align="center" component="div" mb={1}>
                <Image src={marker.image} height="300px" />
              </Typography>
            )}

            <NonStyleLink to={SPECIAL_MAP_PAGE_LINK(String(this.props.mapId))}>
              <Typography align="right">
                <Button>
                  <IconAndText
                    iconComponent={<ArrowRightIcon />}
                    text="地図上で確認する"
                    component="span"
                    iconPosition="left"
                  />
                </Button>
              </Typography>
            </NonStyleLink>
          </Box>
        </Box>
      );
    });

    return (
      <Stack spacing={2}>
        {markerComponents}
        {loadingMarkers && <CenterSpinner />}
      </Stack>
    );
  };

  protected fetchSpecialMap = async () => {
    try {
      const res = await getSpecialMap(this.props.mapId);

      this.setState({
        loadingSpecialMap: false,
        specialMap: res,
      });
    } catch (error) {
      const apiError = error as ApiError<unknown>;

      if (apiError.status === 404 || apiError.status === 401 || apiError.status === 403) {
        this.props.throwError(404);
      } else {
        this.props.throwError(500);
      }
    }
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
        } else {
          res = await getSpecialMapMarkers({ mapId: this.props.mapId, page: loadedPages + 1 });
        }

        loadedPages += 1;

        this.setState({
          markers: [...this.state.markers, ...res.results],
        });
      }
      this.setState({
        loadingMarkers: false,
      });
    } catch (error) {
      this.props.throwError(500);
    }
  };
}

export type Props = {
  mapId: number;

  throwError: (errorStatus: number) => void;
};

export type State = {
  specialMap?: GetSpecialMapResponse;
  loadingSpecialMap: boolean;
  markers: GetSpecialMapMarkersResponse[];
  loadingMarkers: boolean;
};
