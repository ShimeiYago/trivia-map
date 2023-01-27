import React from 'react';
import { NonStyleLink } from 'views/components/atoms/non-style-link';
import { IconAndText } from 'views/components/atoms/icon-and-text';
import { MAP_USER_LINK } from 'constant/links';
import { Box, Button } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import { grey } from '@mui/material/colors';

export class MapLinkButton extends React.Component<Props> {
  render() {
    return (
      <Box textAlign="center" color={grey[800]} mt={2} mb={4}>
        <NonStyleLink to={MAP_USER_LINK(String(this.props.userId))}>
          <Button color="inherit" variant="outlined" sx={{ py: 2, px: 5 }}>
            <IconAndText
              iconComponent={<MapIcon fontSize="medium" />}
              text="マップ上で確認する"
              iconPosition="left"
              columnGap={1}
            />
          </Button>
        </NonStyleLink>
      </Box>
    );
  }
}

export type Props = {
  userId: number;
};
