/* istanbul ignore file */

import { useAppDispatch, useAppSelector } from 'store';
import {
  selectSpecialMapFormError,
  selectSpecialMapLoading,
  selectSpecialMapArea,
  selectSpecialMapSelectablePark,
} from 'store/special-map-setting/selector';
import { updateArea } from 'store/special-map-setting/actions';
import { Alert, Box, Checkbox, FormControlLabel } from '@mui/material';
import ReactCrop, { PercentCrop } from 'react-image-crop';
import { useEffect, useState } from 'react';
import styles from './index.module.css';
import landImage from 'images/land.jpg';
import seaImage from 'images/sea.jpg';
import { Image } from 'views/components/moleculars/image';
import { DEFAULT_AREA, MAP_MAX_COORINATE } from 'constant';
import { Area } from 'types/area';
import { HelperText } from 'views/components/atoms/helper-text';

const initCrop: PercentCrop = {
  x: 20,
  y: 20,
  width: 60,
  height: 60,
  unit: '%',
};

export function AreaSelection() {
  const [activeSelection, setActiveSelection] = useState(false);
  const [crop, setCrop] = useState<PercentCrop>(initCrop);

  const dispatch = useAppDispatch();

  const formError = useAppSelector(selectSpecialMapFormError);
  const loadingState = useAppSelector(selectSpecialMapLoading);
  const area = useAppSelector(selectSpecialMapArea);
  const selectablePark = useAppSelector(selectSpecialMapSelectablePark);

  const loading = loadingState === 'loading';

  useEffect(() => {
    if (JSON.stringify(area) !== JSON.stringify(DEFAULT_AREA)) {
      setActiveSelection(true);
      area && setCrop(areaToCrop(area));
    }
  }, []);

  useEffect(() => {
    if (selectablePark === 'both') {
      setActiveSelection(false);
      dispatch(updateArea(DEFAULT_AREA));
    }
  }, [selectablePark]);

  return (
    <>
      {selectablePark === 'both' && (
        <Alert variant="outlined" severity="warning">
          対象パークで「ランドのみ」または「シーのみ」を選んだときに使用できる設定です。
        </Alert>
      )}

      <FormControlLabel
        disabled={loading || selectablePark === 'both'}
        control={<Checkbox checked={activeSelection} onChange={handleChangeChecked} />}
        label="表示範囲を指定する"
      />

      {!!formError?.fieldErrors?.area && (
        <Box mb={1}>
          <HelperText error>{formError?.fieldErrors?.area}</HelperText>
        </Box>
      )}

      {activeSelection ? (
        <ReactCrop
          crop={crop}
          aspect={1}
          onChange={handleChangeCrop}
          keepSelection
          className={styles['crop']}
          disabled={loading}
          onComplete={handleCompleteCrop}
        >
          <img src={selectablePark === 'L' ? landImage : seaImage} />
        </ReactCrop>
      ) : (
        selectablePark !== 'both' && (
          <Image src={selectablePark === 'L' ? landImage : seaImage} width="full" />
        )
      )}
    </>
  );

  function handleChangeChecked(_: unknown, checked: boolean) {
    setActiveSelection(checked);
    setCrop(initCrop);

    if (checked) {
      dispatch(updateArea(cropToArea(initCrop)));
    }

    if (!checked) {
      dispatch(updateArea(DEFAULT_AREA));
    }
  }

  function handleChangeCrop(_: unknown, percentCrop: PercentCrop) {
    setCrop(percentCrop);
  }

  function handleCompleteCrop(_: unknown, percentCrop: PercentCrop) {
    dispatch(updateArea(cropToArea(percentCrop)));
  }
}

function cropToArea(percentCrop: PercentCrop): Area {
  return {
    maxLongitude: (MAP_MAX_COORINATE * (percentCrop.x + percentCrop.width)) / 100,
    minLongitude: (MAP_MAX_COORINATE * percentCrop.x) / 100,
    maxLatitude: (-MAP_MAX_COORINATE * percentCrop.y) / 100,
    minLatitude: (-MAP_MAX_COORINATE * (percentCrop.y + percentCrop.height)) / 100,
  };
}

function areaToCrop(area: Area): PercentCrop {
  return {
    x: (100 * area.minLongitude) / MAP_MAX_COORINATE,
    width: (100 * (area.maxLongitude - area.minLongitude)) / MAP_MAX_COORINATE,
    y: (-100 * area.maxLatitude) / MAP_MAX_COORINATE,
    height: (100 * (area.maxLatitude - area.minLatitude)) / MAP_MAX_COORINATE,
    unit: '%',
  };
}
