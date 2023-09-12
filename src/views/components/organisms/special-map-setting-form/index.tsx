/* istanbul ignore file */

import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import {
  selectSpecialMapArea,
  selectSpecialMapDescription,
  selectSpecialMapFormError,
  selectSpecialMapId,
  selectSpecialMapIsPublic,
  selectSpecialMapLoading,
  selectSpecialMapSelectablePark,
  selectSpecialMapThumbnail,
  selectSpecialMapTitle,
} from 'store/special-map-setting/selector';
import {
  submitSpecialMap,
  updateDescription,
  updateIsPublic,
  updateSelectablePark,
  updateThumbnail,
  updateTitle,
} from 'store/special-map-setting/actions';
import { throwError } from 'store/global-error/slice';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { HeaderErrorMessages } from 'views/components/moleculars/header-error-messages';
import {
  DEFAULT_AREA,
  INPUT_FIELD_MAX_LENGTH,
  SELECTABLE_PARK,
  UPLOAD_IMAGE_MAX_LENGTH,
} from 'constant';
import { SelectablePark } from 'types/park';
import { LoadingButton } from '@mui/lab';
import { getImageSrc } from 'utils/get-image-src.ts';
import { DeletableImage } from 'views/components/moleculars/deletable-image';
import { ImageField } from 'views/components/moleculars/image-field';
import { HelperText } from 'views/components/atoms/helper-text';
import { toggleFormModal } from 'store/auths/actions';
import { selectUser } from 'store/auths/selector';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AreaSelection } from '../area-selection';

export function SpecialMapSettingForm() {
  const [expandedAccordion, setExpandedAccordion] = useState(false);

  const dispatch = useAppDispatch();

  const specialMapId = useAppSelector(selectSpecialMapId);
  const formError = useAppSelector(selectSpecialMapFormError);
  const title = useAppSelector(selectSpecialMapTitle);
  const loadingState = useAppSelector(selectSpecialMapLoading);
  const description = useAppSelector(selectSpecialMapDescription);
  const thumbnail = useAppSelector(selectSpecialMapThumbnail);
  const isPublic = useAppSelector(selectSpecialMapIsPublic);
  const selectablePark = useAppSelector(selectSpecialMapSelectablePark);
  const userInfo = useAppSelector(selectUser);
  const area = useAppSelector(selectSpecialMapArea);

  const imageSrc = getImageSrc(thumbnail);

  const loading = loadingState === 'loading';

  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formError) {
      headerRef?.current?.scrollIntoView({
        block: 'start',
      });
    }
  }, [formError]);

  useEffect(() => {
    if (JSON.stringify(area) !== JSON.stringify(DEFAULT_AREA)) {
      setExpandedAccordion(true);
    }
  }, []);

  return (
    <Box maxWidth="sm" sx={{ p: 0, my: 3, mx: 'auto' }}>
      <Stack spacing={3}>
        <Typography component="h2" align="center" variant="h4" ref={headerRef}>
          {specialMapId ? 'オリジナルマップの設定' : 'オリジナルマップを作成'}
        </Typography>

        {formError?.errorTitle && <HeaderErrorMessages errorTitle={formError.errorTitle} />}

        {specialMapId && (
          <>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <Typography fontSize="1rem">非公開</Typography>
              <Switch
                checked={isPublic}
                onChange={() => dispatch(updateIsPublic(!isPublic))}
                color="primary"
              />
              <Typography fontSize="1rem">公開</Typography>
            </Stack>

            <Divider />
          </>
        )}

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

        <Box>
          <FormLabel>アイキャッチ画像</FormLabel>
          <Typography variant="body2" color="gray" sx={{ mb: 1 }}>
            このオリジナルマップのイメージを表す画像です。
            <br />
            一覧ページやSNS共有時に表示されます。
            <br />
            指定しない場合は共通の画像が表示されます。
          </Typography>
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
        </Box>

        <FormControl required error={!!formError?.fieldErrors?.selectablePark}>
          <FormLabel>対象パーク{!specialMapId && '（後から変更できます）'}</FormLabel>
          <RadioGroup
            row
            onChange={(_, value) => dispatch(updateSelectablePark(value as SelectablePark))}
          >
            <FormControlLabel
              value={SELECTABLE_PARK.land}
              control={<Radio checked={selectablePark === SELECTABLE_PARK.land} />}
              label="ランドのみ"
            />
            <FormControlLabel
              value={SELECTABLE_PARK.sea}
              control={<Radio checked={selectablePark === SELECTABLE_PARK.sea} />}
              label="シーのみ"
            />
            <FormControlLabel
              value={SELECTABLE_PARK.both}
              control={<Radio checked={selectablePark === SELECTABLE_PARK.both} />}
              label="両パーク"
            />
          </RadioGroup>
          <HelperText error={!!formError?.fieldErrors?.selectablePark}>
            {formError?.fieldErrors?.selectablePark}
          </HelperText>
        </FormControl>

        {specialMapId && (
          <Accordion expanded={expandedAccordion} onChange={handleChangeExpanded}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>詳細設定</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormLabel>表示範囲の指定</FormLabel>
              <Typography variant="body2" color="gray" sx={{ mb: 1 }}>
                マップの表示エリアを特定の範囲に絞ることができます。
                <br />
                パーク全体ではなく、特定のエリアにフォーカスしたマップを作成したい時に便利です。
              </Typography>

              <AreaSelection />
            </AccordionDetails>
          </Accordion>
        )}

        <LoadingButton
          loading={loading}
          variant="contained"
          disabled={loading}
          onClick={handleClickSubmitButton}
        >
          {specialMapId ? '設定を更新する' : 'オリジナルマップを作成する'}
        </LoadingButton>
      </Stack>
    </Box>
  );

  function handleClickSubmitButton() {
    if (!userInfo) {
      dispatch(toggleFormModal(true));
      return;
    }

    dispatch(submitSpecialMap());
  }

  function handleChangeExpanded(_: unknown, expanded: boolean) {
    setExpandedAccordion(expanded);
  }
}
