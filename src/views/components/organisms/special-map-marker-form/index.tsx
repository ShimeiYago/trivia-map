/* istanbul ignore file */

import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import {
  submitSpecialMapMarker,
  updateImage,
  updateDescription,
  updateVariant,
} from 'store/special-map-marker-form/actions';
import { throwError } from 'store/global-error/slice';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { HeaderErrorMessages } from 'views/components/moleculars/header-error-messages';
import { MAP_MARKER_VARIANT, MINI_MAP_HEIGHT, UPLOAD_IMAGE_MAX_LENGTH, ZOOMS } from 'constant';
import { LoadingButton } from '@mui/lab';
import { getImageSrc } from 'utils/get-image-src.ts';
import { DeletableImage } from 'views/components/moleculars/deletable-image';
import { ImageField } from 'views/components/moleculars/image-field';
import { MapField } from 'views/components/moleculars/map-field';
import { Position } from 'types/position';
import { MapMarkerVariant } from 'types/marker-icon';
import classes from './index.module.css';
import { ParkMap } from 'views/components/moleculars/park-map';
import { Park } from 'types/park';
import { MapMarker } from 'views/components/moleculars/map-marker';
import { LatLng } from 'leaflet';

import defaultIconUrl from 'images/marker-icons/default.png';
import redIconUrl from 'images/marker-icons/red.png';
import restroomIconUrl from 'images/marker-icons/restroom.png';
import foodIconUrl from 'images/marker-icons/food.png';
import signboardIconUrl from 'images/marker-icons/signboard.png';
import drinkIconUrl from 'images/marker-icons/drink.png';
import hightowerIconUrl from 'images/marker-icons/hightower.png';
import nemoIconUrl from 'images/marker-icons/nemo.png';
import popcoonIconUrl from 'images/marker-icons/popcoon.png';
import seaIconUrl from 'images/marker-icons/sea.png';
import starIconUrl from 'images/marker-icons/star.png';
import lightIconUrl from 'images/marker-icons/light.png';
import plantIconUrl from 'images/marker-icons/plant.png';

export function SpecialMapMarkerForm(props: Props) {
  const dispatch = useAppDispatch();
  const specialMapMarkerForm = useAppSelector((state) => state.specialMapMarkerForm);
  const {
    specialMapMarkerId,
    description,
    image,
    lat,
    lng,
    park,
    variant,
    submittingState,
    formError,
  } = specialMapMarkerForm;

  const position: Position | undefined =
    lat && lng && park
      ? {
          lat,
          lng,
          park,
        }
      : undefined;

  const imageSrc = getImageSrc(image);

  const loading = submittingState === 'loading';

  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formError) {
      headerRef?.current?.scrollIntoView({
        block: 'start',
      });
    }
  }, [formError]);

  const mapFieldStatus = !!formError?.fieldErrors?.coordinate
    ? 'error'
    : position
    ? 'valid'
    : 'normal';

  return (
    <Box sx={{ py: 0, my: 3, px: 3 }}>
      <Stack spacing={3}>
        <Typography component="h2" align="center" variant="h4" ref={headerRef}>
          {specialMapMarkerId ? 'マーカーを編集' : 'マーカーを追加'}
        </Typography>

        {formError?.errorTitle && <HeaderErrorMessages errorTitle={formError.errorTitle} />}

        <MapField
          disabled={loading}
          helperText={formError?.fieldErrors?.coordinate}
          isSelected={!!position}
          status={mapFieldStatus}
          onClick={props.onClickMiniMap}
        >
          <ParkMap
            park={position?.park ?? props.defaultPark}
            initZoom={ZOOMS.miniMap}
            initCenter={position}
            height={MINI_MAP_HEIGHT}
            disabled
          >
            {position && (
              <MapMarker position={new LatLng(position.lat, position.lng)} variant={variant} />
            )}
          </ParkMap>
        </MapField>

        <FormControl sx={{ display: 'inline-block' }}>
          <InputLabel>マーカーの種類</InputLabel>
          <Select
            value={variant}
            label="マーカーの種類"
            onChange={(event) => dispatch(updateVariant(event.target.value as MapMarkerVariant))}
          >
            {MARKER_OPTIONS.map((option) => {
              return (
                <MenuItem value={option.value} key={option.value}>
                  {option.name}
                  <img src={option.imgSrc} className={classes['marker-option-img']} />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        {imageSrc ? (
          <DeletableImage
            src={imageSrc}
            width="full"
            borderRadius
            onDelete={() => dispatch(updateImage(null))}
            errors={formError?.fieldErrors?.image}
          />
        ) : (
          <ImageField
            src={imageSrc}
            onChange={(src) => dispatch(updateImage(src))}
            variant="photo"
            disabled={loading}
            error={!!formError?.fieldErrors?.image}
            helperText={formError?.fieldErrors?.image}
            maxLength={UPLOAD_IMAGE_MAX_LENGTH.article}
            onCatchError={() => dispatch(throwError(500))}
          />
        )}

        <TextField
          label="説明文"
          multiline
          minRows={6}
          value={description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            dispatch(updateDescription(e.target.value))
          }
          disabled={loading}
          error={!!formError?.fieldErrors?.description}
          helperText={formError?.fieldErrors?.description}
          required
        />

        <LoadingButton
          loading={loading}
          variant="contained"
          disabled={loading}
          onClick={() => dispatch(submitSpecialMapMarker(props.specialMapId))}
        >
          {specialMapMarkerId ? 'マーカーを更新' : 'マーカーを追加'}
        </LoadingButton>
      </Stack>
    </Box>
  );
}

export type Props = {
  specialMapId: number;
  onClickMiniMap: () => void;
  defaultPark: Park;
};

const MARKER_OPTIONS: { value: MapMarkerVariant; name: string; imgSrc: string }[] = [
  {
    name: '青ピン',
    value: MAP_MARKER_VARIANT.blue,
    imgSrc: defaultIconUrl,
  },
  {
    name: '赤ピン',
    value: MAP_MARKER_VARIANT.red,
    imgSrc: redIconUrl,
  },
  {
    name: 'スター',
    value: MAP_MARKER_VARIANT.star,
    imgSrc: starIconUrl,
  },
  {
    name: 'フード',
    value: MAP_MARKER_VARIANT.food,
    imgSrc: foodIconUrl,
  },
  {
    name: 'ドリンク',
    value: MAP_MARKER_VARIANT.drink,
    imgSrc: drinkIconUrl,
  },
  {
    name: 'ポップコーン',
    value: MAP_MARKER_VARIANT.popcoon,
    imgSrc: popcoonIconUrl,
  },
  {
    name: 'レストルーム',
    value: MAP_MARKER_VARIANT.restroom,
    imgSrc: restroomIconUrl,
  },
  {
    name: '看板',
    value: MAP_MARKER_VARIANT.signboard,
    imgSrc: signboardIconUrl,
  },
  {
    name: '照明',
    value: MAP_MARKER_VARIANT.light,
    imgSrc: lightIconUrl,
  },
  {
    name: '植物',
    value: MAP_MARKER_VARIANT.plant,
    imgSrc: plantIconUrl,
  },
  {
    name: 'ネモ',
    value: MAP_MARKER_VARIANT.nemo,
    imgSrc: nemoIconUrl,
  },
  {
    name: 'ハイタワー',
    value: MAP_MARKER_VARIANT.hightower,
    imgSrc: hightowerIconUrl,
  },
  {
    name: 'S.E.A.',
    value: MAP_MARKER_VARIANT.sea,
    imgSrc: seaIconUrl,
  },
];
