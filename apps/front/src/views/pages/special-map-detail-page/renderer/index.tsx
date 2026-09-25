/* istanbul ignore file */

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
import { Alert, Box, Button, Divider, Link, Stack, Typography } from '@mui/material';
import { MapMarker } from 'views/components/moleculars/map-marker';
import { LatLng } from 'leaflet';
import { Image } from 'views/components/moleculars/image';
import { DynamicAlignedText } from 'views/components/atoms/dynamic-aligned-text';
import { ArticleWrapper } from 'views/components/organisms/article-wrapper';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import { MyIcon } from 'views/components/atoms/my-icon';
import { SPECIAL_MAP_EDIT_PAGE_LINK, SPECIAL_MAP_PAGE_LINK } from 'constant/links';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { NonStyleLink } from 'views/components/atoms/non-style-link';
import { ApiError } from 'api/utils/handle-axios-error';
import { ShareButtons } from 'views/components/atoms/share-buttons';
import { getDomain } from 'utils/get-domain.ts';
import EditIcon from '@mui/icons-material/Edit';
import { User } from 'types/user';
import { AuthorLink } from 'views/components/atoms/author-link';
import { maxLengthSlice } from 'utils/max-length-slice.ts';
import { AdsenseIns } from 'views/components/moleculars/adsense-ins';
import { SUB_SITE_IMAGES } from 'constant/head-tags';

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

    let mapName = this.state.specialMap ? `${this.state.specialMap.title}` : '全体マップ';
    if (this.props.isMobile) {
      mapName = maxLengthSlice(mapName, 14);
    }

    const localBackNavi = {
      text: `${mapName}へ戻る`,
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

    const { title, thumbnail, description, isPublic, specialMapId, author } = specialMap;
    const domain = getDomain(window);
    const path = SPECIAL_MAP_PAGE_LINK(String(specialMapId));

    return (
      <>
        <CommonHelmet
          title={title}
          description={description}
          imageUrl={thumbnail ?? `${domain}/${SUB_SITE_IMAGES.specialMap}`}
          ogType="article"
        />
        <Stack spacing={2}>
          {!isPublic && (
            <Alert severity="info">このマップは非公開です。あなただけが閲覧できます。</Alert>
          )}

          {isPublic && (
            <ShareButtons title={title} url={`${domain}${path}`} description={description} />
          )}

          <Divider />

          {this.renderEditLink()}

          <AuthorLink author={author} />

          <DynamicAlignedText
            component="h2"
            variant="h5"
            sx={{
              wordBreak: 'break-all',
            }}
          >
            {title}
          </DynamicAlignedText>

          {thumbnail && <Image src={thumbnail} width="full" />}

          <DynamicAlignedText whiteSpace="pre-wrap" fontSize={18}>
            {description}
          </DynamicAlignedText>

          {process.env.REACT_APP_AD_SLOT_IN_ARTICLE && (
            <AdsenseIns
              adSlot={process.env.REACT_APP_AD_SLOT_IN_ARTICLE}
              adFormat="fluid"
              adLayout="in-article"
            />
          )}

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
    const adSlot = process.env.REACT_APP_AD_SLOT_IN_LIST;

    const markerComponents = markers.map((marker, i) => {
      return (
        <>
          <Box
            border="3px solid #424242"
            bgcolor="#f5f8fa"
            key={`special-map-marker-${marker.lat}-${marker.lng}`}
          >
            <NonStyleLink
              to={SPECIAL_MAP_PAGE_LINK(String(this.props.mapId), {
                marker: marker.specialMapMarkerId,
                park: marker.park,
              })}
            >
              <Box height={200} mx="auto">
                <ParkMap
                  park={marker.park}
                  initCenter={{ lat: marker.lat, lng: marker.lng }}
                  disabled
                >
                  <MapMarker
                    position={new LatLng(marker.lat, marker.lng)}
                    variant={marker.variant}
                  />
                </ParkMap>
              </Box>
            </NonStyleLink>

            <Box p={1}>
              <DynamicAlignedText component="div" whiteSpace="pre-wrap" mb={1}>
                {marker.description}
              </DynamicAlignedText>

              {marker.image && (
                <Typography align="center" component="div" mb={1}>
                  <Image src={marker.image} maxWidth="full" maxHeight="300px" />
                </Typography>
              )}

              <NonStyleLink
                to={SPECIAL_MAP_PAGE_LINK(String(this.props.mapId), {
                  marker: marker.specialMapMarkerId,
                  park: marker.park,
                })}
              >
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

          {(i + 1) % 5 === 0 && adSlot && (
            <AdsenseIns adSlot={adSlot} adFormat="fluid" adLayoutKey="-71+ed+2g-1n-4q" />
          )}
        </>
      );
    });

    return (
      <Stack spacing={5}>
        {markerComponents}
        {loadingMarkers && <CenterSpinner />}
      </Stack>
    );
  };

  protected renderEditLink = () => {
    if (
      !this.props.user ||
      !this.state.specialMap ||
      this.props.user.userId !== this.state.specialMap.author.userId
    ) {
      return null;
    }

    return (
      <Link component="div">
        <IconAndText
          iconComponent={<EditIcon />}
          text="編集"
          iconPosition="left"
          align="right"
          to={SPECIAL_MAP_EDIT_PAGE_LINK(this.props.mapId.toString())}
        />
      </Link>
    );
  };

  protected fetchSpecialMap = async () => {
    try {
      // use autoRefreshApiWrapper
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
        this.props.throwError(apiError.status);
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
      const apiError = error as ApiError<unknown>;
      this.props.throwError(apiError.status);
    }
  };
}

export type Props = {
  mapId: number;
  user?: User;
  isMobile: boolean;

  throwError: (errorStatus: number) => void;
};

export type State = {
  specialMap?: GetSpecialMapResponse;
  loadingSpecialMap: boolean;
  markers: GetSpecialMapMarkersResponse[];
  loadingMarkers: boolean;
};
