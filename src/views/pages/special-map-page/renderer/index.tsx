/* istanbul ignore file */

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
import {
  Alert,
  AlertColor,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { GlobalMenu } from 'views/components/organisms/global-menu';
import { metaInfoBox, mapTopArea, centralizeBox } from './styles';
import { mapWrapper, wrapper } from 'views/common-styles/map-page';
import { ParkSelectBox } from 'views/components/moleculars/park-select-box';
import { MapMarker } from 'views/components/moleculars/map-marker';
import {
  LatLng,
  LatLngBoundsExpression,
  LatLngTuple,
  Map as LeafletMap,
  PathOptions,
} from 'leaflet';
import { Image } from 'views/components/moleculars/image';
import { DynamicAlignedText } from 'views/components/atoms/dynamic-aligned-text';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import { NonStyleLink } from 'views/components/atoms/non-style-link';
import {
  SPECIAL_MAP_DETAIL_PAGE_LINK,
  SPECIAL_MAP_EDIT_PAGE_LINK,
  SPECIAL_MAP_PAGE_LINK,
} from 'constant/links';
import { ApiError } from 'api/utils/handle-axios-error';
import { MAP_MARGIN, MAP_MAX_COORINATE, PARKS, ZOOMS } from 'constant';
import { autoRefreshApiWrapper } from 'utils/auto-refresh-api-wrapper';
import { BoxModal } from 'views/components/organisms/box-modal';
import { SpecialMapSettingForm } from 'views/components/organisms/special-map-setting-form';
import { SpecialMapSettingState } from 'store/special-map-setting/model';
import { SwipeableEdgeDrawer } from 'views/components/moleculars/swipeable-edge-drawer';
import { CloseFormButton } from 'views/components/organisms/close-form-button';
import { FloatingButton } from 'views/components/atoms/floating-button';
import { SpecialMapMarkerForm } from 'views/components/organisms/special-map-marker-form';
import { Position } from 'types/position';
import { SpecialMapMarkerFormState } from 'store/special-map-marker-form/model';
import { RightDrawer } from 'views/components/atoms/right-drawer';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteSpecialMapMarker } from 'api/special-map-api/delete-special-map-marker';
import { globalAPIErrorMessage } from 'constant/global-api-error-message';
import { DeleteConfirmDialog } from 'views/components/moleculars/delete-confirm-dialog';
import ShareIcon from '@mui/icons-material/Share';
import { ShareButtons } from 'views/components/atoms/share-buttons';
import { getDomain } from 'utils/get-domain.ts';
import { Link, Navigate } from 'react-router-dom';
import { LoadingState } from 'types/loading-state';
import { User } from 'types/user';
import LockIcon from '@mui/icons-material/Lock';
import { Rectangle } from 'react-leaflet';

