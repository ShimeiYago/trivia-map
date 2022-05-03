import React from 'react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { style } from './styles';

export class FloatingButton extends React.Component<Props> {
  static defaultProps: Props = {
    icon: 'add',
    color: 'primary',
    disabled: false,
  };

  render() {
    const { icon, color, disabled, onClick } = this.props;

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

    return (
      <Fab color={color} disabled={disabled} onClick={onClick} sx={style}>
        {iconComponent}
      </Fab>
    );
  }
}

export type Props = {
  icon: Icon;
  color: Color;
  disabled: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
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
