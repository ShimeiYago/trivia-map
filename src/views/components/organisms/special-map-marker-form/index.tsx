/* istanbul ignore file */

import React, { useRef } from 'react';
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
import { MAP_MARKER_VARIANT, UPLOAD_IMAGE_MAX_LENGTH } from 'constant';
import { LoadingButton } from '@mui/lab';
import { getImageSrc } from 'utils/get-image-src.ts';
import { DeletableImage } from 'views/components/moleculars/deletable-image';
import { ImageField } from 'views/components/moleculars/image-field';
import { MapField } from 'views/components/moleculars/map-field';
import { Position } from 'types/position';
import { MapMarkerVariant } from 'types/marker-icon';
import defaultIconUrl from 'images/marker-icons/default.png';
import redIconUrl from 'images/marker-icons/red.png';
import restroomIconUrl from 'images/marker-icons/restroom.png';
import classes from './index.module.css';

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

        <MapField
          disabled={loading}
          helperText={formError?.fieldErrors?.coordinate}
          isSelected={!!position}
          status={mapFieldStatus}
        >
          <div>xxx</div>
          <div>xxx</div>
          <div>xxx</div>
          <div>xxx</div>
          <div>xxx</div>
          <div>xxx</div>
          <div>xxx</div>
          <div>xxx</div>
          <div>xxx</div>
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
};

const MARKER_OPTIONS: { value: MapMarkerVariant; name: string; imgSrc: string }[] = [
  {
    name: '赤ピン',
    value: MAP_MARKER_VARIANT.red,
    imgSrc: redIconUrl,
  },
  {
    name: '青ピン',
    value: MAP_MARKER_VARIANT.blue,
    imgSrc: defaultIconUrl,
  },
  {
    name: 'レストルーム',
    value: MAP_MARKER_VARIANT.restroom,
    imgSrc: restroomIconUrl,
  },
];
