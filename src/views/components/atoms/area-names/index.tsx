import React from 'react';
import { SxProps, Typography } from '@mui/material';
import { style } from './styles';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export const AreaNames: React.FC<Props> = (props) => {
  const wrapperStyle: SxProps = {
    ...style,
    fontSize: props.fontSize,
    columnGap: props.columnGap,
  };

  const length = props.areaNames.length;

  const contents = props.areaNames.map((areaName, index) => {
    return (
      <React.Fragment key={`area-${index}`}>
        {areaName}
        {length !== index + 1 && <KeyboardArrowRightIcon fontSize="inherit" />}
      </React.Fragment>
    );
  });

  return (
    <Typography variant={props.variant} sx={wrapperStyle}>
      {contents}
    </Typography>
  );
};

export type Props = {
  areaNames: string[];
  variant?:
    | 'inherit'
    | 'button'
    | 'overline'
    | 'caption'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2';
  fontSize?: number;
  columnGap?: number;
};
