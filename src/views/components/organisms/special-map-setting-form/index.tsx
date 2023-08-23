/* istanbul ignore file */

import React, { useRef } from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectSpecialMapDescription,
  selectSpecialMapFormError,
  selectSpecialMapId,
  selectSpecialMapLoading,
  selectSpecialMapThumbnail,
  selectSpecialMapTitle,
} from 'store/special-map-setting/selector';
import {
  submitSpecialMap,
  updateDescription,
  updateSelectablePark,
  updateThumbnail,
  updateTitle,
} from 'store/special-map-setting/actions';
import { throwError } from 'store/global-error/slice';
import {
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { formContainer } from './styles';
import { HeaderErrorMessages } from 'views/components/moleculars/header-error-messages';
import { INPUT_FIELD_MAX_LENGTH, SELECTABLE_PARK, UPLOAD_IMAGE_MAX_LENGTH } from 'constant';
import { SelectablePark } from 'types/park';
import { LoadingButton } from '@mui/lab';
import { getImageSrc } from 'utils/get-image-src.ts';
import { DeletableImage } from 'views/components/moleculars/deletable-image';
import { ImageField } from 'views/components/moleculars/image-field';
import { HelperText } from 'views/components/atoms/helper-text';

export function SpecialMapSettingForm() {
  const dispatch = useAppDispatch();

  const specialMapId = useAppSelector(selectSpecialMapId);
  const formError = useAppSelector(selectSpecialMapFormError);
  const title = useAppSelector(selectSpecialMapTitle);
  const loadingState = useAppSelector(selectSpecialMapLoading);
  const description = useAppSelector(selectSpecialMapDescription);
  const thumbnail = useAppSelector(selectSpecialMapThumbnail);

  const imageSrc = getImageSrc(thumbnail);

  const loading = loadingState === 'loading';

  const headerRef = useRef<HTMLDivElement>(null);

  return (
    <Container maxWidth="sm" sx={formContainer}>
      <Stack spacing={3}>
        <Typography component="h2" align="center" variant="h4" ref={headerRef}>
          {specialMapId ? 'オリジナルマップの設定' : 'オリジナルマップを作成'}
        </Typography>

        {formError?.errorTitle && <HeaderErrorMessages errorTitle={formError.errorTitle} />}

        <TextField
          label="オリジナルマップのタイトル"
          variant="standard"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            dispatch(updateTitle(e.target.value))
          }
          disabled={loading}
          error={!!formError?.fieldErrors?.title}
          helperText={formError?.fieldErrors?.title}
          required
          inputProps={{ maxLength: INPUT_FIELD_MAX_LENGTH.articleTitle }}
        />

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

        {imageSrc ? (
          <DeletableImage
            src={imageSrc}
            width="full"
            borderRadius
            onDelete={() => dispatch(updateThumbnail(null))}
            errors={formError?.fieldErrors?.thumbnail}
          />
        ) : (
          <ImageField
            src={imageSrc}
            onChange={(src) => dispatch(updateThumbnail(src))}
            variant="photo"
            disabled={loading}
            error={!!formError?.fieldErrors?.thumbnail}
            helperText={formError?.fieldErrors?.thumbnail}
            maxLength={UPLOAD_IMAGE_MAX_LENGTH.article}
            onCatchError={() => dispatch(throwError(500))}
          />
        )}

        <FormControl required error={!!formError?.fieldErrors?.selectablePark}>
          <FormLabel>対象パーク</FormLabel>
          <RadioGroup
            row
            onChange={(_, value) => dispatch(updateSelectablePark(value as SelectablePark))}
          >
            <FormControlLabel value={SELECTABLE_PARK.land} control={<Radio />} label="ランドのみ" />
            <FormControlLabel value={SELECTABLE_PARK.sea} control={<Radio />} label="シーのみ" />
            <FormControlLabel value={SELECTABLE_PARK.both} control={<Radio />} label="両パーク" />
          </RadioGroup>
          <HelperText error={!!formError?.fieldErrors?.selectablePark}>
            {!!formError?.fieldErrors?.selectablePark}
          </HelperText>
        </FormControl>

        <LoadingButton
          loading={loading}
          variant="contained"
          disabled={loading}
          onClick={() => dispatch(submitSpecialMap())}
        >
          {specialMapId ? '更新する' : 'オリジナルマップを作成する'}
        </LoadingButton>
      </Stack>
    </Container>
  );
}