export class Renderer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loadingSpecialMap: true,
      loadingMarkers: true,
      park: props.park === PARKS.land || props.park === PARKS.sea ? props.park : PARKS.land,
      markers: [],
      loadedMarkerPages: 0,
      openSettingModal: false,
      openFormModal: false,
      positionSelectMode: false,
      isFormEditting: false,
      isDeletingMarker: false,
      openShareModal: false,
      openTooltipToGuideCreatingMarker: false,
    };
  }

  componentDidMount(): void {
    this.fetchSpecialMap();
    this.fetchSpecialMapMarkers();
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    const { specialMapSettingForm, specialMapMarkerForm } = this.props;
    if (
      prevProps.specialMapSettingForm.loading === 'loading' &&
      specialMapSettingForm.loading === 'success' &&
      this.state.specialMap
    ) {
      this.setState(
        {
          openSettingModal: false,
          notification: {
            message: '設定を更新しました。',
            type: 'success',
          },
          specialMap: {
            ...this.state.specialMap,
            title: specialMapSettingForm.title,
            description: specialMapSettingForm.description,
            isPublic: specialMapSettingForm.isPublic,
            thumbnail:
              typeof specialMapSettingForm.thumbnail === 'string'
                ? specialMapSettingForm.thumbnail
                : null,
            selectablePark:
              specialMapSettingForm.selectablePark ?? this.state.specialMap.selectablePark,
            minLatitude:
              specialMapSettingForm.area?.minLatitude ?? this.state.specialMap.minLatitude,
            maxLatitude:
              specialMapSettingForm.area?.maxLatitude ?? this.state.specialMap.maxLatitude,
            minLongitude:
              specialMapSettingForm.area?.minLongitude ?? this.state.specialMap.minLongitude,
            maxLongitude:
              specialMapSettingForm.area?.maxLongitude ?? this.state.specialMap.maxLongitude,
          },
          park:
            specialMapSettingForm.selectablePark === 'both' || !specialMapSettingForm.selectablePark
              ? this.state.park
              : specialMapSettingForm.selectablePark,
        },
        this.setInitialCenter,
      );
    }

    if (
      prevProps.specialMapMarkerForm.submittingState === 'loading' &&
      specialMapMarkerForm.submittingState === 'success'
    ) {
      this.setState({
        openFormModal: false,
        isFormEditting: false,
        notification: {
          message: specialMapMarkerForm.specialMapMarkerId
            ? 'マーカーを更新しました。'
            : 'マーカーを追加しました。',
          type: 'success',
        },
      });
      this.fetchSpecialMapMarkers();
      this.props.initializeSpecialMapForm();
    }

    if (
      this.state.positionSelectMode &&
      !prevState.positionSelectMode &&
      this.props.specialMapMarkerForm.lat &&
      this.props.specialMapMarkerForm.lng
    ) {
      this.setState({
        initCenter: {
          lat: this.props.specialMapMarkerForm.lat,
          lng: this.props.specialMapMarkerForm.lng,
        },
      });
    }

    if (
      prevState.specialMap &&
      prevState.specialMap?.selectablePark !== this.state.specialMap?.selectablePark
    ) {
      this.fetchSpecialMapMarkers();
    }
  }

  render() {
    return (
      <Box sx={wrapper(this.state.openFormModal && !this.props.isMobile)}>
        <GlobalMenu topBarPosition="static" mapPage>
          {this.renderSpecialMap()}
        </GlobalMenu>

        {this.renderSettingModal()}

        {this.renderNotification()}

        {this.renderEditForm()}

        <DeleteConfirmDialog
          open={!!this.state.deleteDialogMarkerId}
          onClose={this.cancelToDeleteMarker}
          onDelete={this.confirmToDeleteMarker}
          title="マーカーを削除しますか？"
          deleting={this.state.isDeletingMarker}
        />

        {this.renderShareModal()}
      </Box>
    );
  }

  protected renderSpecialMap = () => {
    const { windowWidth, windowHeight, isMobile, editMode } = this.props;
    const { specialMap, initCenter } = this.state;

    if (!windowWidth || !windowHeight || !specialMap || !initCenter) {
      return (
        <Box my={1}>
          <CenterSpinner />
        </Box>
      );
    }

    // if edit mode & user is not author, redirect
    if (
      editMode &&
      (this.props.autoLoggingInState === 'success' || this.props.autoLoggingInState === 'error') &&
      specialMap.author.userId !== this.props.user?.userId
    ) {
      return <Navigate to={SPECIAL_MAP_PAGE_LINK(String(specialMap.specialMapId))} replace />;
    }

    const handleClickAddButton = () => {
      this.props.initializeSpecialMapForm();
      this.setState({
        openFormModal: true,
        isFormEditting: true,
        openTooltipToGuideCreatingMarker: false,
      });
    };

    let maxBounds: LatLngBoundsExpression | undefined = undefined;
    let minZoom: number | undefined = undefined;
    if (
      specialMap.minLatitude &&
      specialMap.maxLatitude &&
      specialMap.minLongitude &&
      specialMap.maxLongitude
    ) {
      const width = specialMap.maxLatitude - specialMap.minLatitude;
      maxBounds = [
        [specialMap.maxLatitude + MAP_MARGIN, specialMap.minLongitude - MAP_MARGIN],
        [specialMap.minLatitude - MAP_MARGIN, specialMap.maxLongitude + MAP_MARGIN],
      ];
      const div = Math.ceil(MAP_MAX_COORINATE / width);
      minZoom = div < ZOOMS.min ? ZOOMS.min : div > ZOOMS.max ? ZOOMS.max : div;
    }

    return (
      <>
        <CommonHelmet
          title={editMode ? `（編集中）${specialMap.title}` : specialMap.title}
          description={specialMap.description}
          canonicalUrlPath={SPECIAL_MAP_DETAIL_PAGE_LINK(String(specialMap.specialMapId))}
        />

        <Box sx={mapWrapper(isMobile, windowWidth, windowHeight)}>
          <ParkMap
            park={this.state.park}
            setMap={this.setMap}
            initCenter={this.state.initCenter}
            minZoom={minZoom}
            maxBounds={maxBounds}
            positionSelectProps={{
              active: this.state.positionSelectMode,
              onConfirm: this.handleConfirmMarkerPosition,
              onCancel: this.handleCancelMarkerPosition,
            }}
          >
            {this.renderMarkers()}
            {this.renderFormMarker()}

            {this.renderRectangle()}
          </ParkMap>

          <Box sx={mapTopArea(!isMobile && this.state.openFormModal, isMobile)}>
            {this.renderMetaInfo()}

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

          {!this.state.isFormEditting && this.props.editMode && (
            <FloatingButton
              color="error"
              icon="add-marker"
              text="マーカーを追加する"
              size="large"
              onClick={handleClickAddButton}
              tooltip={{
                open:
                  this.state.openTooltipToGuideCreatingMarker &&
                  !this.state.openShareModal &&
                  !this.state.openSettingModal,
                title: <Typography fontSize={16}>まずはマーカーを追加してみましょう！</Typography>,
                placement: 'top-start',
                arrow: true,
              }}
            />
          )}
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

      if (
        this.state.isFormEditting &&
        this.props.specialMapMarkerForm.specialMapMarkerId === marker.specialMapMarkerId
      ) {
        return null;
      }

      if (marker.specialMapMarkerId === this.props.markerId) {
        map.flyTo(new LatLng(marker.lat, marker.lng), ZOOMS.popupOpen, { animate: false });
      }

      const popup = (
        <Box width={300} sx={{ overflowY: 'scroll', maxHeight: 330 }}>
          {this.props.editMode && (
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={2}
              mb={1}
            >
              <Button startIcon={<EditIcon />} onClick={this.handleClickMarkerEditButton(marker)}>
                編集
              </Button>
              <Button
                startIcon={<DeleteIcon />}
                onClick={this.handleClickDeleteMarkerButton(marker)}
              >
                削除
              </Button>
            </Stack>
          )}

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
          key={`special-map-marker-${marker.specialMapMarkerId}`}
        />
      );
    });
  };

  protected renderFormMarker = () => {
    const { map, park, positionSelectMode, isFormEditting } = this.state;
    const { specialMapMarkerForm } = this.props;

    const position: Position | undefined =
      specialMapMarkerForm.lat && specialMapMarkerForm.lng && specialMapMarkerForm.park
        ? {
            lat: specialMapMarkerForm.lat,
            lng: specialMapMarkerForm.lng,
            park: specialMapMarkerForm.park,
          }
        : undefined;

    if (!map || !position || position.park !== park || positionSelectMode || !isFormEditting) {
      return null;
    }

    const popup = <Typography color="red">現在編集中のマーカーです</Typography>;

    return (
      <MapMarker
        position={new LatLng(position.lat, position.lng)}
        mapController={{ map, popup }}
        variant={specialMapMarkerForm.variant}
      />
    );
  };

  protected renderRectangle = () => {
    const { specialMap } = this.state;

    if (
      !specialMap ||
      specialMap.minLatitude === undefined ||
      specialMap.maxLatitude === undefined ||
      specialMap.minLongitude === undefined ||
      specialMap.maxLongitude === undefined
    ) {
      return null;
    }

    const blackOptions: PathOptions = { color: 'black', stroke: false, fillOpacity: 0.8 };

    const leftRectangle: LatLngTuple[] | undefined =
      specialMap.minLongitude > 0
        ? [
            [-MAP_MAX_COORINATE, 0],
            [0, specialMap.minLongitude],
          ]
        : undefined;
    const rightRectangle: LatLngTuple[] | undefined =
      specialMap.maxLongitude < MAP_MAX_COORINATE
        ? [
            [-MAP_MAX_COORINATE, specialMap.maxLongitude],
            [0, MAP_MAX_COORINATE],
          ]
        : undefined;
    const topRectangle: LatLngTuple[] | undefined =
      specialMap.maxLatitude < 0
        ? [
            [specialMap.maxLatitude, specialMap.minLongitude],
            [0, specialMap.maxLongitude],
          ]
        : undefined;
    const bottomRectangle: LatLngTuple[] | undefined =
      specialMap.minLatitude > -MAP_MAX_COORINATE
        ? [
            [-MAP_MAX_COORINATE, specialMap.minLongitude],
            [specialMap.minLatitude, specialMap.maxLongitude],
          ]
        : undefined;

    return (
      <>
        {leftRectangle && <Rectangle bounds={leftRectangle} pathOptions={blackOptions} />}
        {rightRectangle && <Rectangle bounds={rightRectangle} pathOptions={blackOptions} />}
        {topRectangle && <Rectangle bounds={topRectangle} pathOptions={blackOptions} />}
        {bottomRectangle && <Rectangle bounds={bottomRectangle} pathOptions={blackOptions} />}
      </>
    );
  };

  protected renderMetaInfo = () => {
    return (
      <Box sx={metaInfoBox}>
        <Grid container spacing={0}>
          <Grid item xs={1}>
            {this.props.editMode ? (
              <Box sx={centralizeBox} onClick={this.toggleSettingModal(true)}>
                <IconButton color="primary" sx={{ p: 0 }}>
                  {this.props.editMode ? <SettingsIcon /> : <HelpOutlineIcon />}
                </IconButton>
              </Box>
            ) : (
              <NonStyleLink to={SPECIAL_MAP_DETAIL_PAGE_LINK(String(this.props.mapId))}>
                <Box sx={centralizeBox}>
                  <IconButton color="primary" sx={{ p: 0 }}>
                    <HelpOutlineIcon />
                  </IconButton>
                </Box>
              </NonStyleLink>
            )}
          </Grid>
          <Grid item xs={10}>
            {this.renderTitle()}
          </Grid>
          <Grid item xs={1}>
            {this.state.specialMap?.isPublic ? (
              <Box sx={centralizeBox} onClick={() => this.setState({ openShareModal: true })}>
                <IconButton color="primary" sx={{ p: 0 }}>
                  <ShareIcon />
                </IconButton>
              </Box>
            ) : (
              <Box sx={centralizeBox}>
                <Tooltip title="非公開" arrow enterTouchDelay={0}>
                  <IconButton sx={{ p: 0, cursor: 'default' }}>
                    <LockIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    );
  };

  protected renderShareModal = () => {
    if (!this.state.specialMap) {
      return null;
    }

    const { specialMapId, title, description } = this.state.specialMap;
    const domain = getDomain(window);
    const path = SPECIAL_MAP_PAGE_LINK(String(specialMapId));

    return (
      <BoxModal
        open={this.state.openShareModal}
        onClose={() => this.setState({ openShareModal: false })}
      >
        <Box p={3}>
          <Typography variant="h6" align="center" mb={1}>
            SNSでこのマップをシェアする
          </Typography>

          <ShareButtons title={title} description={description} url={`${domain}${path}`} />
        </Box>
      </BoxModal>
    );
  };

  protected fetchSpecialMap = async () => {
    try {
      const res = await autoRefreshApiWrapper(
        () => getSpecialMap(this.props.mapId),
        this.props.refreshUser,
      );

      this.setState(
        {
          loadingSpecialMap: false,
          specialMap: res,
          park: res.selectablePark !== 'both' ? res.selectablePark : this.state.park,
        },
        this.setInitialCenter,
      );
    } catch (error) {
      const apiError = error as ApiError<unknown>;

      if (apiError.status === 404 || apiError.status === 401 || apiError.status === 403) {
        this.props.throwError(404);
      } else {
        this.props.throwError(apiError.status);
      }
    }
  };

  protected setInitialCenter = () => {
    const { specialMap } = this.state;

    if (
      specialMap &&
      specialMap.minLatitude !== undefined &&
      specialMap.maxLatitude !== undefined &&
      specialMap.minLongitude !== undefined &&
      specialMap.maxLongitude !== undefined
    ) {
      this.setState({
        initCenter: {
          lat: (specialMap.maxLatitude + specialMap.minLatitude) / 2,
          lng: (specialMap.maxLongitude + specialMap.minLongitude) / 2,
        },
      });
    }
  };

  protected setMap = (map: LeafletMap) => {
    this.setState({
      map,
    });
  };

  protected fetchSpecialMapMarkers = async () => {
    this.setState({
      loadingMarkers: true,
      markers: [],
      loadedMarkerPages: 0,
    });

    try {
      let totalPages = 1;
      let loadedPages = 0;
      while (loadedPages < totalPages) {
        let res: GetSpecialMapMarkersResponseWithPagination;
        if (loadedPages === 0) {
          res = await autoRefreshApiWrapper(
            () => getSpecialMapMarkers({ mapId: this.props.mapId }),
            this.props.refreshUser,
          );

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
        openTooltipToGuideCreatingMarker: this.state.markers.length === 0 ? true : false,
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

  protected handleChangePark = (park: Park) => {
    this.setState({
      park,
    });

    // update url param
    const pathname = window.location.pathname;
    const params = `?park=${park}`;

    history.replaceState('', '', pathname + params);
  };

  protected toggleSettingModal = (open: boolean) => () => {
    if (this.props.specialMapSettingForm.loading === 'loading') {
      return;
    }

    if (open && this.state.specialMap) {
      this.props.setSpecialMap(this.state.specialMap);
    }

    this.setState({
      openSettingModal: open,
    });
  };

  protected renderSettingModal = () => {
    return (
      <BoxModal
        open={this.state.openSettingModal}
        onClose={this.toggleSettingModal(false)}
        showCloseButton
        disableClickOutside
        scroll
      >
        <Box sx={{ px: 2 }}>
          <SpecialMapSettingForm />
        </Box>
      </BoxModal>
    );
  };

  protected renderTitle = () => {
    const isAuthor =
      this.state.specialMap && this.props.user
        ? this.state.specialMap.author.userId === this.props.user.userId
        : false;

    let caption: React.ReactNode | undefined;
    if (!this.props.editMode && isAuthor) {
      caption = (
        <Link to={SPECIAL_MAP_EDIT_PAGE_LINK(String(this.state.specialMap?.specialMapId))}>
          （編集画面へ）
        </Link>
      );
    }
    if (this.props.editMode) {
      caption = '(編集中)';
    }

    return (
      <>
        {caption && (
          <Typography variant="body2" align="center" fontSize="0.75rem">
            {caption}
          </Typography>
        )}
        <Typography
          component="h2"
          variant="body1"
          align="center"
          fontWeight="bold"
          py={caption ? undefined : 1}
        >
          {this.state.specialMap?.title}
        </Typography>
      </>
    );
  };

  protected renderNotification = () => {
    const handleClose = () =>
      this.setState({
        notification: undefined,
      });

    return (
      <Snackbar open={!!this.state.notification} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={this.state.notification?.type}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {this.state.notification?.message}
        </Alert>
      </Snackbar>
    );
  };

  protected renderEditForm = () => {
    const { openFormModal, isFormEditting } = this.state;
    const { isMobile } = this.props;

    const handleCloseFormModal = () =>
      this.setState({
        openFormModal: false,
        isFormEditting: false,
      });
    const handleOpenEditForm = () =>
      this.setState({
        openFormModal: true,
      });
    const handleHideFormModal = () =>
      this.setState({
        openFormModal: false,
      });

    const closeButton = <CloseFormButton onClose={handleCloseFormModal} />;

    return isMobile ? (
      <SwipeableEdgeDrawer
        show={isFormEditting || openFormModal}
        open={openFormModal}
        onOpen={handleOpenEditForm}
        onClose={handleHideFormModal}
        edgeLabel={closeButton}
        edgeLabelWhenClosed="編集中"
        heightRatio={80}
      >
        <SpecialMapMarkerForm
          specialMapId={this.props.mapId}
          onClickMiniMap={this.activatePositionSelectMode}
          defaultPark={this.state.park}
        />
      </SwipeableEdgeDrawer>
    ) : (
      <RightDrawer open={openFormModal} onClose={handleCloseFormModal}>
        <SpecialMapMarkerForm
          specialMapId={this.props.mapId}
          onClickMiniMap={this.activatePositionSelectMode}
          defaultPark={this.state.park}
        />
      </RightDrawer>
    );
  };

  protected handleConfirmMarkerPosition = () => {
    if (!this.state.map) {
      return;
    }

    const newPosition: Position = {
      lat: this.state.map.getCenter().lat,
      lng: this.state.map.getCenter().lng,
      park: this.state.park,
    };
    this.props.updatePosition(newPosition);

    this.setState({
      positionSelectMode: false,
      openFormModal: true,
    });
  };

  protected handleCancelMarkerPosition = () => {
    this.setState({
      positionSelectMode: false,
      openFormModal: true,
    });
  };

  protected activatePositionSelectMode = () => {
    this.setState({
      positionSelectMode: true,
      openFormModal: false,
    });
  };

  protected handleClickMarkerEditButton = (marker: GetSpecialMapMarkersResponse) => () => {
    this.props.setSpecialMapMarkerForm(marker);
    this.setState({
      openFormModal: true,
      isFormEditting: true,
    });
  };

  protected handleClickDeleteMarkerButton = (marker: GetSpecialMapMarkersResponse) => () => {
    this.setState({
      deleteDialogMarkerId: marker.specialMapMarkerId,
    });
  };

  protected cancelToDeleteMarker = () => {
    this.setState({
      deleteDialogMarkerId: undefined,
    });
  };

  protected confirmToDeleteMarker = async () => {
    const { deleteDialogMarkerId } = this.state;
    if (!deleteDialogMarkerId) return;

    this.setState({
      isDeletingMarker: true,
    });

    try {
      await autoRefreshApiWrapper(
        () => deleteSpecialMapMarker(deleteDialogMarkerId),
        this.props.refreshUser,
      );

      this.setState({
        isDeletingMarker: false,
        deleteDialogMarkerId: undefined,
        notification: {
          message: 'マーカーを削除しました。',
          type: 'success',
        },
      });
      this.fetchSpecialMapMarkers();
    } catch (error) {
      const apiError = error as ApiError<unknown>;
      this.setState({
        isDeletingMarker: false,
        deleteDialogMarkerId: undefined,
        notification: {
          message: globalAPIErrorMessage(apiError.status, 'delete'),
          type: 'error',
        },
      });
    }
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
  specialMapSettingForm: SpecialMapSettingState;
  specialMapMarkerForm: SpecialMapMarkerFormState;
  user?: User;
  autoLoggingInState: LoadingState;

  refreshUser: () => void;
  setSpecialMap: (specialMap: GetSpecialMapResponse) => void;
  throwError: (errorStatus: number) => void;
  updatePosition: (position: Position) => void;
  initializeSpecialMapForm: () => void;
  setSpecialMapMarkerForm: (marker: GetSpecialMapMarkersResponse) => void;
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
  openSettingModal: boolean;
  notification?: {
    message: string;
    type: AlertColor;
  };
  openFormModal: boolean;
  positionSelectMode: boolean;
  isFormEditting: boolean;
  deleteDialogMarkerId?: number;
  isDeletingMarker: boolean;
  openShareModal: boolean;
  openTooltipToGuideCreatingMarker: boolean;
  initCenter?: Omit<Position, 'park'>;
};
