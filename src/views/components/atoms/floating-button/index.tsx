/* istanbul ignore file */

import React from 'react';
import { Fab, Tooltip, TooltipProps, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { style } from './styles';

export class FloatingButton extends React.Component<Props> {
  static defaultProps: Props = {
    icon: 'add',
    color: 'primary',
    disabled: false,
    size: 'medium',
  };

  render() {
    const { icon, color, disabled, text, size, onClick, tooltip } = this.props;

    let iconComponent: JSX.Element;
    switch (icon) {
      case 'add':
        iconComponent = <AddIcon />;
        break;
      case 'edit':
        iconComponent = <EditIcon />;
        break;
      case 'add-marker':
        iconComponent = <AddLocationAltIcon />;
        break;
    }

    const textComponent =
      text && tooltip ? (
        <Tooltip {...tooltip}>
          <Typography ml={1}>{text}</Typography>
        </Tooltip>
      ) : text ? (
        <Typography ml={1}>{text}</Typography>
      ) : null;

    return (
      <Fab
        color={color}
        disabled={disabled}
        size={size}
        onClick={onClick}
        variant={text ? 'extended' : 'circular'}
        sx={style}
      >
        {iconComponent}
        {textComponent}
      </Fab>
    );
  }
}

export type Props = {
  icon: Icon;
  color: Color;
  disabled: boolean;
  size: 'small' | 'medium' | 'large';
  text?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  tooltip?: Omit<TooltipProps, 'children'>;
};

type Icon = 'add' | 'edit' | 'add-marker';

type Color =
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'default'
  | 'success'
  | 'error'
  | 'info'
  | 'warning'
  | undefined;
