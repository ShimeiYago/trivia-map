import React from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { style } from './styles';

export const IconAndText: React.FC<Props> = (props) => {
  return (
    <Typography sx={style} {...props}>
      <props.iconComponent.type fontSize="inherit" />
      {props.text}
    </Typography>
  );
};

type AdditionalProps = {
  iconComponent: JSX.Element;
  text: string;
  component?: string;
};

export type Props = AdditionalProps & Omit<TypographyProps, 'children'>;
