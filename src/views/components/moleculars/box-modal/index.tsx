import React, { ReactNode } from 'react';
import { Modal, Box } from '@mui/material';
import { boxStyle } from './styles';

export class BoxModal extends React.Component<Props> {
  render() {
    return (
      <Modal open={this.props.open} onClose={this.props.onClose}>
        <Box sx={boxStyle}>{this.props.children}</Box>
      </Modal>
    );
  }
}

export type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};
