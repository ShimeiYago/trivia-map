import React from 'react';
import { Typography } from '@mui/material';

export class Renderer extends React.Component<Props> {
  render() {
    return (
      <>
        <Typography variant="h6" component="h2">
          {this.props.title}
        </Typography>
        <Typography sx={{ mt: 2 }}>{this.props.content}</Typography>
      </>
    );
  }
}

export type Props = {
  title: string;
  content: string;
};
