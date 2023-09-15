import React, { ReactNode } from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import { boxStyle } from './styles';
import CloseIcon from '@mui/icons-material/Close';

export class Renderer extends React.Component<Props> {
  render() {
    const closeButton = (
      <Typography align="right" color="gray">
        <IconButton color="inherit" size="large" onClick={this.props.onClose}>
          <CloseIcon />
        </IconButton>
      </Typography>
    );

    /* istanbul ignore next */
    const childrenHeight = this.props.scroll
      ? this.props.showCloseButton
        ? this.props.windowHeight - 50
        : this.props.windowHeight
      : undefined;

    return (
      <Modal
        open={this.props.open}
        onClose={
          this.props.showCloseButton && this.props.disableClickOutside
            ? undefined
            : this.props.onClose
        }
      >
        <Box sx={boxStyle} maxHeight={this.props.windowHeight}>
          {this.props.showCloseButton && closeButton}
          <Box sx={{ overflowY: 'auto', height: childrenHeight }}>{this.props.children}</Box>
        </Box>
      </Modal>
    );
  }
}

export type Props = {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  showCloseButton?: boolean;
  disableClickOutside?: boolean;
  windowHeight: number;
  scroll?: boolean;
};
