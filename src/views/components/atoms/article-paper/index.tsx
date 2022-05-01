import React from 'react';
import { Paper } from '@mui/material';
import { paperStyle } from './styles';

export class ArticlePaper extends React.Component<Props> {
  render() {
    return (
      <Paper elevation={2} square sx={paperStyle(this.props.variant)}>
        {this.props.children}
      </Paper>
    );
  }
}

export type Props = {
  children: React.ReactNode;
  variant: 'main' | 'side' | 'navi';
};
