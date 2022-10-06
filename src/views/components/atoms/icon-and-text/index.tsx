import React, { ElementType } from 'react';
import { SxProps, Typography } from '@mui/material';
import { style } from './styles';
import { NonStyleLink } from '../non-style-link';

export function IconAndText(props: Props): JSX.Element {
  const wrapperStyle: SxProps = {
    ...style,
    justifyContent: props.align ?? 'center',
    fontSize: props.fontSize,
    columnGap: props.columnGap,
    alignItems: props.link ? 'normal' : 'center',
  };

  const linkWrapper = (content: React.ReactNode) => {
    if (props.link) {
      return <NonStyleLink to={props.link}>{content}</NonStyleLink>;
    } else {
      return content;
    }
  };

  let contents: JSX.Element;
  if (props.iconPosition === 'left') {
    contents = (
      <>
        {/* {props.iconComponent} */}
        {linkWrapper(props.iconComponent)}
        {linkWrapper(props.text)}
      </>
    );
  } else {
    contents = (
      <>
        {linkWrapper(props.text)}
        {props.iconComponent}
      </>
    );
  }

  return (
    <Typography component={props.component ?? 'div'} variant={props.variant} sx={wrapperStyle}>
      {contents}
    </Typography>
  );
}

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
  link?: string;
};
