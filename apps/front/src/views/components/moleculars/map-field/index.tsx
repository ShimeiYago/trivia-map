/* istanbul ignore file */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { miniMapLayer, miniMapGuideTextBox, miniMapWrapper, miniMapAreaTextBox } from './styles';
import { BoxField, FieldStatus } from 'views/components/moleculars/box-field';
import { AreaNames } from 'views/components/atoms/area-names';

export function MapField(props: Props) {
  return (
    <BoxField
      status={props.status}
      onClick={props.onClick}
      disabled={props.disabled}
      helperText={props.helperText}
    >
      <Box sx={miniMapWrapper}>
        {props.children}
        <Box sx={miniMapLayer}></Box>
        <Box sx={miniMapAreaTextBox}>
          {!props.disabled && props.areaNames && (
            <Typography color="white" component="div" fontSize="14" variant="inherit">
              <AreaNames areaNames={props.areaNames} variant="inherit" />
            </Typography>
          )}
        </Box>
        <Box sx={miniMapGuideTextBox}>
          {!props.disabled && (
            <Typography
              color="white"
              textAlign="center"
              component="div"
              fontSize="14"
              variant="inherit"
            >
              {getMiniMapText(!!props.isSelected)}
            </Typography>
          )}
        </Box>
      </Box>
    </BoxField>
  );
}

function getMiniMapText(isSelected: boolean) {
  if (isSelected) {
    return (
      <>
        この位置が選択されています。
        <br />
        位置を選び直す場合はここをタップしてください。
      </>
    );
  }

  return (
    <>
      位置が選択されていません。
      <br />
      ここをタップして位置を選択してください。
    </>
  );
}

export type Props = {
  // map component
  children: React.ReactNode;

  status?: FieldStatus;
  helperText?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  areaNames?: string[];
  isSelected?: boolean;
};
