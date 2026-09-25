import React from 'react';
import { Box, Stack, Switch, Typography } from '@mui/material';
import { Park } from 'types/park';
import { style } from './styles';

export class ParkSelectBox extends React.Component<Props> {
  render() {
    return (
      <Box sx={style(this.props.park)}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography fontSize="0.875rem">ランド</Typography>
          <Switch
            checked={this.props.park === 'S'}
            onChange={this.handleChange}
            size="small"
            color="primary"
          />
          <Typography fontSize="0.875rem">シー</Typography>
        </Stack>
      </Box>
    );
  }

  protected handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChangePark(event.target.checked ? 'S' : 'L');
  };
}

export type Props = {
  park: Park;
  onChangePark: (park: Park) => void;
};
