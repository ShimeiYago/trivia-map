import { Typography } from '@mui/material';
import { ElementType } from 'react';

export function DesignedHead(props: Props) {
  return (
    <Typography
      variant={props.variant}
      component={props.component ?? 'div'}
      sx={{
        py: 0.5,
        px: 1,
        borderLeft: 'solid 5px #7db4e6',
        borderBottom: 'solid 2px #7db4e6',
        mt: 1,
        mb: 2,
      }}
    >
      {props.children}
    </Typography>
  );
}

type Props = {
  children: React.ReactNode;
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
};
