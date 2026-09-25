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
    alignItems: props.to || props.href ? 'normal' : 'center',
  };

  const linkWrapper = (content: React.ReactNode) => {
    if (props.to) {
      return (
        <NonStyleLink to={props.to} target={props.target}>
          {content}
        </NonStyleLink>
      );
    }
    if (props.href) {
      return (
        <a href={props.href} target={props.target}>
          {content}
        </a>
      );
    }

    return content;
  };

  const buttonWrapper = (content: React.ReactNode) => {
    if (props.onClick) {
      return <span onClick={props.onClick}>{content}</span>;
    } else {
      return content;
    }
  };

  let contents: JSX.Element;
  if (props.iconPosition === 'left') {
    contents = (
      <>
        {linkWrapper(buttonWrapper(props.iconComponent))}
        {linkWrapper(buttonWrapper(props.text))}
      </>
    );
  } else {
    contents = (
      <>
        {linkWrapper(buttonWrapper(props.text))}
        {linkWrapper(buttonWrapper(props.iconComponent))}
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
  to?: string;
  href?: string;
  onClick?: () => void;
  target?: React.HTMLAttributeAnchorTarget;
};
