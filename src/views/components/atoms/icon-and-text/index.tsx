import React, { ElementType } from 'react';
import { SxProps, Typography } from '@mui/material';
import { style } from './styles';

export const IconAndText: React.FC<Props> = (props) => {
  const wrapperStyle: SxProps = {
    ...style,
    justifyContent: props.align ?? 'center',
    fontSize: props.fontSize,
    columnGap: props.columnGap,
  };

  if (props.iconPosition === 'left') {
    return (
      <Typography
        component={props.component ?? 'div'}
        variant={props.variant}
        sx={wrapperStyle}
      >
        {props.iconComponent}
        {props.text}
      </Typography>
    );
  } else {
    return (
      <Typography sx={wrapperStyle}>
        {props.text}
        {props.iconComponent}
      </Typography>
    );
  }
};

export type Props = {
  iconComponent: JSX.Element;
  text: string;
  component?: ElementType;
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
  iconPosition: 'left' | 'right';
  align?: 'left' | 'right' | 'center';
  fontSize?: number;
  columnGap?: number;
};
